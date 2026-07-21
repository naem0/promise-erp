'use client'

import { useEffect, useState, useTransition, useMemo, useRef } from 'react'
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
import { getProductCategoriesSimpleList, SimpleCategory } from '@/apiServices/inventoryCategoriesService'
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

type InventoryCategorySearchSelectProps = (SingleSelectProps | MultiSelectProps) & {
  placeholder?: string
  disabled?: boolean
  className?: string
  defaultValue?: string
}

export default function InventoryCategorySearchSelect({
  multiple = false,
  value,
  onValueChange,
  placeholder,
  disabled = false,
  className,
}: InventoryCategorySearchSelectProps) {
  const [categories, setCategories] = useState<SimpleCategory[]>([])
  const [isPending, startTransition] = useTransition()
  const [inputValue, setInputValue] = useState("")
  const anchor = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    startTransition(async () => {
      try {
        const res = await getProductCategoriesSimpleList()
        if (res?.success) {
          setCategories(res?.data || [])
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Failed to fetch categories:", error.message)
        } else {
          console.error("An unknown error occurred while fetching categories.")
        }
      }
    })
  }, [])

  const options = useMemo(() => (categories || []).map(category => ({
    value: String(category?.id),
    label: category?.name
  })), [categories])

  const filteredOptions = useMemo(() => {
    if (!inputValue) return options
    const lower = inputValue.toLowerCase()
    return options.filter(o => o.label.toLowerCase().includes(lower))
  }, [options, inputValue])

  if (multiple) {
    const multiValue = (value as string[]) || []
    const multiOnValueChange = onValueChange as (value: string[]) => void

    return (
      <ComboboxRoot
        key={options?.length}
        multiple={true}
        value={multiValue}
        onValueChange={(val) => multiOnValueChange(val as string[])}
        onInputValueChange={setInputValue}
        disabled={disabled || isPending}
        itemToStringLabel={(val) => options.find(o => o.value === val)?.label || ""}
      >
        <div ref={anchor} className="relative">
          <ComboboxChips
            className={cn(
              "min-h-10 w-full cursor-text rounded-md border border-input bg-background text-sm",
              className
            )}
          >
            {multiValue?.map((v) => {
              const label = options.find(o => o.value === v)?.label || v
              return (
                <ComboboxChip key={v}>
                  {label}
                </ComboboxChip>
              )
            })}
            <ComboboxChipsInput
              placeholder={
                multiValue?.length === 0
                  ? isPending ? "Loading categories..." : (placeholder || "Select category(s)")
                  : ""
              }
              className="min-w-[100px] text-sm outline-none bg-transparent"
            />
            <ChevronDownIcon className="ml-auto mr-1 size-4 shrink-0 text-muted-foreground self-center pointer-events-none" />
          </ComboboxChips>
        </div>

        <ComboboxContent anchor={anchor} className="w-[--anchor-width] min-w-[280px]">
          <ComboboxList className="max-h-[280px] overflow-y-auto p-1">
            {filteredOptions?.map((option) => (
              <ComboboxItem key={option.value} value={option.value}>
                {option.label}
              </ComboboxItem>
            ))}
            <ComboboxEmpty>
              {isPending ? "Loading..." : "No categories found"}
            </ComboboxEmpty>
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
      key={options?.length}
      options={options}
      value={singleValue}
      onValueChange={singleOnValueChange}
      placeholder={isPending ? "Loading categories..." : (placeholder || "Select category")}
      searchPlaceholder="Search category..."
      emptyMessage={isPending ? "Loading..." : "No categories found"}
      disabled={disabled || isPending}
      className={className}
    />
  )
}
