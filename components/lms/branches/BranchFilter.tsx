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
import { Search, FilterX } from "lucide-react"
import { Branch } from "@/apiServices/branchService"
import { District } from "@/apiServices/districtService" 
// import { Division } from "@/apiServices/divisionService"

interface FilterFormValues {
  search?: string
  sort_order?: string
  division_id?: string
  district_id?: string
}

interface BranchFilterProps {
  // divisions: Division[]
  districts: District[]
}

export default function BranchFilter({ districts }: BranchFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { register, control, reset, watch } = useForm<FilterFormValues>({
    defaultValues: {
      search: searchParams.get("search") || "",
      sort_order: searchParams.get("sort_order") || "",
      // division_id: searchParams.get("division_id") || "",
      district_id: searchParams.get("district_id") || "",
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

    const timer = setTimeout(() => {
      router.replace(`${pathname}?${params.toString()}`)
    }, 500)

    return () => clearTimeout(timer)
  }, [watchedValues, router, pathname, searchParams])

  const handleReset = () => {
    reset({
      search: "",
      sort_order: "",
      division_id: "",
      district_id: "",
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {/* Search Input */}
        <div className="relative col-span-1 lg:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search branches..."
            className="pl-10"
            {...register("search")}
          />
        </div>

        {/* Sort Order */}
        <Controller
          name="sort_order"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
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

        {/* Division Filter */}
        {/* <Controller
          name="division_id"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
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
        /> */}

        {/* District Filter */}
        <Controller
          name="district_id"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
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
      </div>
    </div>
  )
}
