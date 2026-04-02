"use client"

import * as React from "react"
import { ChevronRight, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { usePermission } from "@/hooks/usePermission"

export function NavCollapsibleItem({
    item,
}: {
    item: {
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
}) {
    const pathname = usePathname()
    const { hasPermission, loading } = usePermission()

    // Calculate active state
    const hasActiveChild = item.items?.some(
        (subItem) => pathname === subItem.url || pathname?.startsWith(subItem.url + "/")
    )
    const isSelfActive = pathname === item.url || (item.url !== "#" && pathname?.startsWith(item.url + "/"))

    // Determine if this group should be active (expanded) or highlighted
    const isActive = hasActiveChild || isSelfActive || item.isActive

    // State to manage open/close
    const [isOpen, setIsOpen] = React.useState(isActive)

    // Update open state when path changes and this item becomes active
    React.useEffect(() => {
        if (isActive) {
            setIsOpen(true)
        }
    }, [isActive])

    if (loading) return null

    if (item.permissions && !hasPermission(item.permissions)) {
        return null
    }

    // Filter sub items
    const visibleSubItems = item.items?.filter(subItem => {
        if (!subItem.permissions) return true;
        return hasPermission(subItem.permissions);
    });

    if (item.items && visibleSubItems?.length === 0 && item.url === "#") {
        return null; // Don't show parent if all children are hidden and parent itself is not a link
    }

    // ── Direct link item (no children, or all children hidden) ────
    const hasVisibleChildren = visibleSubItems && visibleSubItems.length > 0
    if (!item.items || item.items.length === 0 || !hasVisibleChildren) {
        return (
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={!!isActive}
                    className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary font-medium hover:bg-primary/5 hover:text-primary cursor-pointer"
                >
                    <Link href={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        )
    }

    // ── Collapsible item (has children) ─────────────────────────
    return (
        <Collapsible
            key={item.title}
            asChild
            open={isOpen}
            onOpenChange={setIsOpen}
            className="group/collapsible"
        >
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title} isActive={isActive} className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary font-medium hover:bg-primary/5 hover:text-primary cursor-pointer">
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {visibleSubItems?.map((subItem) => {
                            const isSubItemActive = pathname === subItem.url || pathname?.startsWith(subItem.url + "/")
                            return (
                                <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton asChild isActive={isSubItemActive} className="data-[active=true]:bg-primary/10 data-[active=true]:text-primary font-medium hover:bg-primary/5 hover:text-primary">
                                        <Link href={subItem.url}>
                                            <span>{subItem.title}</span>
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            )
                        })}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    )
}
