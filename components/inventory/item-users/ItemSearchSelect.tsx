'use client'

import { useState, useMemo, useRef, useEffect, useTransition } from 'react'
import Image from 'next/image'
import {
  ComboboxRoot,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxChipsInput,
  ComboboxClear,
} from '@/components/ui/combobox'
import {
  SearchItemResult,
  searchInventoryItems,
} from '@/apiServices/inventoryItemUsersService'
import { getProductItemById } from '@/apiServices/inventoryItemsService'
import { cn } from '@/lib/utils'
import { ChevronDownIcon, Package, Barcode, Check } from 'lucide-react'

interface ItemSearchSelectProps {
  value?: number | string | null
  onValueChange?: (value: string | null) => void
  onItemChange?: (item: SearchItemResult | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  disabledItemIds?: string[]
}

export default function ItemSearchSelect({
  value,
  onValueChange,
  onItemChange,
  placeholder = "Select product item",
  disabled = false,
  className,
  disabledItemIds = [],
}: ItemSearchSelectProps) {
  const [itemsList, setItemsList] = useState<SearchItemResult[]>([])
  const [itemsMap, setItemsMap] = useState<Record<string, SearchItemResult>>({})
  const [isPending, startTransition] = useTransition()
  const [inputValue, setInputValue] = useState("")
  const anchor = useRef<HTMLDivElement | null>(null)

  // Fetch items when query changes with 300ms debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(async () => {
        try {
          const res = await searchInventoryItems(inputValue.trim(), 50)
          if (res?.success && res.data) {
            const fetched = res.data
            setItemsList(fetched)
            setItemsMap((prev) => {
              const newMap = { ...prev }
              fetched.forEach((item) => {
                if (item?.id != null) {
                  newMap[String(item.id)] = item
                }
              })
              return newMap
            })
          }
        } catch (error: unknown) {
          console.error("Failed to search inventory items:", error)
        }
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [inputValue])

  // If value is provided (e.g. from searchParams) but not in itemsMap, fetch product by ID
  useEffect(() => {
    const singleVal = typeof value === 'string' || typeof value === 'number' ? String(value) : null
    if (singleVal && !itemsMap[singleVal]) {
      const prodId = Number(singleVal)
      if (!isNaN(prodId) && prodId > 0) {
        getProductItemById(prodId)
          .then((res) => {
            if (res?.data) {
              const p = res.data
              const itemObj: SearchItemResult = {
                id: p.id,
                name: p.name,
                barcode: p.barcode || undefined,
                image: p.image || null,
                price: p.mrp_price ?? p.purchase_price ?? undefined,
              }
              setItemsMap((prev) => ({
                ...prev,
                [String(p.id)]: itemObj,
              }))
              setItemsList((prev) => {
                if (prev.some((x) => x.id === p.id)) return prev
                return [itemObj, ...prev]
              })
            }
          })
          .catch(() => {})
      }
    }
  }, [value, itemsMap])

  const singleValue = value != null && value !== "" ? String(value) : ""
  const selectedItem = useMemo(() => {
    if (!singleValue) return null
    return itemsMap[singleValue] || null
  }, [itemsMap, singleValue])

  const handleSelectChange = (val: string | null) => {
    onValueChange?.(val)
    const item = val ? itemsMap[val] || null : null
    onItemChange?.(item)
  }

  return (
    <ComboboxRoot
      multiple={false}
      value={singleValue}
      onValueChange={handleSelectChange}
      onInputValueChange={setInputValue}
      disabled={disabled}
      itemToStringLabel={(val) => {
        const item = itemsMap[val]
        if (!item) return val
        return item.barcode ? `${item.name} (${item.barcode})` : item.name
      }}
    >
      <div ref={anchor} className="relative w-full">
        <div
          className={cn(
            "relative flex min-h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 dark:bg-input/30",
            disabled && "cursor-not-allowed opacity-50 bg-muted/40",
            className
          )}
        >
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            {selectedItem ? (
              <div className="w-6 h-6 rounded-md border border-slate-200 overflow-hidden shrink-0 bg-white flex items-center justify-center shadow-2xs">
                <Image
                  src={(selectedItem.image && typeof selectedItem.image === "string" && selectedItem.image.trim() !== "") ? selectedItem.image : "/images/placeholder.png"}
                  alt={selectedItem.name}
                  width={24}
                  height={24}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              </div>
            ) : null}

            <div className="flex flex-col flex-1 min-w-0 justify-center">
              {selectedItem && !inputValue ? (
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-semibold text-sm text-slate-900 truncate leading-tight">
                    {selectedItem.name}
                  </span>
                  {selectedItem.barcode && (
                    <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200 shrink-0 leading-tight">
                      <Barcode className="w-3 h-3 mr-0.5 inline" />
                      {selectedItem.barcode}
                    </span>
                  )}
                </div>
              ) : null}

              <ComboboxChipsInput
                placeholder={selectedItem ? "" : isPending && !itemsList.length ? "Loading items..." : placeholder}
                className={cn(
                  "w-full text-sm outline-none bg-transparent h-7 p-0 border-none focus:ring-0 placeholder:text-muted-foreground",
                  selectedItem && !inputValue && "hidden"
                )}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-2">
            {(!!selectedItem || !!inputValue) && (
              <ComboboxClear
                onClick={() => {
                  setInputValue("")
                  handleSelectChange(null)
                }}
                className="opacity-60 hover:opacity-100 cursor-pointer p-1 rounded-md hover:bg-slate-100 transition-colors"
              />
            )}
            <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      <ComboboxContent
        anchor={anchor}
        className="w-[--anchor-width] min-w-[340px] max-h-[380px] z-[100] p-2 bg-popover border border-slate-200/90 rounded-2xl shadow-xl overflow-hidden"
      >
        <ComboboxList className="max-h-[340px] overflow-y-auto space-y-1.5 pr-1.5">
          {itemsList.map((item) => {
            const isSelected = singleValue === String(item.id)
            const isDisabled = disabledItemIds.includes(String(item.id))

            return (
              <ComboboxItem
                key={item.id}
                value={String(item.id)}
                disabled={isDisabled}
                className={cn(
                  "p-3 rounded-xl cursor-pointer border border-slate-100 bg-card hover:bg-slate-50 hover:border-slate-200 transition-all duration-150 shadow-2xs group pr-3.5 [&_[data-slot=combobox-item-indicator]]:hidden",
                  isSelected && "bg-blue-50/60 border-blue-200 ring-1 ring-blue-300/40 hover:bg-blue-50/80 hover:border-blue-300",
                  isDisabled && "opacity-40 cursor-not-allowed"
                )}
              >
                <div className="flex items-center justify-between gap-3 w-full min-w-0">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-lg border border-slate-150 bg-slate-50 flex items-center justify-center text-slate-500 shrink-0 overflow-hidden group-hover:bg-white transition-colors shadow-2xs">
                      <Image
                        src={(item.image && typeof item.image === "string" && item.image.trim() !== "") ? item.image : "/images/placeholder.png"}
                        alt={item.name}
                        width={36}
                        height={36}
                        unoptimized
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-900 transition-colors">
                        {item.name}
                      </span>
                      {item.barcode && (
                        <span className="text-xs text-slate-400 font-mono mt-0.5 truncate">
                          {item.barcode}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </ComboboxItem>
            )
          })}

          {itemsList.length === 0 && (
            <ComboboxEmpty className="py-6 text-center text-xs text-slate-400">
              {isPending ? "Loading items..." : "No items found"}
            </ComboboxEmpty>
          )}
        </ComboboxList>
      </ComboboxContent>
    </ComboboxRoot>
  )
}
