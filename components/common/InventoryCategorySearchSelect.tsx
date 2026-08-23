'use client'

import { useEffect, useState, useTransition, useMemo } from 'react'
import { Combobox } from '@/components/ui/combobox'
import {
  getProductCategoriesSimpleList,
  SimpleCategory,
  ProductCategory,
} from '@/apiServices/inventoryCategoriesService'

type CategoryItem = SimpleCategory | ProductCategory | {
  id: number
  name: string
  status?: number
}

interface InventoryCategorySearchSelectProps {
  value?: string | null
  onValueChange?: (value: string | null) => void
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  className?: string
  categories?: CategoryItem[]
}

export default function InventoryCategorySearchSelect({
  value = "",
  onValueChange,
  placeholder = "Select category",
  searchPlaceholder = "Search category...",
  disabled = false,
  className,
  categories: initialCategories,
}: InventoryCategorySearchSelectProps) {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories || [])
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (initialCategories && initialCategories.length > 0) {
      setCategories(prev => {
        const map = new Map<string, CategoryItem>()
        initialCategories.forEach(c => map.set(String(c.id), c))
        prev.forEach(c => map.set(String(c.id), c))
        return Array.from(map.values())
      })
    }
  }, [initialCategories])

  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await getProductCategoriesSimpleList()
        if (res?.success) {
          const data = res.data
          const fetchedList: SimpleCategory[] = Array.isArray(data)
            ? data
            : Array.isArray((data as { categories?: SimpleCategory[] })?.categories)
            ? (data as { categories: SimpleCategory[] }).categories
            : []

          setCategories(prev => {
            const map = new Map<string, CategoryItem>()
            prev.forEach(c => map.set(String(c.id), c))
            fetchedList.forEach(c => map.set(String(c.id), c))
            return Array.from(map.values())
          })
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    })
  }, [])

  const options = useMemo(() => (categories || []).map(cat => ({
    value: String(cat.id),
    label: cat.name
  })), [categories])

  return (
    <Combobox
      options={options}
      value={value || ""}
      onValueChange={onValueChange}
      placeholder={isPending && !options.length ? "Loading categories..." : placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyMessage={isPending ? "Loading..." : "No categories found"}
      disabled={disabled}
      className={className}
    />
  )
}
