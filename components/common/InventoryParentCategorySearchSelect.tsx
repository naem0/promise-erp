'use client'

import { useEffect, useState, useTransition, useMemo, useRef, useCallback } from 'react'
import {
  Combobox,
  ComboboxRoot,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
} from '@/components/ui/combobox'
import { getProductCategoriesParentList, SimpleCategory } from '@/apiServices/inventoryCategoriesService'
import { cn } from '@/lib/utils'
import { ChevronDownIcon } from 'lucide-react'

interface SingleSelectProps {
  multiple?: false
  value?: string | null
  onValueChange?: (value: string | null) => void
}

interface MultiSelectProps {
  multiple: true
  value: string[]
  onValueChange: (value: string[]) => void
}

type InventoryParentCategorySearchSelectProps = (SingleSelectProps | MultiSelectProps) & {
  placeholder?: string
  disabled?: boolean
  className?: string
  defaultValue?: string
}

export default function InventoryParentCategorySearchSelect({
  multiple = false,
  value,
  onValueChange,
  placeholder,
  disabled = false,
  className,
}: InventoryParentCategorySearchSelectProps) {
  const [categoriesMap, setCategoriesMap] = useState<Record<string, SimpleCategory>>({})
  const [categoriesList, setCategoriesList] = useState<SimpleCategory[]>([])
  const [isPending, startTransition] = useTransition()
  const [inputValue, setInputValue] = useState("")
  const anchor = useRef<HTMLDivElement | null>(null)

  // Fetch parent categories when search input changes (with 300ms debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(async () => {
        const params = {
          search: inputValue.trim() ? inputValue.trim() : undefined,
        }
        try {
          const res = await getProductCategoriesParentList(params)
          if (res?.success) {
            const rawData = res?.data
            const fetchedList: SimpleCategory[] = Array.isArray(rawData)
              ? rawData
              : Array.isArray((rawData as { categories?: SimpleCategory[] })?.categories)
              ? (rawData as { categories: SimpleCategory[] }).categories
              : []

            setCategoriesList(fetchedList)
            setCategoriesMap(prev => {
              const newMap = { ...prev }
              fetchedList.forEach(cat => {
                if (cat?.id != null) {
                  newMap[String(cat.id)] = cat
                }
              })
              return newMap
            })
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error("Failed to fetch parent categories:", error.message)
          } else {
            console.error("An unknown error occurred while fetching parent categories.")
          }
        }
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [inputValue])

  const options = useMemo(() => (Array.isArray(categoriesList) ? categoriesList : []).map(category => ({
    value: String(category?.id),
    label: category?.name
  })), [categoriesList])

  const allOptionsMap = useMemo(() => {
    const map: Record<string, string> = {}
    Object.values(categoriesMap).forEach(cat => {
      if (cat?.id != null) {
        map[String(cat.id)] = cat.name
      }
    })
    return map
  }, [categoriesMap])

  if (multiple) {
    const multiValue = (value as string[]) || []
    const multiOnValueChange = onValueChange as (value: string[]) => void

    return (
      <ComboboxRoot
        multiple={true}
        value={multiValue}
        onValueChange={(val) => multiOnValueChange(val as string[])}
        onInputValueChange={setInputValue}
        disabled={disabled}
        itemToStringLabel={(val) => allOptionsMap[val] || val}
      >
        <div ref={anchor} className="relative">
          <ComboboxChips
            className={cn(
              "min-h-10 w-full cursor-text rounded-md border border-input bg-background text-sm",
              className
            )}
          >
            {multiValue?.map((v) => {
              const label = allOptionsMap[v] || v
              return (
                <ComboboxChip key={v}>
                  {label}
                </ComboboxChip>
              )
            })}
            <ComboboxChipsInput
              placeholder={
                multiValue?.length === 0
                  ? isPending ? "Loading..." : (placeholder || "Select parent category(s)")
                  : ""
              }
              className="min-w-[100px] text-sm outline-none bg-transparent"
            />
            <ChevronDownIcon className="ml-auto mr-1 size-4 shrink-0 text-muted-foreground self-center pointer-events-none" />
          </ComboboxChips>
        </div>

        <ComboboxContent anchor={anchor} className="w-[--anchor-width] min-w-[280px]">
          <ComboboxList className="max-h-[280px] overflow-y-auto p-1">
            {options?.map((option) => (
              <ComboboxItem key={option.value} value={option.value}>
                {option.label}
              </ComboboxItem>
            ))}
            {options.length === 0 && (
              <ComboboxEmpty>
                {isPending ? "Loading..." : "No parent categories found"}
              </ComboboxEmpty>
            )}
          </ComboboxList>
        </ComboboxContent>
      </ComboboxRoot>
    )
  }

  // Single select mode
  const singleValue = (value as string | null) || ""
  const singleOnValueChange = onValueChange as (value: string | null) => void

  return (
    <Combobox
      options={options}
      value={singleValue}
      onValueChange={singleOnValueChange}
      onInputValueChange={setInputValue}
      placeholder={isPending && !options.length ? "Loading parent categories..." : (placeholder || "Select parent category")}
      searchPlaceholder="Search parent category..."
      emptyMessage={isPending ? "Loading..." : "No parent categories found"}
      disabled={disabled}
      className={className}
    />
  )
}
