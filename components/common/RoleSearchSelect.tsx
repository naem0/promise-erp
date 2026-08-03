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
  getAllRolesList,
  getRolesSimpleList,
  Role,
} from '@/apiServices/rolePermissionService'
import { useSession } from 'next-auth/react'

interface RoleSearchSelectProps {
  value?: string | null
  onValueChange?: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  useNameAsValue?: boolean
}

export default function RoleSearchSelect({
  value = "",
  onValueChange,
  placeholder = "Select role",
  disabled = false,
  className,
  useNameAsValue = false,
}: RoleSearchSelectProps) {
  const { data: session } = useSession()
  const [roles, setRoles] = useState<Role[]>([])
  const [isPending, startTransition] = useTransition()
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    startTransition(async () => {
      try {
        let fetchedRoles: Role[] = []
        if (session?.accessToken) {
          const res = await getAllRolesList({
            token: session?.accessToken,
          })
          if (res?.success && res?.data?.roles) {
            fetchedRoles = res?.data?.roles
          }
        }

        if (fetchedRoles?.length === 0) {
          const resSimple = await getRolesSimpleList()
          if (resSimple?.success && resSimple?.data?.roles) {
            fetchedRoles = resSimple?.data?.roles as unknown as Role[]
          }
        }

        setRoles(fetchedRoles)
      } catch (error: unknown) {
        console.error("Failed to fetch roles:", error)
      }
    })
  }, [session?.accessToken])

  const filteredRoles = useMemo(() => {
    if (!searchTerm.trim()) return roles
    const lower = searchTerm.toLowerCase()
    return roles?.filter(
      (r) =>
        r?.name?.toLowerCase().includes(lower) ||
        r?.display_name?.toLowerCase().includes(lower)
    )
  }, [roles, searchTerm])

  return (
    <Select
      value={value || ""}
      onValueChange={(val) => onValueChange?.(val)}
      disabled={disabled || isPending}
    >
      <SelectTrigger className={className || "w-full"}>
        <SelectValue placeholder={isPending ? "Loading roles..." : placeholder} />
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
              placeholder="Search role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 pl-8 text-xs w-full"
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        {filteredRoles?.map((role) => {
          const val = useNameAsValue ? (role?.name || "") : String(role?.id)
          return (
            <SelectItem key={role?.id} value={val}>
              {role?.display_name || role?.name}
            </SelectItem>
          )
        })}

        {filteredRoles?.length === 0 && (
          <div className="p-3 text-center text-xs text-muted-foreground">
            {isPending ? "Loading..." : "No roles found"}
          </div>
        )}
      </SelectContent>
    </Select>
  )
}
