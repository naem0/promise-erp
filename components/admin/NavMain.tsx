import { type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar"
import { NavCollapsibleItem } from "./NavCollapsibleItem"
import { usePermission } from "@/hooks/usePermission"

type NavItem = {
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
}

type NavSection = {
  label?: string
  items: NavItem[]
}

export function NavMain({ sections }: { sections: NavSection[] }) {
  const { hasPermission, loading } = usePermission()

  if (loading) return null

  return (
    <>
      {sections.map((section, index) => {
        const visibleItems = section.items.filter((item) => {
          // 1. Check top-level permission
          if (item.permissions && !hasPermission(item.permissions)) return false

          // 2. For items with children (collapsed items), check if any sub-item is visible
          if (item.url === "#" && item.items) {
            return item.items.some(
              (subItem) => !subItem.permissions || hasPermission(subItem.permissions)
            )
          }

          return true
        })

        if (visibleItems.length === 0) return null

        return (
          <SidebarGroup key={section.label ?? `section-${index}`} className="py-0">
            {section.label && (
              <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            )}
            <SidebarMenu>
              {visibleItems.map((item) => (
                <NavCollapsibleItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )
      })}
    </>
  )
}
