"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChevronLeftIcon } from "lucide-react"

export type NavMainItem = {
  title: string
  url: string
  icon?: React.ReactNode
  items?: NavMainItem[]
}

function isItemOrChildActive(item: NavMainItem, pathname: string): boolean {
  if (item.url !== "#" && pathname === item.url) return true
  if (item.items?.length) {
    return item.items.some((child) => isItemOrChildActive(child, pathname))
  }
  return false
}

function NavSubItem({ item, pathname }: { item: NavMainItem; pathname: string }) {
  const active = isItemOrChildActive(item, pathname)

  if (item.items?.length) {
    return (
      <SidebarMenuSubItem>
        <Collapsible defaultOpen={active}>
          <CollapsibleTrigger asChild>
            <SidebarMenuSubButton className="cursor-pointer">
              {item.icon}
              <span>{item.title}</span>
              <ChevronLeftIcon className="ms-auto size-3 transition-transform duration-200 [[data-state=open]>&]:-rotate-90" />
            </SidebarMenuSubButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items.map((subItem) => (
                <NavSubItem key={subItem.title} item={subItem} pathname={pathname} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuSubItem>
    )
  }

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild isActive={pathname === item.url}>
        <Link href={item.url}>
          {item.icon}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  )
}

export function NavMain({
  items,
}: {
  items: NavMainItem[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const active = isItemOrChildActive(item, pathname)

          return item.items?.length ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={active}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon}
                    <span>{item.title}</span>
                    <ChevronLeftIcon className="ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:-rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <NavSubItem key={subItem.title} item={subItem} pathname={pathname} />
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} isActive={pathname === item.url} asChild>
                <Link href={item.url}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
