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
import { Division } from "@/apiServices/divisionService"
import { District } from "@/apiServices/districtService"
import { Batch } from "@/apiServices/batchService"
import CourseSearchSelect from "@/components/common/CourseSearchSelect"
import { Search, FilterX } from "lucide-react"

interface FilterFormValues {
    search?: string
    sort_order?: string
    division_id?: string
    district_id?: string
    branch_id?: string
    course_id?: string
    batch_id?: string
    is_active?: string
}

interface GroupFilterProps {
    divisions: Division[]
    districts: District[]
    branches: Branch[]
    batches: Batch[]
}

export default function GroupFilter({
    divisions,
    districts,
    branches,
    batches,
}: GroupFilterProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { register, control, reset, watch } = useForm<FilterFormValues>({
        defaultValues: {
            search: searchParams.get("search") || "",
            sort_order: searchParams.get("sort_order") || "",
            division_id: searchParams.get("division_id") || "",
            district_id: searchParams.get("district_id") || "",
            branch_id: searchParams.get("branch_id") || "",
            course_id: searchParams.get("course_id") || "",
            batch_id: searchParams.get("batch_id") || "",
            is_active: searchParams.get("is_active") || "",
        },
    })

    const watchedValues = watch()

    useEffect(() => {
        const params = new URLSearchParams(searchParams)
        Object.entries(watchedValues).forEach(([key, value]) => {
            if (value) {
                params.set(key, String(value))
            } else {
                params.delete(key)
            }
        })
        params.set("page", "1")
        const timer = setTimeout(() => {
            router.replace(`${pathname}?${params.toString()}`)
        }, 500)

        return () => clearTimeout(timer)
    }, [JSON.stringify(watchedValues), router, pathname])

    const handleReset = () => {
        reset({
            search: "",
            sort_order: "",
            division_id: "",
            district_id: "",
            branch_id: "",
            course_id: "",
            batch_id: "",
            is_active: "",
        })
        router.replace(pathname)
    }

    const hasActiveFilters = Object.values(watchedValues).some(
        (value) => value && value !== ""
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
                <div className="relative col-span-1 lg:col-span-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search groups..."
                        className="pl-10"
                        {...register("search")}
                    />
                </div>

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

                <Controller
                    name="division_id"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Division" />
                            </SelectTrigger>
                            <SelectContent>
                                {divisions?.map((division) => (
                                    <SelectItem key={division.id} value={String(division.id)}>
                                        {division.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />

                <Controller
                    name="district_id"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="District" />
                            </SelectTrigger>
                            <SelectContent>
                                {districts?.map((district) => (
                                    <SelectItem key={district.id} value={String(district.id)}>
                                        {district.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />

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

                <Controller
                    name="batch_id"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Batch" />
                            </SelectTrigger>
                            <SelectContent>
                                {batches?.map((batch) => (
                                    <SelectItem key={batch.id} value={String(batch.id)}>
                                        {batch.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />

                <Controller
                    name="is_active"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Active</SelectItem>
                                <SelectItem value="0">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
        </div>
    )
}