'use client'

import { useState, useMemo } from 'react'
import { 
  ComboboxRoot, 
  ComboboxTrigger, 
  ComboboxValue, 
  ComboboxContent, 
  ComboboxInput, 
  ComboboxList, 
  ComboboxItem, 
  ComboboxEmpty,
  ComboboxClear,
  useComboboxAnchor
} from '@/components/ui/combobox'
import { CRMReferrer } from '@/apiServices/crmReferrerService'
import { cn } from '@/lib/utils'

interface ReferrerSearchSelectProps {
  value: string | null
  onValueChange: (value: string | null) => void
  referrers: CRMReferrer[]
  placeholder?: string
  disabled?: boolean
  className?: string
}

export default function ReferrerSearchSelect({
  value,
  onValueChange,
  referrers = [],
  placeholder = "Select referrer",
  disabled = false,
  className
}: ReferrerSearchSelectProps) {
  const [inputValue, setInputValue] = useState("")

  const anchor = useComboboxAnchor()

  const options = useMemo(() => (referrers || []).map(ref => ({
    value: String(ref.id),
    label: `${ref.name} (${ref.phone})`
  })), [referrers])

  const filteredOptions = useMemo(() => {
    if (!inputValue) return options
    const lowerInput = inputValue.toLowerCase()
    return options.filter((option) =>
      option.label.toLowerCase().includes(lowerInput)
    )
  }, [options, inputValue])

  return (
    <div>
      <ComboboxRoot 
        value={value || ""} 
        onValueChange={(val) => onValueChange(val || null)}
        onInputValueChange={setInputValue}
        disabled={disabled}
        itemToStringLabel={(val) => options.find(o => o.value === val)?.label || ""}
      >
        <div ref={anchor} className="relative group">
          <ComboboxTrigger
            className={cn(
              "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background pl-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              value ? "pr-9" : "pr-3",
              value && "[&_[data-slot=combobox-trigger-icon]]:hidden",
              className
            )}
          >
            {value ? (
              <span className="text-left flex-1 truncate">
                <ComboboxValue />
              </span>
            ) : (
              <span className="text-muted-foreground text-left flex-1 truncate">
                {placeholder}
              </span>
            )}
          </ComboboxTrigger>
          {value && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
              <ComboboxClear />
            </div>
          )}
        </div>
        
        <ComboboxContent anchor={anchor} className="w-[--anchor-width] min-w-[300px]">
          <ComboboxInput 
            placeholder="Search referrer..." 
            className="m-1 h-9 border-none shadow-none focus-visible:ring-0"
            showTrigger={false}
            autoFocus
          />
          <ComboboxList className="max-h-[300px] overflow-y-auto">
            {filteredOptions.map((option) => (
              <ComboboxItem key={option.value} value={option.value}>
                {option.label}
              </ComboboxItem>
            ))}
            {filteredOptions.length === 0 && (
              <ComboboxEmpty>No referrers found</ComboboxEmpty>
            )}
          </ComboboxList>
        </ComboboxContent>
      </ComboboxRoot>
    </div>
  )
}
