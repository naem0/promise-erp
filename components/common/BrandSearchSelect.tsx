'use client'

import { useEffect, useState, useTransition, useMemo } from 'react'
import { Combobox } from '@/components/ui/combobox'
import {
  getBrandsSimpleList,
  SimpleBrand,
  Brand,
} from '@/apiServices/inventoryBrandsService'

type BrandItem = SimpleBrand | Brand | {
  id: number
  name: string
  status?: number
}

interface BrandSearchSelectProps {
  value?: string | null
  onValueChange?: (value: string | null) => void
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  className?: string
  brands?: BrandItem[]
}

export default function BrandSearchSelect({
  value = "",
  onValueChange,
  placeholder = "Select brand",
  searchPlaceholder = "Search brand...",
  disabled = false,
  className,
  brands: initialBrands,
}: BrandSearchSelectProps) {
  const [brands, setBrands] = useState<BrandItem[]>(initialBrands || [])
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (initialBrands && initialBrands.length > 0) {
      setBrands(prev => {
        const map = new Map<string, BrandItem>()
        initialBrands.forEach(b => map.set(String(b.id), b))
        prev.forEach(b => map.set(String(b.id), b))
        return Array.from(map.values())
      })
    }
  }, [initialBrands])

  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await getBrandsSimpleList()
        if (res?.success) {
          const data = res.data
          const fetchedList: SimpleBrand[] = Array.isArray(data)
            ? data
            : Array.isArray((data as { brands?: SimpleBrand[] })?.brands)
            ? (data as { brands: SimpleBrand[] }).brands
            : []

          setBrands(prev => {
            const map = new Map<string, BrandItem>()
            prev.forEach(b => map.set(String(b.id), b))
            fetchedList.forEach(b => map.set(String(b.id), b))
            return Array.from(map.values())
          })
        }
      } catch (error) {
        console.error("Failed to fetch brands:", error)
      }
    })
  }, [])

  const options = useMemo(() => (brands || []).map(brand => ({
    value: String(brand.id),
    label: brand.name
  })), [brands])

  return (
    <Combobox
      options={options}
      value={value || ""}
      onValueChange={onValueChange}
      placeholder={isPending && !options.length ? "Loading brands..." : placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyMessage={isPending ? "Loading..." : "No brands found"}
      disabled={disabled}
      className={className}
    />
  )
}
