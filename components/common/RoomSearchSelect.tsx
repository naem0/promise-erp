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
import { getRooms, Room } from '@/apiServices/inventoryRoomsService'
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

type RoomSearchSelectProps = (SingleSelectProps | MultiSelectProps) & {
  rooms?: Room[]
  placeholder?: string
  disabled?: boolean
  className?: string
  defaultValue?: string
  branchId?: string
}

export default function RoomSearchSelect({
  multiple = false,
  value,
  onValueChange,
  rooms: initialRooms,
  placeholder,
  disabled = false,
  className,
  branchId,
}: RoomSearchSelectProps) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms || [])
  const [isPending, startTransition] = useTransition()
  const [inputValue, setInputValue] = useState("")
  const anchor = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (initialRooms && initialRooms.length > 0 && !branchId) {
      setRooms(initialRooms)
      return
    }

    startTransition(async () => {
      try {
        const params: Record<string, unknown> = { per_page: 500 }
        if (branchId) {
          params.branch_id = branchId
        }
        const res = await getRooms(params)
        if (res?.success) {
          setRooms(res?.data?.rooms || [])
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Failed to fetch rooms:", error.message)
        } else {
          console.error("An unknown error occurred while fetching rooms.")
        }
      }
    })
  }, [initialRooms, branchId])

  const filteredRooms = useMemo(() => {
    if (!branchId) return rooms
    return rooms.filter((r) => r.branch?.id?.toString() === branchId)
  }, [rooms, branchId])

  const options = useMemo(() => (filteredRooms || []).map(room => ({
    value: String(room.id),
    label: `${room.name}${room.room_no ? ` (${room.room_no})` : ''}`
  })), [filteredRooms])

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
        key={`${branchId || ''}-${options.length}`}
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
            {multiValue.map((v) => {
              const label = options.find(o => o.value === v)?.label || v
              return (
                <ComboboxChip key={v}>
                  {label}
                </ComboboxChip>
              )
            })}
            <ComboboxChipsInput
              placeholder={
                multiValue.length === 0
                  ? isPending ? "Loading rooms..." : (placeholder || "Select room(s)")
                  : ""
              }
              className="min-w-[100px] text-sm outline-none bg-transparent"
            />
            <ChevronDownIcon className="ml-auto mr-1 size-4 shrink-0 text-muted-foreground self-center pointer-events-none" />
          </ComboboxChips>
        </div>

        <ComboboxContent anchor={anchor} className="w-[--anchor-width] min-w-[280px]">
          <ComboboxList className="max-h-[280px] overflow-y-auto p-1">
            {filteredOptions.map((option) => (
              <ComboboxItem key={option.value} value={option.value}>
                {option.label}
              </ComboboxItem>
            ))}
            <ComboboxEmpty>
              {isPending ? "Loading..." : "No rooms found"}
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
      key={`${branchId || ''}-${options.length}`}
      options={options}
      value={singleValue}
      onValueChange={singleOnValueChange}
      placeholder={isPending ? "Loading rooms..." : (placeholder || "Select room")}
      searchPlaceholder="Search room..."
      emptyMessage={isPending ? "Loading..." : "No rooms found"}
      disabled={disabled || isPending}
      className={className}
    />
  )
}
