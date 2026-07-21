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
  const [roomsMap, setRoomsMap] = useState<Record<string, Room>>({})
  const [roomsList, setRoomsList] = useState<Room[]>(initialRooms || [])
  const [isPending, startTransition] = useTransition()
  const [inputValue, setInputValue] = useState("")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const anchor = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (initialRooms && initialRooms.length > 0) {
      setRoomsList(initialRooms)
      setRoomsMap(prev => {
        const newMap = { ...prev }
        initialRooms.forEach(room => {
          if (room?.id != null) {
            newMap[String(room.id)] = room
          }
        })
        return newMap
      })
    }
  }, [initialRooms])

  // Fetch page 1 when search input or branchId changes
  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(async () => {
        try {
          const params: Record<string, unknown> = { page: 1 }
          if (branchId) {
            params.branch_id = branchId
          }
          if (inputValue.trim()) {
            params.search = inputValue.trim()
          }
          const res = await getRooms(params)
          if (res?.success) {
            const fetched = res?.data?.rooms || []
            const pagination = res?.data?.pagination
            setRoomsList(fetched)
            setRoomsMap(prev => {
              const newMap = { ...prev }
              fetched.forEach(room => {
                if (room?.id != null) {
                  newMap[String(room.id)] = room
                }
              })
              return newMap
            })
            setPage(1)
            const morePages = Boolean(
              pagination?.has_more_pages ||
              (pagination?.current_page && pagination?.last_page && pagination.current_page < pagination.last_page)
            )
            setHasMore(morePages)
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error("Failed to fetch rooms:", error.message)
          } else {
            console.error("An unknown error occurred while fetching rooms.")
          }
        }
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [branchId, inputValue])

  // Load next page on scroll
  const handleLoadMore = useCallback(async () => {
    if (!hasMore || isPending || isLoadingMore) return
    setIsLoadingMore(true)
    try {
      const nextPage = page + 1
      const params: Record<string, unknown> = { page: nextPage }
      if (branchId) params.branch_id = branchId
      if (inputValue.trim()) params.search = inputValue.trim()

      const res = await getRooms(params)
      if (res?.success) {
        const fetched = res?.data?.rooms || []
        const pagination = res?.data?.pagination
        setRoomsList(prev => {
          const existingIds = new Set(prev.map(r => r.id))
          const uniqueNew = fetched.filter(r => !existingIds.has(r.id))
          return [...prev, ...uniqueNew]
        })
        setRoomsMap(prev => {
          const newMap = { ...prev }
          fetched.forEach(room => {
            if (room?.id != null) {
              newMap[String(room.id)] = room
            }
          })
          return newMap
        })
        setPage(nextPage)
        const morePages = Boolean(
          pagination?.has_more_pages ||
          (pagination?.current_page && pagination?.last_page && pagination.current_page < pagination.last_page)
        )
        setHasMore(morePages)
      }
    } catch (error) {
      console.error("Failed to load more rooms:", error)
    } finally {
      setIsLoadingMore(false)
    }
  }, [hasMore, isPending, isLoadingMore, page, branchId, inputValue])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget
    if (scrollHeight - scrollTop - clientHeight < 40) {
      handleLoadMore()
    }
  }

  const filteredRooms = useMemo(() => {
    const list = Array.isArray(roomsList) ? roomsList : []
    if (!branchId) return list
    return list.filter((r) => !r.branch?.id || r.branch?.id?.toString() === branchId)
  }, [roomsList, branchId])

  const options = useMemo(() => (Array.isArray(filteredRooms) ? filteredRooms : []).map(room => ({
    value: String(room.id),
    label: `${room.name}${room.room_no ? ` (${room.room_no})` : ''}`
  })), [filteredRooms])

  const allOptionsMap = useMemo(() => {
    const map: Record<string, string> = {}
    Object.values(roomsMap).forEach(room => {
      if (room?.id != null) {
        map[String(room.id)] = `${room.name}${room.room_no ? ` (${room.room_no})` : ''}`
      }
    })
    return map
  }, [roomsMap])

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
            {multiValue.map((v) => {
              const label = allOptionsMap[v] || v
              return (
                <ComboboxChip key={v}>
                  {label}
                </ComboboxChip>
              )
            })}
            <ComboboxChipsInput
              placeholder={
                multiValue.length === 0
                  ? isPending ? "Loading..." : (placeholder || "Select room(s)")
                  : ""
              }
              className="min-w-[100px] text-sm outline-none bg-transparent"
            />
            <ChevronDownIcon className="ml-auto mr-1 size-4 shrink-0 text-muted-foreground self-center pointer-events-none" />
          </ComboboxChips>
        </div>

        <ComboboxContent anchor={anchor} className="w-[--anchor-width] min-w-[280px]">
          <ComboboxList className="max-h-[280px] overflow-y-auto p-1" onScroll={handleScroll}>
            {options.map((option) => (
              <ComboboxItem key={option.value} value={option.value}>
                {option.label}
              </ComboboxItem>
            ))}
            {isLoadingMore && (
              <div className="py-2 text-center text-xs text-slate-400">Loading more...</div>
            )}
            {options.length === 0 && (
              <ComboboxEmpty>
                {isPending ? "Loading..." : "No rooms found"}
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
      onListScroll={handleScroll}
      placeholder={isPending && !options.length ? "Loading rooms..." : (placeholder || "Select room")}
      searchPlaceholder="Search room..."
      emptyMessage={isPending ? "Loading..." : "No rooms found"}
      disabled={disabled}
      className={className}
    />
  )
}

