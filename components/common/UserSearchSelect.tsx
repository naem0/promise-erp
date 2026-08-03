'use client'

import { useEffect, useState, useTransition, useMemo } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import {
  getAllUserlist,
  UserList,
} from '@/apiServices/rolePermissionService'
import { useSession } from 'next-auth/react'

interface UserSearchSelectProps {
  value?: number | string | null
  onValueChange?: (value: number | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export default function UserSearchSelect({
  value,
  onValueChange,
  placeholder = "Select user",
  disabled = false,
  className,
}: UserSearchSelectProps) {
  const { data: session } = useSession()
  const [usersMap, setUsersMap] = useState<Record<string, UserList>>({})
  const [usersList, setUsersList] = useState<UserList[]>([])
  const [isPending, startTransition] = useTransition()
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!session?.accessToken) return

    const timer = setTimeout(() => {
      startTransition(async () => {
        try {
          const search = searchTerm.trim() ? searchTerm.trim() : undefined
          const res = await getAllUserlist(session.accessToken, { search })

          if (res?.success && res?.data?.users) {
            const fetchedUsers = res.data.users
            setUsersList(fetchedUsers)
            setUsersMap((prev) => {
              const newMap = { ...prev }
              fetchedUsers.forEach((user) => {
                if (user?.id != null) {
                  newMap[String(user.id)] = user
                }
              })
              return newMap
            })
          }
        } catch (error: unknown) {
          console.error("Failed to fetch users:", error)
          setUsersList([])
        }
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm, session?.accessToken])

  const options = useMemo(() => {
    const listMap = new Map<string, { value: string; label: string }>()

    ;(usersList || []).forEach((user) => {
      if (user?.id != null) {
        const valStr = String(user.id)
        listMap.set(valStr, {
          value: valStr,
          label: `${user.name} -> ${user.email}`,
        })
      }
    })

    const currentValStr = value != null ? String(value) : ""
    if (currentValStr && usersMap[currentValStr]) {
      const user = usersMap[currentValStr]
      if (!listMap.has(currentValStr)) {
        listMap.set(currentValStr, {
          value: currentValStr,
          label: `${user.name} -> ${user.email}`,
        })
      }
    }

    return Array.from(listMap.values())
  }, [usersList, usersMap, value])

  const singleValue = value != null ? String(value) : ""

  return (
    <Select
      value={singleValue}
      onValueChange={(val) => onValueChange?.(val ? Number(val) : null)}
      disabled={disabled || isPending}
    >
      <SelectTrigger className={className || "w-full"}>
        <SelectValue placeholder={isPending && !options.length ? "Loading users..." : placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-60 overflow-y-auto">
        <div
          className="p-2 sticky top-0 bg-popover z-10 border-b"
          onKeyDown={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 pl-8 text-xs w-full"
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}

        {options.length === 0 && (
          <div className="p-3 text-center text-xs text-muted-foreground">
            {isPending ? "Loading..." : "No users found"}
          </div>
        )}
      </SelectContent>
    </Select>
  )
}
