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

interface FilterFormValues {
  search?: string
  sort_order?: string
  status?: string
  type?: string
}


export default function StatsFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { register, control, reset, watch } = useForm<FilterFormValues>({
    defaultValues: {
      search: searchParams.get("search") || "",
      sort_order: searchParams.get("sort_order") || "",
      status: searchParams.get("status") || "",
      type: searchParams.get("type") || "",
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

    // Reset to page 1 when filters change
    params.delete("page")

    const timer = setTimeout(() => {
      router.replace(`${pathname}?${params.toString()}`)
    }, 500)

    return () => clearTimeout(timer)
  }, [JSON.stringify(watchedValues), router, pathname]);

  const handleReset = () => {
    reset({
      search: "",
      sort_order: "",
      status: "",
      type: "",
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Search Input */}
        <div className="relative col-span-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search statistics..."
            className="pl-10 focus-visible:ring-emerald-500"
            {...register("search")}
          />
        </div>

        {/* Type */}
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full focus:ring-emerald-500">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="achievement_stat">Achievement Stat</SelectItem>
                <SelectItem value="hero_stat">Hero Stat</SelectItem>
                <SelectItem value="opportunity_stat">Opportunity Stat</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        {/* Sort By */}
        <Controller
          name="sort_order"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full focus:ring-emerald-500">
                <SelectValue placeholder="Sort Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">ASC</SelectItem>
                <SelectItem value="desc">DESC</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {/* Status */}
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full focus:ring-emerald-500">
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
