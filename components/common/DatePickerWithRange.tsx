"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, X } from "lucide-react"
import { type DateRange } from "react-day-picker"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface DatePickerWithRangeProps {
  value?: DateRange
  onChange?: (date: DateRange | undefined) => void
  className?: string
  label?: string
  id?: string
}

// Helper to parse "YYYY-MM-DD" string as local date without timezone shifts
const parseLocalDate = (dateStr: string | null) => {
  if (!dateStr) return undefined
  const [year, month, day] = dateStr.split("-").map(Number)
  return new Date(year, month - 1, day)
}

export function DatePickerWithRange({
  value: controlledValue,
  onChange: controlledOnChange,
  className,
  label,
  id = "date-picker-range",
}: DatePickerWithRangeProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isControlled = controlledOnChange !== undefined

  // URL-driven state (used when not controlled)
  const dateFrom = searchParams.get("date_from")
  const dateTo = searchParams.get("date_to")

  const urlValue = React.useMemo(() => {
    if (!dateFrom) return undefined
    return {
      from: parseLocalDate(dateFrom),
      to: dateTo ? parseLocalDate(dateTo) : undefined,
    }
  }, [dateFrom, dateTo])

  const activeValue = isControlled ? controlledValue : urlValue

  const handleRangeChange = (range: DateRange | undefined) => {
    if (isControlled) {
      controlledOnChange?.(range)
    } else {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("page")

      if (range?.from) {
        params.set("date_from", format(range.from, "yyyy-MM-dd"))
      } else {
        params.delete("date_from")
      }

      if (range?.to) {
        params.set("date_to", format(range.to, "yyyy-MM-dd"))
      } else {
        params.delete("date_to")
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    handleRangeChange(undefined)
  }

  return (
    <Field className={cn("w-full", className)}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <Popover>
        <PopoverTrigger asChild>
          <div className="relative w-full cursor-pointer">
            <Button
              type="button"
              variant="outline"
              id={id}
              className="w-full justify-start text-left font-normal h-9 border bg-background pr-10 shadow-xs hover:bg-accent hover:text-accent-foreground"
            >
              <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              {activeValue?.from ? (
                activeValue.to ? (
                  <>
                    {format(activeValue.from, "LLL dd, y")} -{" "}
                    {format(activeValue.to, "LLL dd, y")}
                  </>
                ) : (
                  format(activeValue.from, "LLL dd, y")
                )
              ) : (
                <span className="text-muted-foreground">Pick a date range</span>
              )}
            </Button>
            {activeValue?.from && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    e.stopPropagation()
                    handleRangeChange(undefined)
                  }
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none z-10 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col">
            <Calendar
              mode="range"
              defaultMonth={activeValue?.from}
              selected={activeValue}
              onSelect={handleRangeChange}
              numberOfMonths={2}
              className="w-full"
              classNames={{
                day: `h-8 w-8 text-sm p-0 me-1 rounded-xl transition-colors hover:bg-gray-100 active:bg-gray-200 aria-selected:opacity-100`,
                day_button:
                  "h-full w-full rounded-md flex items-center justify-center",
              }}
            />
            <div className="flex items-center justify-end border-t p-3 ">
              <Button
                type="button"
                size="sm"
                onClick={() => handleRangeChange(undefined)}
                disabled={!activeValue?.from}
                className="text-xs h-8 border cursor-pointer border-muted-foreground/20  font-medium px-4 text-white "
              >
                Clear Range
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </Field>
  )
}
