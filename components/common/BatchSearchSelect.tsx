'use client'

import { useEffect, useState, useTransition } from 'react'
import { Combobox } from '@/components/ui/combobox'
import { getPublicBatches, PublicBatchItem } from '@/apiServices/batchService'

interface BatchSearchSelectProps {
  value?: string | null
  onValueChange?: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  courseId?: string | number
}

export default function BatchSearchSelect({
  value = "",
  onValueChange,
  placeholder = "Select batch",
  disabled = false,
  className,
  courseId
}: BatchSearchSelectProps) {
  const [batches, setBatches] = useState<PublicBatchItem[]>([])
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await getPublicBatches(
          undefined,
          courseId ? Number(courseId) : undefined
        )
        if (res?.success && Array.isArray(res?.data?.batches)) {
          setBatches(res?.data?.batches)
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Failed to fetch batches:", error.message)
        }
        console.error("An unexpected error occurred while fetching batches.")
      }
    })
  }, [courseId])

  const options = (batches || [])?.map(batch => ({
    value: String(batch?.batch_id),
    label: batch?.batch_name
  }))

  return (
    <Combobox
      key={`${value}-${options.length}`}
      options={options}
      value={value}
      onValueChange={onValueChange}
      placeholder={isPending ? "Loading batches..." : placeholder}
      searchPlaceholder="Search batch..."
      emptyMessage={isPending ? "Loading..." : "No batches found"}
      disabled={disabled || isPending}
      className={className}
    />
  )
}
