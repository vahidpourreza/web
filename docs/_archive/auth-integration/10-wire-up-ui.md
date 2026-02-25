# Step 10: Wire Up UI Components

## First: Add a public env var for IDP issuer

The logout function runs client-side, so it needs a `NEXT_PUBLIC_` prefixed env var to access the IDP URL in the browser.

Add to `.env.local`:

```env
NEXT_PUBLIC_AUTH_ISSUER=https://localhost:5001
```

Add to `.env.example`:

```env
NEXT_PUBLIC_AUTH_ISSUER=https://localhost:5001
```

Add to `config/env.ts`:

```ts
const env = {
  auth: {
    issuer: process.env.AUTH_DUENDE_IDS_ISSUER!,
    clientId: process.env.AUTH_DUENDE_IDS_CLIENT_ID!,
    clientSecret: process.env.AUTH_DUENDE_IDS_CLIENT_SECRET!,
    secret: process.env.AUTH_SECRET!,
    publicIssuer: process.env.NEXT_PUBLIC_AUTH_ISSUER!,  // <-- add this
  },
  gateway: {
    url: process.env.NEXT_PUBLIC_GATEWAY_URL!,
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL!,
  },
} as const;

export default env;
```

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

function handleLogout() {
  const issuer = process.env.NEXT_PUBLIC_AUTH_ISSUER;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  signOut({
    redirectTo: `${issuer}/connect/endsession?post_logout_redirect_uri=${encodeURIComponent(appUrl ?? "")}`,
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

### Key changes from original nav-user.tsx:
- Removed `user` prop — now uses `useCurrentUser()` hook
- Added `handleLogout()` using `NEXT_PUBLIC_` env vars (client-safe)
- Shows loading state while session is loading
- Displays real name/family/mobile from claims

## Modify file: `components/sidebar/app-sidebar.tsx`

Only 2 changes needed:
1. Delete the `data.user` object (lines with name/mobile/avatar)
2. Change `<NavUser user={data.user} />` to `<NavUser />`

Everything else stays the same.
