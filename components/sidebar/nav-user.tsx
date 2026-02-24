'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useQueryClient } from '@tanstack/react-query';
import { AccountSheet } from '@/components/account/account-sheet';
import { useProfile } from '@/api/access/profile';
import { FileCategory, TransformationPreset } from '@/api/file-manager/service';
import { buildCdnPresetUrl } from '@/api/file-manager/cdn';
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
import { QueryErrorState } from '@/components/query-error-state';
import { ModeToggle } from '@/components/theme/mode-toggle';
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
  const { data: profile, isLoading, isError, refetch } = useProfile();
  const [accountOpen, setAccountOpen] = useState(false);
  const qc = useQueryClient();

  function handleLogout() {
    const issuer = process.env.NEXT_PUBLIC_AUTH_ISSUER;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const idToken = session?.idToken;

    qc.clear();

    // 1. Clear HttpOnly session cookies via same-origin fetch (NOT signOut()
    //    which triggers SessionProvider events that cause HTTP 499 on the IDP).
    // 2. Then redirect to IDP end-session with id_token_hint.
    //    The IDP's own frontchannel logout runs in a cross-origin iframe,
    //    so browsers block its cookie deletion — we must do it ourselves first.
    const params = new URLSearchParams({
      post_logout_redirect_uri: appUrl ?? '',
      ...(idToken && { id_token_hint: idToken }),
    });

    fetch('/api/auth/frontchannel-logout', { method: 'GET' })
      .catch(() => {})
      .finally(() => {
        window.location.href = `${issuer}/connect/endsession?${params.toString()}`;
      });
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

  if (isError || !profile) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <QueryErrorState onRetry={() => refetch()} />
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const displayName = `${profile.firstName} ${profile.lastName}`.trim();
  const initials = profile.firstName.charAt(0) + profile.lastName.charAt(0);
  const avatarUrl = profile.avatarId
    ? buildCdnPresetUrl({
        category: FileCategory.Avatar,
        fileId: profile.avatarId,
        preset: TransformationPreset.Small,
      })
    : undefined;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar key={profile.avatarId ?? 'no-avatar'}>
                {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                <AvatarFallback>{initials}</AvatarFallback>
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
                <Avatar key={profile.avatarId ?? 'no-avatar'}>
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
                  <AvatarFallback>{initials}</AvatarFallback>
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
            <div className="flex justify-center px-2 py-1.5">
              <ModeToggle />
            </div>
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
