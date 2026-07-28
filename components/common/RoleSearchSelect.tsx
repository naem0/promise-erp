'use client'

import { useEffect, useState, useTransition, useMemo } from 'react'
import { Combobox } from '@/components/ui/combobox'
import {
  getRolesSimpleList,
  SimpleRole,
} from '@/apiServices/rolePermissionService'

interface RoleSearchSelectProps {
  value?: string | null
  onValueChange?: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  useNameAsValue?: boolean
}

export default function RoleSearchSelect({
  value,
  onValueChange,
  placeholder = 'Select role',
  disabled = false,
  className,
  useNameAsValue = false,
}: RoleSearchSelectProps) {
  const [roles, setRoles] = useState<SimpleRole[]>([])
  const [isPending, startTransition] = useTransition()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOption, setSelectedOption] = useState<{
    value: string
    label: string
  } | null>(null)

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      startTransition(async () => {
        try {
          const res = await getRolesSimpleList(searchTerm || undefined)
          if (res?.success && res?.data) {
            setRoles(res?.data?.roles || [])
          } else {
            setRoles([])
          }
        } catch (error: unknown) {
          console.error('Failed to fetch roles:', error)
          setRoles([])
        }
      })
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [searchTerm])

  const options = useMemo(() => {
    return (roles || [])?.map((role) => ({
      value: useNameAsValue ? (role?.name || '') : String(role?.id),
      label: role?.display_name || role?.name,
    }))
  }, [roles, useNameAsValue])

  // Retain the selected option so it doesn't disappear when user searches for something else
  useEffect(() => {
    if (value) {
      const found = options?.find((o) => o.value === value)
      if (found) {
        setSelectedOption(found)
      }
    } else {
      setSelectedOption(null)
    }
  }, [value, options])

  const finalOptions = useMemo(() => {
    if (selectedOption && !options?.some((o) => o.value === selectedOption?.value)) {
      return [selectedOption, ...options]
    }
    return options
  }, [options, selectedOption])

  return (
    <Combobox
      options={finalOptions}
      value={value || ''}
      onValueChange={onValueChange}
      onInputValueChange={(val) => setSearchTerm(val)}
      placeholder={isPending ? 'Loading roles...' : placeholder}
      searchPlaceholder="Search role..."
      emptyMessage={isPending ? 'Loading...' : 'No roles found'}
      disabled={disabled || isPending}
      disableFilter={true}
      className={className}
    />
  )
}
