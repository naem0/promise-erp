'use client'

import { useEffect, useState, useTransition } from 'react'
import { Combobox } from '@/components/ui/combobox'
import { getConsultants, Consultant } from '@/apiServices/crmLeadsActions'

interface ConsultantSearchSelectProps {
  value?: string | null
  onValueChange?: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export default function ConsultantSearchSelect({
  value = "",
  onValueChange,
  placeholder = "Select Counsellor",
  disabled = false,
  className
}: ConsultantSearchSelectProps) {
  const [consultants, setConsultants] = useState<Consultant[]>([])
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await getConsultants()
        setConsultants(res?.data?.consultants || [])
      } catch (error) {
        console.error("Failed to fetch consultants:", error)
      }
    })
  }, [])

  const options = consultants.map(c => ({
    value: String(c.id),
    label: c.name
  }))

  return (
    <Combobox
      key={`${value}-${options.length}`}
      options={options}
      value={value}
      onValueChange={onValueChange}
      placeholder={isPending ? "Loading..." : placeholder}
      searchPlaceholder="Search counsellor..."
      emptyMessage={isPending ? "Loading..." : "No counsellor found"}
      disabled={disabled || isPending}
      className={className}
    />
  )
}
