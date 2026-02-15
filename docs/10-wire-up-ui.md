# Step 10: Wire Up UI Components

## Modify file: `components/sidebar/nav-user.tsx`

Replace the entire file:

```tsx
"use client"

import { signOut } from "next-auth/react"
import { useCurrentUser } from "@/hooks/use-current-user"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  ChevronsUpDownIcon,
  SparklesIcon,
  BadgeCheckIcon,
  CreditCardIcon,
  BellIcon,
  LogOutIcon,
  LoaderIcon,
} from "lucide-react"
import env from "@/config/env"

function handleLogout() {
  // Sign out from Auth.js, then redirect to IDP end-session
  signOut({
    redirectTo: `${env.auth.issuer}/connect/endsession?post_logout_redirect_uri=${encodeURIComponent(env.app.url)}`,
  })
}

export function NavUser() {
  const { isMobile } = useSidebar()
  const { user, isLoading } = useCurrentUser()

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <LoaderIcon className="size-4 animate-spin" />
            <span>در حال بارگذاری...</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  if (!user) return null

  const displayName = `${user.name} ${user.family}`.trim()
  const initials = user.name.charAt(0) + user.family.charAt(0)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="/avatars/shadcn.png" alt={displayName} />
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="truncate text-xs">{user.mobile}</span>
              </div>
              <ChevronsUpDownIcon className="ms-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src="/avatars/shadcn.png" alt={displayName} />
                  <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-start text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="truncate text-xs">{user.mobile}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <SparklesIcon />
                ارتقا به پرو
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheckIcon />
                حساب کاربری
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon />
                صورتحساب
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon />
                اعلان‌ها
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOutIcon />
              خروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
```

### Key changes from original:
- Removed `user` prop — now uses `useCurrentUser()` hook
- Added `handleLogout()` that signs out and redirects to IDP end-session
- Shows loading state while session is loading
- Displays real name/family/mobile from claims
- Initials use real user name

## Modify file: `components/sidebar/app-sidebar.tsx`

Remove the hardcoded user data and update NavUser usage:

```tsx
"use client"

import * as React from "react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavUser } from "@/components/sidebar/nav-user"
import { TeamSwitcher } from "@/components/sidebar/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  Coffee,
  LayoutDashboardIcon,
  UsersIcon,
  BuildingIcon,
  ShieldCheckIcon,
  UserIcon,
  MailPlusIcon,
  ShoppingBagIcon,
  DatabaseIcon,
  UtensilsCrossedIcon,
  GroupIcon,
  TagsIcon,
  ClipboardListIcon,
  MonitorIcon,
  ReceiptTextIcon,
  WalletIcon,
  Settings2Icon,
  CloudIcon,
  NetworkIcon,
  SendIcon,
  CalendarClockIcon,
  ShoppingCartIcon,
  FolderOpenIcon,
} from "lucide-react"

const data = {
  teams: [
    {
      name: "اسمارت کاپ",
      logo: <Coffee />,
      plan: "نسخه بتا",
    },
  ],
  navMain: [
    // ... same navMain array as before, no changes needed ...
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
```

### Key changes from original:
- Removed `data.user` (the hardcoded user object)
- Changed `<NavUser user={data.user} />` to just `<NavUser />` (no props)
- Everything else stays the same
