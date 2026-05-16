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
import { Search, FilterX } from "lucide-react"
import CourseSearchSelect from "@/components/common/CourseSearchSelect"

interface FilterFormValues {
  search?: string
  sort_order?: string
  is_govt?: boolean | null
  status?: string
  is_blocked?: boolean | null
  division_id?: string
  branch_id?: string
  course_id?: string
}

interface StudentFilterProps {
  divisions: Division[]
  branches: Branch[]
}


export default function StudentFilter({
  divisions,
  branches,
}: StudentFilterProps) {

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { register, control, reset, watch } = useForm<FilterFormValues>({
    defaultValues: {
      search: searchParams.get("search") || "",
      sort_order: searchParams.get("sort_order") || "",
      is_govt: searchParams.get("is_govt") === "true" ? true : null,
      status: searchParams.get("status") || "",
      is_blocked: searchParams.get("is_blocked") === "true" ? true : null,
      division_id: searchParams.get("division_id") || "",
      branch_id: searchParams.get("branch_id") || "",
      course_id: searchParams.get("course_id") || "",
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
  }, [JSON.stringify(watchedValues), router, pathname]);

  const handleReset = () => {
    reset({
      search: "",
      sort_order: "",
      is_govt: null,
      status: "",
      is_blocked: null,
      division_id: "",
      branch_id: "",
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

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {/* Search Input */}
        <div className="relative col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
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

        {/* Division */}
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
                  <SelectItem key={division?.id} value={String(division?.id)}>
                    {division?.name}
                  </SelectItem>
                ))}
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


        {/* Status  */}
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ""}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NOT_ENROLLED">Not Enrolled</SelectItem>
                <SelectItem value="FREE_COURSE_ENROLLED">Free Course Enrolled</SelectItem>
                <SelectItem value="PAID_COURSE_ENROLLED">Paid Course Enrolled</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {/*  is Govt & Is Blocked */}
        <Controller
          name="is_govt"
          control={control}
          render={({ field }) => (
            <Select onValueChange={(val) => field.onChange(val === "true")} value={field.value !== null ? String(field.value) : ""}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Is Govt" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <Controller
          name="is_blocked"
          control={control}
          render={({ field }) => (
            <Select onValueChange={(val) => field.onChange(val === "true")} value={field.value !== null ? String(field.value) : ""}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Is Blocked" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

      </div>
    </div>
  )
}