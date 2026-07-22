'use client'

import { useState, useMemo, useRef, useEffect, useTransition, useCallback } from 'react'
import Image from 'next/image'
import {
  ComboboxRoot,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxChipsInput,
} from '@/components/ui/combobox'
import { ProductItem, getProductItems } from '@/apiServices/inventoryItemsService'
import { cn } from '@/lib/utils'
import { ChevronDownIcon } from 'lucide-react'

interface ProductSearchSelectProps {
  products?: ProductItem[]
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
  const [productsList, setProductsList] = useState<ProductItem[]>(products || [])
  const [productsMap, setProductsMap] = useState<Record<string, ProductItem>>(() => {
    const map: Record<string, ProductItem> = {}
    products?.forEach((p) => {
      map[String(p.id)] = p
    })
    return map
  })
  const [isPending, startTransition] = useTransition()
  const [inputValue, setInputValue] = useState("")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const anchor = useRef<HTMLDivElement | null>(null)

  // Initialize with prop values
  useEffect(() => {
    if (products && products.length > 0) {
      setProductsList(products)
      setProductsMap(prev => {
        const newMap = { ...prev }
        products.forEach(p => {
          if (p?.id != null) {
            newMap[String(p.id)] = p
          }
        })
        return newMap
      })
    }
  }, [products])

  // Dynamic API search with 300ms debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(async () => {
        try {
          const params: Record<string, unknown> = { page: 1, status: "1" }
          if (inputValue.trim()) {
            params.search = inputValue.trim()
          }
          const res = await getProductItems(params)
          if (res?.success) {
            const fetched = res?.data?.products || []
            const pagination = res?.data?.pagination
            setProductsList(fetched)
            setProductsMap(prev => {
              const newMap = { ...prev }
              fetched.forEach(p => {
                if (p?.id != null) {
                  newMap[String(p.id)] = p
                }
              })
              return newMap
            })
            setPage(1)
            const morePages = Boolean(
              pagination?.has_more_pages ||
              (pagination?.current_page && pagination?.last_page && pagination.current_page < pagination.last_page)
            )
            setHasMore(morePages)
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error("Failed to fetch products:", error.message)
          } else {
            console.error("An unknown error occurred while fetching products.")
          }
        }
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [inputValue])

  // Load next page on scroll
  const handleLoadMore = useCallback(async () => {
    if (!hasMore || isPending || isLoadingMore) return
    setIsLoadingMore(true)
    try {
      const nextPage = page + 1
      const params: Record<string, unknown> = { page: nextPage, status: "1" }
      if (inputValue.trim()) params.search = inputValue.trim()

      const res = await getProductItems(params)
      if (res?.success) {
        const fetched = res?.data?.products || []
        const pagination = res?.data?.pagination
        setProductsList(prev => {
          const existingIds = new Set(prev.map(p => p.id))
          const uniqueNew = fetched.filter(p => !existingIds.has(p.id))
          return [...prev, ...uniqueNew]
        })
        setProductsMap(prev => {
          const newMap = { ...prev }
          fetched.forEach(p => {
            if (p?.id != null) {
              newMap[String(p.id)] = p
            }
          })
          return newMap
        })
        setPage(nextPage)
        const morePages = Boolean(
          pagination?.has_more_pages ||
          (pagination?.current_page && pagination?.last_page && pagination.current_page < pagination.last_page)
        )
        setHasMore(morePages)
      }
    } catch (error) {
      console.error("Failed to load more products:", error)
    } finally {
      setIsLoadingMore(false)
    }
  }, [hasMore, isPending, isLoadingMore, page, inputValue])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget
    if (scrollHeight - scrollTop - clientHeight < 40) {
      handleLoadMore()
    }
  }

  const selectedProduct = useMemo(() => {
    if (!value) return null
    return productsMap[String(value)] || null
  }, [productsMap, value])

  return (
    <ComboboxRoot
      multiple={false}
      value={value || ""}
      onValueChange={(val) => {
        onValueChange?.(val as string | null)
        setInputValue("")
      }}
      onInputValueChange={setInputValue}
      disabled={disabled}
      itemToStringLabel={(val) => {
        const prod = productsMap[String(val)]
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
        <ComboboxList className="max-h-[280px] overflow-y-auto p-1" onScroll={handleScroll}>
          {productsList.map((product) => {
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
          {isLoadingMore && (
            <div className="py-2 text-center text-xs text-slate-400">Loading more...</div>
          )}
          {productsList.length === 0 && (
            <ComboboxEmpty>
              {isPending ? "Loading..." : "No products found"}
            </ComboboxEmpty>
          )}
        </ComboboxList>
      </ComboboxContent>
    </ComboboxRoot>
  )
}
