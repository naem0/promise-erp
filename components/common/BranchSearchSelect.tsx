'use client'

import { useEffect, useState, useTransition } from 'react'
import { Combobox } from '@/components/ui/combobox'
import { getPublicBranchListAll, PublicBranch } from '@/apiServices/branchService'
 
interface BranchSearchSelectProps {
  value: string
  onValueChange: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export default function BranchSearchSelect({
  value,
  onValueChange,
  placeholder = "Select branch",
  disabled = false,
  className  
}: BranchSearchSelectProps) {
  const [branches, setBranches] = useState<PublicBranch[]>([])
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await getPublicBranchListAll()
        if (res.success) {
          const data = res.data
          setBranches(Array.isArray(data) ? data : (data.branches || []))
        }
      } catch (error) {
        console.error("Failed to fetch branches:", error)
      }
    })
  }, [])

  const options = (branches || []).map(branch => ({
    value: String(branch.id),
    label: branch.name
  }))

  return (
    <Combobox
      key={`${value}-${options.length}`}
      options={options}
      value={value}
      onValueChange={onValueChange}
      placeholder={isPending ? "Loading branches..." : placeholder}
      searchPlaceholder="Search branch..."
      emptyMessage={isPending ? "Loading..." : "No branches found"}
      disabled={disabled || isPending}
      className={className}
    />
  )
}
