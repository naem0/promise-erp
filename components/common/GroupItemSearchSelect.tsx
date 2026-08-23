'use client'

import { useEffect, useState, useTransition, useRef } from 'react'
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
  searchInventoryGroupItems,
  InventorySearchGroupItem,
} from '@/apiServices/inventoryGroupItemsService'
import { cn } from '@/lib/utils'
import { ChevronDownIcon } from 'lucide-react'
import Image from 'next/image'

export interface GroupItemSearchSelectProps {
  groups?: (InventorySearchGroupItem | { id: number; name: string; barcode?: string | null; image?: string | null })[]
  value?: string | null
  onValueChange?: (value: string | null) => void
  onSelectGroup?: (group: InventorySearchGroupItem | null) => void
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  className?: string
}

export default function GroupItemSearchSelect({
  groups: initialGroups,
  value,
  onValueChange,
  onSelectGroup,
  placeholder = "Select Group Item",
  disabled = false,
  className,
}: GroupItemSearchSelectProps) {
  const [groupsList, setGroupsList] = useState<InventorySearchGroupItem[]>((initialGroups as InventorySearchGroupItem[]) || [])
  const [groupsMap, setGroupsMap] = useState<Record<string, InventorySearchGroupItem>>({})
  const [isPending, startTransition] = useTransition()
  const [inputValue, setInputValue] = useState("")
  const anchor = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (initialGroups && initialGroups.length > 0) {
      setGroupsList(initialGroups as InventorySearchGroupItem[])
      setGroupsMap((prev) => {
        const newMap = { ...prev }
        initialGroups.forEach((g) => {
          if (g?.id != null) {
            newMap[String(g.id)] = g as InventorySearchGroupItem
          }
        })
        return newMap
      })
    }
  }, [initialGroups])

  // Search group items with 300ms debounce (only depends on inputValue)
  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(async () => {
        try {
          const res = await searchInventoryGroupItems(inputValue.trim() || undefined)
          if (res?.success && Array.isArray(res.data)) {
            const fetched = res.data
            setGroupsList(fetched)
            setGroupsMap((prev) => {
              const newMap = { ...prev }
              fetched.forEach((g) => {
                if (g?.id != null) {
                  newMap[String(g.id)] = g
                }
              })
              return newMap
            })
          }
        } catch (error: unknown) {
          console.error("Failed to search group items:", error)
        }
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [inputValue])

  const singleValue = value != null && value !== "" ? String(value) : ""
  const selectedGroup = singleValue ? groupsMap[singleValue] : null

  const handleSelectChange = (val: string | null) => {
    onValueChange?.(val)
    if (onSelectGroup) {
      const selected = val ? groupsMap[val] || null : null
      onSelectGroup(selected)
    }
  }

  return (
    <ComboboxRoot
      multiple={false}
      value={singleValue}
      onValueChange={handleSelectChange}
      onInputValueChange={setInputValue}
      disabled={disabled}
      itemToStringLabel={(val) => {
        const g = groupsMap[val]
        if (!g) return val
        return g.name
      }}
    >
      <div ref={anchor} className="relative w-full">
        <div
          className={cn(
            "relative flex min-h-9 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-1 text-sm shadow-xs transition-colors focus-within:border-ring focus-within:ring-1 focus-within:ring-ring",
            disabled && "cursor-not-allowed opacity-50 bg-muted/40",
            className
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {selectedGroup ? (
              <div className="w-5 h-5 rounded border border-slate-200 overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center">
                <Image
                  src={(selectedGroup.image && typeof selectedGroup.image === "string" && selectedGroup.image.trim() !== "") ? selectedGroup.image : "/images/placeholder.png"}
                  alt={selectedGroup.name}
                  width={20}
                  height={20}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              </div>
            ) : null}

            <div className="flex flex-col flex-1 min-w-0 justify-center">
              {selectedGroup && !inputValue ? (
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-medium text-sm text-slate-900 truncate leading-tight">
                    {selectedGroup.name}
                  </span>
                </div>
              ) : null}

              <ComboboxChipsInput
                placeholder={selectedGroup ? "" : isPending && !groupsList.length ? "Loading..." : placeholder}
                className={cn(
                  "w-full text-sm outline-none bg-transparent h-7 p-0 border-none focus:ring-0 placeholder:text-muted-foreground",
                  selectedGroup && !inputValue && "hidden"
                )}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-1.5">
            {(!!selectedGroup || !!inputValue) && (
              <ComboboxClear
                onClick={() => {
                  setInputValue("")
                  handleSelectChange(null)
                }}
                className="opacity-60 hover:opacity-100 cursor-pointer p-0.5 rounded hover:bg-slate-100 transition-colors"
              />
            )}
            <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      <ComboboxContent anchor={anchor} className="w-[--anchor-width] min-w-[320px] z-100 p-1.5 bg-popover border border-slate-200 rounded-xl shadow-lg">
        <ComboboxList className="max-h-72 overflow-y-auto space-y-1 p-0.5">
          {groupsList.map((group) => {
            const isSelected = singleValue === String(group.id)
            const detailsCount = group.details?.length || 0

            return (
              <ComboboxItem
                key={group.id}
                value={String(group.id)}
                className={cn(
                  "p-2.5 rounded-lg cursor-pointer border border-slate-100/80 bg-card hover:bg-slate-50 hover:border-slate-200 transition-all shadow-2xs group [&_[data-slot=combobox-item-indicator]]:hidden",
                  isSelected && "bg-blue-50/70 border-blue-200 ring-1 ring-blue-300/40"
                )}
              >
                <div className="flex items-center gap-3 w-full min-w-0">
                  <div className="w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                    <Image
                      src={(group.image && typeof group.image === "string" && group.image.trim() !== "") ? group.image : "/images/placeholder.png"}
                      alt={group.name}
                      width={40}
                      height={40}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col text-left min-w-0 flex-1">
                    <span className="text-sm font-semibold text-slate-900 truncate leading-tight group-hover:text-blue-900 transition-colors">
                      {group.name}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5 truncate">
                      {group.barcode && (
                        <span>Barcode: {group.barcode}</span>
                      )}
                      {detailsCount > 0 && (
                        <span className="text-purple-600 font-sans font-medium">
                          ({detailsCount} {detailsCount === 1 ? 'item' : 'items'} included)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </ComboboxItem>
            )
          })}

          {groupsList.length === 0 && (
            <ComboboxEmpty className="py-5 text-center text-xs text-slate-400">
              {isPending ? "Loading group items..." : "No group items found"}
            </ComboboxEmpty>
          )}
        </ComboboxList>
      </ComboboxContent>
    </ComboboxRoot>
  )
}
