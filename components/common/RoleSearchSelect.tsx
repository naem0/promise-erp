'use client'

import { useEffect, useState, useTransition, useMemo } from 'react'
import { Combobox } from '@/components/ui/combobox'
import {
  getRolesSimpleList,
  SimpleRole,
} from '@/apiServices/rolePermissionService'

export interface RoleOption {
  id: number
  name: string
  display_name?: string
}

export interface RoleSearchSelectProps {
  value?: string | null
  onValueChange?: (value: string | null) => void
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  className?: string
  roles?: RoleOption[]
  useNameAsValue?: boolean
  initialLabel?: string
}

export default function RoleSearchSelect({
  value = "",
  onValueChange,
  placeholder = "Select role",
  searchPlaceholder = "Search role...",
  disabled = false,
  className,
  roles: initialRoles,
  useNameAsValue = false,
  initialLabel,
}: RoleSearchSelectProps) {
  const [roles, setRoles] = useState<RoleOption[]>(initialRoles || [])
  const [isPending, startTransition] = useTransition()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOption, setSelectedOption] = useState<{
    value: string
    label: string
  } | null>(() => (value && initialLabel ? { value: String(value), label: initialLabel } : null))

  useEffect(() => {
    if (initialRoles && initialRoles.length > 0 && !searchTerm.trim()) {
      setRoles(initialRoles)
      return
    }

    const delayDebounce = setTimeout(() => {
      startTransition(async () => {
        try {
          const res = await getRolesSimpleList(searchTerm.trim() || undefined)
          if (res?.success && res?.data?.roles) {
            setRoles(res.data.roles)
          } else {
            setRoles([])
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error("Failed to fetch roles:", error.message)
          } else {
            console.error("An unexpected error occurred while fetching roles.")
          }
          setRoles([])
        }
      })
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [searchTerm, initialRoles])

  const options = useMemo(() => {
    return (roles || []).map((role) => ({
      value: useNameAsValue ? role.name : String(role.id),
      label: role.display_name || role.name,
    }))
  }, [roles, useNameAsValue])

  // Retain the selected option so it doesn't disappear when user searches
  useEffect(() => {
    if (value) {
      const found = options.find((o) => o.value === value)
      if (found) {
        setSelectedOption(found)
      } else if (initialLabel && (!selectedOption || selectedOption.value !== value)) {
        setSelectedOption({ value: String(value), label: initialLabel })
      }
    } else {
      setSelectedOption(null)
    }
  }, [value, options, initialLabel])

  const finalOptions = useMemo(() => {
    if (selectedOption && !options.some((o) => o.value === selectedOption.value)) {
      return [selectedOption, ...options]
    }
    return options
  }, [options, selectedOption])

  return (
    <Combobox
      options={finalOptions}
      value={value || ""}
      onValueChange={onValueChange}
      onInputValueChange={(val) => setSearchTerm(val)}
      placeholder={isPending && !finalOptions.length ? "Loading roles..." : placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyMessage={isPending ? "Loading..." : "No roles found"}
      disabled={disabled}
      disableFilter={true}
      className={className}
    />
  )
}
