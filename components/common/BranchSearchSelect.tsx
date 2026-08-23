'use client'

import { useEffect, useState, useTransition, useMemo } from 'react'
import { Combobox } from '@/components/ui/combobox'
import { getPublicBranchListAll, PublicBranch } from '@/apiServices/branchService'
 
interface BranchSearchSelectProps {
  value?: string | null
  onValueChange?: (value: string | null) => void
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  className?: string
  branches?: { id: number; name: string }[]
}

export default function BranchSearchSelect({
  value = "",
  onValueChange,
  placeholder = "Select branch",
  searchPlaceholder = "Search branch...",
  disabled = false,
  className,
  branches: initialBranches,
}: BranchSearchSelectProps) {
  const [branches, setBranches] = useState<{ id: number; name: string }[]>(initialBranches || [])
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (initialBranches && initialBranches.length > 0) {
      setBranches(prev => {
        const map = new Map<string, { id: number; name: string }>()
        initialBranches.forEach(b => map.set(String(b.id), b))
        prev.forEach(b => map.set(String(b.id), b))
        return Array.from(map.values())
      })
    }
  }, [initialBranches])

  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await getPublicBranchListAll()
        if (res?.success) {
          const data = res.data
          const fetchedList: { id: number; name: string }[] = Array.isArray(data)
            ? data
            : Array.isArray((data as { branches?: PublicBranch[] })?.branches)
            ? (data as { branches: PublicBranch[] }).branches
            : []

          setBranches(prev => {
            const map = new Map<string, { id: number; name: string }>()
            prev.forEach(b => map.set(String(b.id), b))
            fetchedList.forEach(b => map.set(String(b.id), b))
            return Array.from(map.values())
          })
        }
      } catch (error) {
        console.error("Failed to fetch branches:", error)
      }
    })
  }, [])

  const options = useMemo(() => (branches || []).map(branch => ({
    value: String(branch.id),
    label: branch.name
  })), [branches])

  return (
    <Combobox
      options={options}
      value={value || ""}
      onValueChange={onValueChange}
      placeholder={isPending && !options.length ? "Loading branches..." : placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyMessage={isPending ? "Loading..." : "No branches found"}
      disabled={disabled}
      className={className}
    />
  )
}
