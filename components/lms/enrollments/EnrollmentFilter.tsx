'use client'

import { useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Branch } from "@/apiServices/branchService"
import CourseSearchSelect from "@/components/common/CourseSearchSelect"
import { Search, FilterX } from "lucide-react"

interface FilterFormValues {
    search?: string
    sort_order?: string
    branch_id?: string
    batch_id?: string
    course_id?: string
}

interface EnrollmentFilterProps {
    branches: Branch[]
    batches: Array<{ id: number; name: string; course_id: number }>
}

export default function EnrollmentFilter({
    branches,
    batches,
}: EnrollmentFilterProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { register, control, reset, watch, setValue } = useForm<FilterFormValues>({
        defaultValues: {
            search: searchParams.get("search") || "",
            sort_order: searchParams.get("sort_order") || "",
            branch_id: searchParams.get("branch_id") || "",
            batch_id: searchParams.get("batch_id") || "",
            course_id: searchParams.get("course_id") || "",
        },
    })

    const watchedValues = watch()
    const selectedCourseId = watch("course_id")

    // Filter batches based on selected course
    const filteredBatches = selectedCourseId
        ? batches.filter((batch) => batch.course_id === Number(selectedCourseId))
        : batches

    // Reset batch_id when course_id changes
    useEffect(() => {
        // Only set value if it's currently something
        if (watchedValues.batch_id) {
            setValue("batch_id", "")
        }
    }, [selectedCourseId, setValue])

    useEffect(() => {
        const params = new URLSearchParams(searchParams)
        Object.entries(watchedValues).forEach(([key, value]) => {
            if (value) {
                params.set(key, String(value))
            } else {
                params.delete(key)
            }
        })
        params.set("page", "1") // Reset to first page on filter change
        const timer = setTimeout(() => {
            router.replace(`${pathname}?${params.toString()}`)
        }, 500)

        return () => clearTimeout(timer)
    }, [JSON.stringify(watchedValues), router, pathname]);

    const handleReset = () => {
        reset({
            search: "",
            sort_order: "",
            branch_id: "",
            batch_id: "",
            course_id: "",
        })
        router.replace(pathname)
    }

    const hasActiveFilters = Object.values(watchedValues).some(
        (value) => value && value !== "" && value !== false
    )

    return (
        <div className="p-6 mb-6 border rounded-xl bg-card shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Filters</h3>
                {hasActiveFilters && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        className="flex items-center gap-2"
                    >
                        <FilterX className="h-4 w-4" />
                        Clear Filters
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                {/* Search Input */}
                <div className="relative col-span-1 lg:col-span-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search enrollments..."
                        className="pl-10"
                        {...register("search")}
                    />
                </div>

                {/* Sort By */}
                <Controller
                    name="sort_order"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sort Order" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="asc">ASC</SelectItem>
                                <SelectItem value="desc">DESC</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />

                {/* Branch */}
                <Controller
                    name="branch_id"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Branch" />
                            </SelectTrigger>
                            <SelectContent>
                                {branches?.map((branch) => (
                                    <SelectItem key={branch.id} value={String(branch.id)}>
                                        {branch.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />

                {/* Course */}
                <Controller
                    name="course_id"
                    control={control}
                    render={({ field }) => (
                        <CourseSearchSelect 
                            value={field.value || ""} 
                            onValueChange={field.onChange}
                            placeholder="Select Course"
                        />
                    )}
                />

                {/* Batch */}
                <Controller
                    name="batch_id"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || ""} disabled={!selectedCourseId}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Batch" />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredBatches.map((batch) => (
                                    <SelectItem key={batch.id} value={String(batch.id)}>
                                        {batch.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
        </div>
    )
}
