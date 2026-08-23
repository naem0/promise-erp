'use client'

import { useEffect, useState, useTransition, useRef } from 'react'
import {
  ComboboxRoot,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxChipsInput,
  ComboboxClear,
} from '@/components/ui/combobox'
import { getEmployees, Employee } from '@/apiServices/employeeService'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { ChevronDownIcon, Mail, Briefcase, Building2 } from 'lucide-react'
import Image from 'next/image'

interface EmployeeSearchSelectProps {
  value?: number | string | null
  onValueChange?: (value: string | null) => void
  onEmployeeChange?: (employee: Employee | null) => void
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  className?: string
  branchId?: string | number
  employees?: Employee[]
}

export default function EmployeeSearchSelect({
  value,
  onValueChange,
  onEmployeeChange,
  placeholder = "Select Employee",
  disabled = false,
  className,
  branchId,
  employees: initialEmployees,
}: EmployeeSearchSelectProps) {
  const [employeesList, setEmployeesList] = useState<Employee[]>(initialEmployees || [])
  const [employeesMap, setEmployeesMap] = useState<Record<string, Employee>>({})
  const [isPending, startTransition] = useTransition()
  const [inputValue, setInputValue] = useState("")
  const anchor = useRef<HTMLDivElement | null>(null)

  // Initialize with initialEmployees safely
  useEffect(() => {
    if (initialEmployees && initialEmployees.length > 0) {
      setEmployeesList(initialEmployees)
      setEmployeesMap((prev) => {
        const newMap = { ...prev }
        initialEmployees.forEach((emp) => {
          if (emp?.id != null) {
            newMap[String(emp.id)] = emp
          }
        })
        return newMap
      })
    }
  }, [initialEmployees])

  // Debounced search (only depends on inputValue and branchId)
  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(async () => {
        try {
          const params: Record<string, unknown> = { per_page: 50 }
          if (branchId) {
            params.branch_id = branchId
          }
          if (inputValue.trim()) {
            params.search = inputValue.trim()
          }

          const res = await getEmployees(params)
          if (res?.success && res.data) {
            const fetchedList: Employee[] = Array.isArray(res.data)
              ? res.data
              : Array.isArray((res.data as { employees?: Employee[] })?.employees)
              ? (res.data as { employees: Employee[] }).employees
              : []

            setEmployeesList(fetchedList)
            setEmployeesMap((prev) => {
              const newMap = { ...prev }
              fetchedList.forEach((emp) => {
                if (emp?.id != null) {
                  newMap[String(emp.id)] = emp
                }
              })
              return newMap
            })
          }
        } catch (error) {
          console.error("Failed to fetch employees:", error)
        }
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [inputValue, branchId])

  const singleValue = value != null && value !== "" ? String(value) : ""
  const selectedEmployee = singleValue ? employeesMap[singleValue] : null

  const handleSelectChange = (val: string | null) => {
    onValueChange?.(val)
    if (onEmployeeChange) {
      const selected = val ? employeesMap[val] || null : null
      onEmployeeChange(selected)
    }
  }

  return (
    <ComboboxRoot
      multiple={false}
      value={singleValue}
      onValueChange={handleSelectChange}
      onInputValueChange={setInputValue}
      disabled={disabled}
      itemToStringLabel={(val) => {
        const emp = employeesMap[val]
        if (!emp) return val
        return emp.name
      }}
    >
      <div ref={anchor} className="relative w-full">
        <div
          className={cn(
            "relative flex min-h-9 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-1 text-sm shadow-xs transition-colors focus-within:border-ring focus-within:ring-1 focus-within:ring-ring",
            disabled && "cursor-not-allowed opacity-50 bg-muted/40",
            className
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {selectedEmployee ? (
              <Avatar className="w-5 h-5 border border-slate-200 shadow-2xs shrink-0">
                <AvatarImage
                  src={(selectedEmployee.profile_image && typeof selectedEmployee.profile_image === "string" && selectedEmployee.profile_image.trim() !== "") ? selectedEmployee.profile_image : "/images/profile_avatar.png"}
                  alt={selectedEmployee.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-slate-100 flex items-center justify-center">
                  <Image
                    src="/images/profile_avatar.png"
                    alt={selectedEmployee.name}
                    width={20}
                    height={20}
                    className="object-cover rounded-full"
                  />
                </AvatarFallback>
              </Avatar>
            ) : null}

            <div className="flex flex-col flex-1 min-w-0 justify-center">
              {selectedEmployee && !inputValue ? (
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-medium text-sm text-slate-900 truncate leading-tight">
                    {selectedEmployee.name}
                  </span>
                </div>
              ) : null}

              <ComboboxChipsInput
                placeholder={selectedEmployee ? "" : isPending && !employeesList.length ? "Loading..." : placeholder}
                className={cn(
                  "w-full text-sm outline-none bg-transparent h-7 p-0 border-none focus:ring-0 placeholder:text-muted-foreground",
                  selectedEmployee && !inputValue && "hidden"
                )}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-1.5">
            {(!!selectedEmployee || !!inputValue) && (
              <ComboboxClear
                onClick={() => {
                  setInputValue("")
                  handleSelectChange(null)
                }}
                className="opacity-60 hover:opacity-100 cursor-pointer p-0.5 rounded hover:bg-slate-100 transition-colors"
              />
            )}
            <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      <ComboboxContent anchor={anchor} className="w-[--anchor-width] min-w-[280px] max-w-[calc(100vw-2rem)] z-50 p-2 bg-popover border border-slate-200 rounded-2xl shadow-xl">
        <ComboboxList className="max-h-80 overflow-y-auto overflow-x-hidden space-y-1.5 pr-1">
          {employeesList.map((emp) => {
            const isSelected = singleValue === String(emp.id)
            const remainingBranches = (emp.branches?.length || 0) - 2

            return (
              <ComboboxItem
                key={emp.id}
                value={String(emp.id)}
                className={cn(
                  "p-2.5 rounded-xl cursor-pointer border border-slate-100 bg-card hover:bg-slate-50 hover:border-slate-200 transition-all duration-150 shadow-2xs group pr-3 [&_[data-slot=combobox-item-indicator]]:hidden",
                  isSelected && "bg-blue-50/70 border-blue-200 ring-1 ring-blue-300/40"
                )}
              >
                <div className="flex items-start gap-3 w-full min-w-0">
                  {/* Avatar */}
                  <Avatar className="w-10 h-10 border border-slate-200/90 shadow-xs shrink-0 mt-0.5">
                    <AvatarImage
                      src={(emp.profile_image && typeof emp.profile_image === "string" && emp.profile_image.trim() !== "") ? emp.profile_image : "/images/profile_avatar.png"}
                      alt={emp.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-slate-100 flex items-center justify-center">
                      <Image
                        src="/images/profile_avatar.png"
                        alt={emp.name}
                        width={40}
                        height={40}
                        className="object-cover rounded-full"
                      />
                    </AvatarFallback>
                  </Avatar>

                  {/* Details Container */}
                  <div className="flex flex-col text-left min-w-0 flex-1 space-y-1">
                    {/* Row 1: Name + Employee ID badge */}
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <span className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-900 transition-colors">
                        {emp.name}
                      </span>
                      {emp.employee_id && (
                        <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-200 shrink-0">
                          ID: {emp.employee_id}
                        </span>
                      )}
                    </div>

                    {/* Row 2: Email */}
                    {emp.email && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 min-w-0">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{emp.email}</span>
                      </div>
                    )}

                    {/* Row 3: Designation */}
                    {emp.designation?.name && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 min-w-0">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-600 truncate">{emp.designation.name}</span>
                      </div>
                    )}

                    {/* Row 4: Branch (Placed below Designation) */}
                    {emp.branches && emp.branches.length > 0 && (
                      <div className="flex items-center gap-1.5 text-xs min-w-0 pt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/70 text-[11px] font-medium leading-tight truncate max-w-full">
                          {emp.branches.slice(0, 2).map((b) => b.name).join(", ")}
                        </span>
                        {remainingBranches > 0 && (
                          <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs shrink-0">
                            +{remainingBranches}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </ComboboxItem>
            )
          })}

          {employeesList.length === 0 && (
            <ComboboxEmpty className="py-6 text-center text-xs text-slate-400">
              {isPending ? "Loading employees..." : "No employees found"}
            </ComboboxEmpty>
          )}
        </ComboboxList>
      </ComboboxContent>
    </ComboboxRoot>
  )
}
