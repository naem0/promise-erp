'use client'

import { useEffect, useState, useTransition, useMemo } from 'react'
import { Combobox } from '@/components/ui/combobox'
import {
  getDepartmentsSimpleList,
  SimpleDepartment,
} from '@/apiServices/departmentService'

interface DepartmentSearchSelectProps {
  value?: string | null
  onValueChange?: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export default function DepartmentSearchSelect({
  value,
  onValueChange,
  placeholder = 'Select department',
  disabled = false,
  className,
}: DepartmentSearchSelectProps) {
  const [departments, setDepartments] = useState<SimpleDepartment[]>([])
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
          const res = await getDepartmentsSimpleList(searchTerm || undefined)
          if (res?.success && res?.data) {
            setDepartments(res?.data?.departments || [])
          } else {
            setDepartments([])
          }
        } catch (error: unknown) {
          console.error('Failed to fetch departments:', error)
          setDepartments([])
        }
      })
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [searchTerm])

  const options = useMemo(() => {
    return (departments || [])?.map((department) => ({
      value: String(department?.id),
      label: department?.name,
    }))
  }, [departments])

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
      placeholder={isPending ? 'Loading departments...' : placeholder}
      searchPlaceholder="Search department..."
      emptyMessage={isPending ? 'Loading...' : 'No departments found'}
      disabled={disabled || isPending}
      disableFilter={true}
      className={className}
    />
  )
}
