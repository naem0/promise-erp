import { type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar"
import { NavCollapsibleItem } from "./NavCollapsibleItem"
import { usePermission } from "@/hooks/usePermission"

export function NavMain({
  items,
  label
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    permissions?: string[]
    items?: {
      title: string
      url: string
      permissions?: string[]
    }[]
  }[]
  label?: string
}) {
  const { hasPermission, loading } = usePermission()

  if (loading) return null

  const visibleItems = items.filter((item) => {
    // 1. Check top-level permission
    if (item.permissions && !hasPermission(item.permissions)) return false

    // 2. For items with children (collapsed items), check if any sub-item is visible
    if (item.url === "#" && item.items) {
      return item.items.some(subItem => !subItem.permissions || hasPermission(subItem.permissions))
    }

    return true
  })

  if (visibleItems.length === 0) return null

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {visibleItems.map((item) => (
          <NavCollapsibleItem key={item.title} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
