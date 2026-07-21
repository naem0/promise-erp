'use client'

import { useState, useMemo, useRef } from 'react'
import Image from 'next/image'
import {
  ComboboxRoot,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxChipsInput,
} from '@/components/ui/combobox'
import { ProductItem } from '@/apiServices/inventoryItemsService'
import { cn } from '@/lib/utils'
import { ChevronDownIcon } from 'lucide-react'

interface ProductSearchSelectProps {
  products: ProductItem[]
  value?: string | null
  onValueChange?: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  disabledProductIds?: string[]
}

export default function ProductSearchSelect({
  products,
  value,
  onValueChange,
  placeholder = "Select product",
  disabled = false,
  className,
  disabledProductIds = [],
}: ProductSearchSelectProps) {
  const [inputValue, setInputValue] = useState("")
  const anchor = useRef<HTMLDivElement | null>(null)

  const selectedProduct = useMemo(() => {
    if (!value) return null
    return products.find((p) => String(p.id) === String(value)) || null
  }, [products, value])

  const filteredProducts = useMemo(() => {
    if (!inputValue) return products
    const lower = inputValue.toLowerCase()
    return (products || []).filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        (p.barcode && p.barcode.toLowerCase().includes(lower)) ||
        (p.model && p.model.toLowerCase().includes(lower))
    )
  }, [products, inputValue])

  return (
    <ComboboxRoot
      key={products.length}
      multiple={false}
      value={value || ""}
      onValueChange={(val) => {
        onValueChange?.(val as string | null)
        setInputValue("")
      }}
      onInputValueChange={setInputValue}
      disabled={disabled}
      itemToStringLabel={(val) => {
        const prod = products.find((p) => String(p.id) === String(val))
        return prod ? prod.name : ""
      }}
    >
      <div ref={anchor} className="relative w-full">
        <div
          className={cn(
            "flex min-h-11 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-1.5 text-sm shadow-xs transition-colors focus-within:border-ring focus-within:ring-1 focus-within:ring-ring",
            disabled && "cursor-not-allowed opacity-50",
            className
          )}
        >
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            {selectedProduct && !inputValue && (
              <div className="relative w-7 h-7 rounded border overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center">
                <Image
                  src={selectedProduct.image || "/images/placeholder.png"}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex flex-col flex-1 min-w-0 justify-center">
              <ComboboxChipsInput
                placeholder={selectedProduct ? "" : placeholder}
                className="w-full text-sm outline-none bg-transparent h-6 p-0 border-none focus:ring-0"
              />
              {selectedProduct && !inputValue && (
                <span className="text-[11px] text-slate-400 leading-tight truncate">
                  {selectedProduct.barcode || selectedProduct.model || `#${selectedProduct.id}`}
                </span>
              )}
            </div>
          </div>
          <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground ml-2 pointer-events-none" />
        </div>
      </div>

      <ComboboxContent anchor={anchor} className="w-[--anchor-width] min-w-[300px]">
        <ComboboxList className="max-h-[280px] overflow-y-auto p-1">
          {filteredProducts.map((product) => {
            const isDisabled = disabledProductIds.includes(String(product.id))
            return (
              <ComboboxItem
                key={product.id}
                value={String(product.id)}
                disabled={isDisabled}
                className="py-2 px-2.5 cursor-pointer"
              >
                <div className="flex items-center gap-2.5 w-full min-w-0">
                  <div className="relative w-8 h-8 rounded border overflow-hidden shrink-0 bg-slate-100 flex items-center justify-center">
                    <Image
                      src={product.image || "/images/placeholder.png"}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col text-left min-w-0 flex-1">
                    <span className="text-sm font-medium text-slate-800 truncate leading-tight">
                      {product.name}
                    </span>
                    {product.barcode && (
                      <span className="text-xs text-slate-400 leading-tight mt-0.5">
                        {product.barcode}
                      </span>
                    )}
                  </div>
                </div>
              </ComboboxItem>
            )
          })}
          <ComboboxEmpty>No products found</ComboboxEmpty>
        </ComboboxList>
      </ComboboxContent>
    </ComboboxRoot>
  )
}
