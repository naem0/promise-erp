'use client'

import { useEffect, useState, useTransition, useMemo } from 'react'
import { Combobox } from '@/components/ui/combobox'
import { getDistricts } from '@/apiServices/districtService'

interface DistrictSearchSelectProps {
  value?: string | null
  onValueChange?: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  divisionId?: string | number | null
  initialLabel?: string
}

type DistrictOption = {
  id?: string | number | null
  name?: string | null
}

export default function DistrictSearchSelect({
  value,
  onValueChange,
  placeholder = 'Select district',
  disabled = false,
  className,
  divisionId,
  initialLabel,
}: DistrictSearchSelectProps) {
  const [districts, setDistricts] = useState<DistrictOption[]>([])
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
          const params: Record<string, unknown> = {
            per_page: 999,
          }
          if (divisionId) {
            params.division_id = divisionId
          }
          if (searchTerm?.trim()) {
            params.search = searchTerm.trim()
          }

          const res = await getDistricts(params)
          if (res?.success) {
            const rawData = res?.data
            const fetchedList: DistrictOption[] = Array.isArray(rawData)
              ? rawData
              : Array.isArray((rawData as { districts?: DistrictOption[] })?.districts)
              ? (rawData as { districts: DistrictOption[] }).districts
              : []
            setDistricts(fetchedList)
          } else {
            setDistricts([])
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error('Failed to fetch districts:', error.message)
          } else {
            console.error('An unexpected error occurred while fetching districts.')
          }
          setDistricts([])
        }
      })
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [searchTerm, divisionId])

  const options = useMemo(() => {
    return (districts || [])
      .filter((district) => district?.id != null)
      .map((district) => ({
        value: String(district.id),
        label: district.name?.trim() || 'Unnamed district',
      }))
  }, [districts])

  // Retain the selected option so it doesn't disappear when user searches for something else
  useEffect(() => {
    if (value) {
      const found = options.find((o) => o.value === String(value))
      if (found) {
        setSelectedOption(found)
      } else if (initialLabel && (!selectedOption || selectedOption.value !== String(value))) {
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
      key={`${value || ''}-${finalOptions.length}`}
      options={finalOptions}
      value={value || ''}
      onValueChange={onValueChange}
      onInputValueChange={(val) => setSearchTerm(val)}
      placeholder={isPending ? 'Loading districts...' : placeholder}
      searchPlaceholder="Search district..."
      emptyMessage={isPending ? 'Loading...' : 'No districts found'}
      disabled={disabled || isPending}
      disableFilter={true}
      className={className}
    />
  )
}

