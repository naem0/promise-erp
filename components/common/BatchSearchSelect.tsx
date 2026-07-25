'use client'

import { useEffect, useState, useTransition, useMemo } from 'react'
import { Combobox } from '@/components/ui/combobox'
import { getPublicBatches, PublicBatchItem } from '@/apiServices/batchService'

interface BatchSearchSelectProps {
  value?: string | null
  onValueChange?: (value: string | null) => void
  courseId?: string | number | null
  placeholder?: string
  disabled?: boolean
  className?: string
}

export default function BatchSearchSelect({
  value,
  onValueChange,
  courseId,
  placeholder,
  disabled = false,
  className,
}: BatchSearchSelectProps) {
  const [batches, setBatches] = useState<PublicBatchItem[]>([])
  const [isPending, startTransition] = useTransition()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOption, setSelectedOption] = useState<{ value: string; label: string } | null>(null)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      startTransition(async () => {
        try {
          const numericCourseId = courseId ? Number(courseId) : undefined;
          const res = await getPublicBatches(searchTerm || undefined, numericCourseId)
          if (res?.success && res?.data) {
            const items = res?.data?.batches || [];
            setBatches(items)
          } else {
            setBatches([])
          }
        } catch (error: unknown) {
          console.error("Failed to fetch public batches:", error)
          setBatches([])
        }
      })
    }, 300) // Debounce for 300ms

    return () => clearTimeout(delayDebounce)
  }, [searchTerm, courseId])

  const options = useMemo(() => {
    return (batches || [])?.map((batch) => ({
      value: String(batch?.batch_id || ""),
      label: batch
        ? `${batch?.batch_name || "N/A"} - ${batch?.course_name || "N/A"}${batch?.branch_name ? ` (${batch?.branch_name})` : ""}`
        : "Unknown Batch",
    }))
  }, [batches])

  // Retain the selected option so it doesn't disappear when user searches for something else
  useEffect(() => {
    if (value) {
      const found = options?.find((o) => o.value === value)
      if (found) {
        setSelectedOption(found)
      }
    } else {
      setSelectedOption(null)
    }
  }, [value, options])

  const finalOptions = useMemo(() => {
    if (selectedOption && !options?.some((o) => o.value === selectedOption.value)) {
      return [selectedOption, ...options]
    }
    return options
  }, [options, selectedOption])

  // Single select mode value
  const singleValue = value || ""

  return (
    <Combobox
      options={finalOptions}
      value={singleValue}
      onValueChange={onValueChange}
      onInputValueChange={(val) => setSearchTerm(val)}
      placeholder={isPending ? "Loading batches..." : (placeholder || "Select batch")}
      searchPlaceholder="Search batch by name, course, or branch..."
      emptyMessage={isPending ? "Loading..." : "No batches found"}
      disabled={disabled}
      disableFilter={true} // Disable local filter so API results take over
      className={className}
    />
  )
}
