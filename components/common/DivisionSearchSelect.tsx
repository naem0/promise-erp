'use client'

import { useEffect, useState, useTransition } from 'react'
import { Combobox } from '@/components/ui/combobox'
import { getPublicDivisionList, PublicDivision } from '@/apiServices/branchService'

interface DivisionSearchSelectProps {
  value?: string | null
  onValueChange?: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export default function DivisionSearchSelect({
  value = "",
  onValueChange,
  placeholder = "Select division",
  disabled = false,
  className
}: DivisionSearchSelectProps) {
  const [divisions, setDivisions] = useState<PublicDivision[]>([])
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await getPublicDivisionList()
        if (res?.success && Array.isArray(res?.data)) {
          setDivisions(res?.data)
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Failed to fetch divisions:", error.message)
        }
        console.error("An unexpected error occurred while fetching divisions.")
      }
    })
  }, [])

  const options = (divisions || [])?.map(division => ({
    value: String(division?.id),
    label: division?.name
  }))

  return (
    <Combobox
      key={`${value}-${options?.length}`}
      options={options}
      value={value}
      onValueChange={onValueChange}
      placeholder={isPending ? "Loading divisions..." : placeholder}
      searchPlaceholder="Search division..."
      emptyMessage={isPending ? "Loading..." : "No divisions found"}
      disabled={disabled || isPending}
      className={className}
    />
  )
}
