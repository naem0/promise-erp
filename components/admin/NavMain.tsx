import { type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar"
import { NavCollapsibleItem } from "./NavCollapsibleItem"

export function NavMain({
  items,
  lavel
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
  lavel?: string
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{lavel}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <NavCollapsibleItem key={item.title} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
