"use client"

import * as React from "react"
import { useEffect, useState, useTransition, useMemo } from 'react'

import {
  ComboboxRoot,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { getPublicCoursesAll, Course } from '@/apiServices/courseService'
import { cn, truncate } from '@/lib/utils'

interface CourseMultipleSearchSelectProps {
  value?: string[]
  onValueChange?: (value: string[]) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function CourseMultipleSearchSelect({
  value = [],
  onValueChange,
  placeholder = "Search courses...",
  disabled = false,
  className,
}: CourseMultipleSearchSelectProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [isPending, startTransition] = useTransition()
  const [inputValue, setInputValue] = useState("")

  const anchor = useComboboxAnchor()

  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await getPublicCoursesAll()
        if (res.success) {
          setCourses(res.data.courses || [])
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Failed to fetch courses:", error.message)
        } else {
          console.error("An unknown error occurred while fetching courses.")
        }
      }
    })
  }, [])

  const options = useMemo(() => (courses || []).map(course => ({
    value: String(course.id),
    label: course.title
  })), [courses])

  const filteredOptions = useMemo(() => {
    if (!inputValue) return options
    const lowerInput = inputValue.toLowerCase()
    return options.filter((option) =>
      option.label.toLowerCase().includes(lowerInput)
    )
  }, [options, inputValue])

  return (
    <div className={className}>
      <ComboboxRoot
        multiple
        value={value}
        onValueChange={(val) => onValueChange?.(val as unknown as string[])}
        onInputValueChange={setInputValue}
        disabled={disabled || isPending}
        itemToStringLabel={(val) => options.find(o => o.value === val)?.label || ""}
      >
        <ComboboxChips ref={anchor} className="w-full">
          <ComboboxValue>
            {(values) => (
              <React.Fragment>
                {(values as unknown as string[]).map((val: string) => {
                  const option = options.find(o => o.value === val)
                  return (
                    <ComboboxChip key={val}>{truncate(option ? option.label : val, 10)}</ComboboxChip>
                  )
                })}
                <ComboboxChipsInput
                  placeholder={
                    values.length === 0
                      ? (isPending ? "Loading courses..." : placeholder)
                      : ""
                  }
                />
              </React.Fragment>
            )}
          </ComboboxValue>
        </ComboboxChips>

        <ComboboxContent anchor={anchor} className="w-[--anchor-width] min-w-[300px]">
          <ComboboxList className="max-h-[300px] overflow-y-auto">
            {filteredOptions.map((option) => (
              <ComboboxItem key={option.value} value={option.value}>
                {option.label}
              </ComboboxItem>
            ))}
            {filteredOptions.length === 0 && (
              <ComboboxEmpty>{isPending ? "Loading..." : "No courses found."}</ComboboxEmpty>
            )}
          </ComboboxList>
        </ComboboxContent>
      </ComboboxRoot>
    </div>
  )
}

export default CourseMultipleSearchSelect
