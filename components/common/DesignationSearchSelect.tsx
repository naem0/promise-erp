'use client'

import { useEffect, useState, useTransition, useMemo } from 'react'
import { Combobox } from '@/components/ui/combobox'
import {
  getDesignationsSimpleList,
  SimpleDesignation,
} from '@/apiServices/designationService'

interface DesignationSearchSelectProps {
  value?: string | null
  onValueChange?: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  initialLabel?: string
}

export default function DesignationSearchSelect({
  value,
  onValueChange,
  placeholder = 'Select designation',
  disabled = false,
  className,
  initialLabel,
}: DesignationSearchSelectProps) {
  const [designations, setDesignations] = useState<SimpleDesignation[]>([])
  const [isPending, startTransition] = useTransition()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOption, setSelectedOption] = useState<{
    value: string
    label: string
  } | null>(() => (value && initialLabel ? { value: String(value), label: initialLabel } : null))

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      startTransition(async () => {
        try {
          const res = await getDesignationsSimpleList(searchTerm || undefined)
          if (res?.success && res?.data) {
            setDesignations(res?.data?.designations || [])
          } else {
            setDesignations([])
          }
        } catch (error: unknown) {
          console.error('Failed to fetch designations:', error)
          setDesignations([])
        }
      })
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [searchTerm])

  const options = useMemo(() => {
    return (designations || [])?.map((designation) => ({
      value: String(designation?.id),
      label: designation?.name,
    }))
  }, [designations])

  // Retain the selected option so it doesn't disappear when user searches for something else
  useEffect(() => {
    if (value) {
      const found = options?.find((o) => o?.value === value)
      if (found) {
        setSelectedOption(found)
      } else if (initialLabel && (!selectedOption || selectedOption?.value !== value)) {
        setSelectedOption({ value: String(value), label: initialLabel })
      }
    } else {
      setSelectedOption(null)
    }
  }, [value, options, initialLabel])

  const finalOptions = useMemo(() => {
    if (selectedOption && !options?.some((o) => o?.value === selectedOption?.value)) {
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
      placeholder={isPending && !finalOptions.length ? 'Loading designations...' : placeholder}
      searchPlaceholder="Search designation..."
      emptyMessage={isPending ? 'Loading...' : 'No designations found'}
      disabled={disabled}
      disableFilter={true}
      className={className}
    />
  )
}
