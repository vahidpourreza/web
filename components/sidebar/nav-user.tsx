'use client';

import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useQueryClient } from '@tanstack/react-query';
import { AccountSheet } from '@/components/account/account-sheet';
import { useProfile } from '@/api/access/profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChevronsUpDownIcon,
  SparklesIcon,
  BadgeCheckIcon,
  CreditCardIcon,
  BellIcon,
  LogOutIcon,
} from 'lucide-react';

export function NavUser() {
  const { isMobile } = useSidebar();
  const { data: session } = useSession();
  const { data: profile, isLoading } = useProfile();
  const [accountOpen, setAccountOpen] = useState(false);
  const qc = useQueryClient();

  async function handleLogout() {
    const issuer = process.env.NEXT_PUBLIC_AUTH_ISSUER;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const idToken = session?.idToken;

    // First clear the NextAuth session without redirecting
    await signOut({ redirect: false });
    qc.clear();

    // Then redirect to IDP end-session to kill the IDP session too
    const params = new URLSearchParams({
      post_logout_redirect_uri: appUrl ?? '',
      ...(idToken && { id_token_hint: idToken }),
    });
    window.location.href = `${issuer}/connect/endsession?${params.toString()}`;
  }

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="grid flex-1 gap-1.5">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!profile) return null;

  const displayName = `${profile.firstName} ${profile.lastName}`.trim();
  const initials = profile.firstName.charAt(0) + profile.lastName.charAt(0);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="rounded-lg">
                <AvatarImage src="/avatars/shadcn.png" alt={displayName} />
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="truncate text-xs">{profile.mobile}</span>
              </div>
              <ChevronsUpDownIcon className="ms-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                <Avatar className="rounded-lg">
                  <AvatarImage src="/avatars/shadcn.png" alt={displayName} />
                  <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-start text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="truncate text-xs">{profile.mobile}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                variant="destructive"
                className="!text-amber-500 focus:!bg-amber-500/10 [&_svg]:!text-amber-500"
                disabled
              >
                <SparklesIcon />
                ارتقا به پرو
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setAccountOpen(true)}>
                <BadgeCheckIcon />
                حساب کاربری
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <CreditCardIcon />
                صورتحساب
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <BellIcon />
                اعلان‌ها
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={handleLogout}
            >
              <LogOutIcon />
              خروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <AccountSheet open={accountOpen} onOpenChange={setAccountOpen} />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
