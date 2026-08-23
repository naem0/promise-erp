'use client'

import { useEffect, useState, useTransition, useMemo } from 'react'
import Image from 'next/image'
import {
  ComboboxRoot,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from '@/components/ui/combobox'
import { getConsultants, Consultant } from '@/apiServices/crmLeadsActions'

interface ConsultantSearchSelectProps {
  value?: string | null
  onValueChange?: (value: string | null) => void
  onConsultantChange?: (consultant: Consultant | null) => void
  consultants?: Consultant[]
  branchId?: string | number | null
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  className?: string
}

export default function ConsultantSearchSelect({
  value = "",
  onValueChange,
  onConsultantChange,
  consultants: initialConsultants,
  branchId,
  placeholder = "Select Counsellor",
  searchPlaceholder = "Search counsellor...",
  disabled = false,
  className,
}: ConsultantSearchSelectProps) {
  const [consultantsList, setConsultantsList] = useState<Consultant[]>(initialConsultants || [])
  const [inputValue, setInputValue] = useState("")
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (initialConsultants && initialConsultants.length > 0) {
      setConsultantsList(initialConsultants)
      return
    }
    startTransition(async () => {
      try {
        const res = await getConsultants()
        setConsultantsList(res?.data?.consultants || [])
      } catch (error) {
        console.error("Failed to fetch consultants:", error)
      }
    })
  }, [initialConsultants])

  const consultantsMap = useMemo(() => {
    const map: Record<string, Consultant> = {}
    consultantsList.forEach((c) => {
      if (c?.id != null) {
        map[String(c.id)] = c
      }
    })
    return map
  }, [consultantsList])

  const selectedConsultant = useMemo(() => {
    return value ? consultantsMap[String(value)] : null
  }, [consultantsMap, value])

  const filteredConsultants = useMemo(() => {
    let list = consultantsList

    if (branchId) {
      const bIdStr = String(branchId)
      list = list.filter((c) => c.branches?.some((b) => String(b.id) === bIdStr))
    }

    if (!inputValue.trim() || (selectedConsultant && inputValue.trim() === selectedConsultant.name)) {
      return list
    }

    const query = inputValue.trim().toLowerCase()
    return list.filter((c) =>
      c.name?.toLowerCase().includes(query) ||
      c.designation_name?.toLowerCase().includes(query) ||
      c.department_name?.toLowerCase().includes(query)
    )
  }, [consultantsList, branchId, inputValue, selectedConsultant])

  const handleValueChange = (val: string | null) => {
    onValueChange?.(val)
    const consultant = val ? consultantsMap[val] || null : null
    onConsultantChange?.(consultant)
  }

  return (
    <ComboboxRoot
      disabled={disabled || (isPending && !consultantsList.length)}
      multiple={false}
      value={value || ""}
      onValueChange={handleValueChange}
      onInputValueChange={setInputValue}
      itemToStringLabel={(val) => {
        const c = consultantsMap[val]
        return c ? c.name : ""
      }}
    >
      <ComboboxInput
        placeholder={
          isPending && !consultantsList.length
            ? "Loading counsellors..."
            : (searchPlaceholder || placeholder)
        }
        showClear={!!value}
        showTrigger={true}
        className={className}
        disabled={disabled || (isPending && !consultantsList.length)}
      />
      <ComboboxContent>
        <ComboboxList className="max-h-64 overflow-y-auto p-1.5 space-y-1">
          {filteredConsultants.map((consultant) => (
            <ComboboxItem
              key={consultant.id}
              value={String(consultant.id)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors"
            >
              <div className="relative w-7 h-7 rounded-full border overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center">
                <Image
                  src={(consultant?.profile_image && typeof consultant?.profile_image === "string" && consultant?.profile_image.trim() !== "") ? consultant?.profile_image : "/images/profile_avatar.png"}
                  alt={consultant?.name || "Counsellor"}
                  width={28}
                  height={28}
                  className="rounded-full object-cover"
                />
              </div>
              <div className="flex flex-col text-left min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate leading-tight">
                  {consultant.name}
                </p>
                {consultant.designation_name && (
                  <span className="text-xs text-muted-foreground truncate leading-tight mt-0.5">
                    {consultant.designation_name}
                    {consultant.department_name ? ` • ${consultant.department_name}` : ""}
                  </span>
                )}
              </div>
            </ComboboxItem>
          ))}

          {filteredConsultants.length === 0 && (
            <ComboboxEmpty>
              {isPending
                ? "Loading..."
                : branchId
                ? "No counsellors found for this branch."
                : "No counsellors found."}
            </ComboboxEmpty>
          )}
        </ComboboxList>
      </ComboboxContent>
    </ComboboxRoot>
  )
}
