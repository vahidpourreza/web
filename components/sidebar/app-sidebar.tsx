'use client';

import * as React from 'react';

import { NavMain, type NavMainItem } from '@/components/sidebar/nav-main';
import { NavUser } from '@/components/sidebar/nav-user';
import { TeamSwitcher } from '@/components/sidebar/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { Coffee } from 'lucide-react';
import { useNavigationTreeByClient } from '@/api/access/navigation/hooks';
import type { ClientAppNavigationResponse } from '@/api/access/navigation/service';
import { getLucideIcon } from '@/lib/lucide-icon';

const teams = [
  {
    name: 'اسمارت کاپ',
    logo: <Coffee />,
    plan: 'نسخه بتا',
  },
];

function mapNavigationToNavItems(
  navigations: ClientAppNavigationResponse[] | null,
): NavMainItem[] {
  if (!navigations) return [];

  return navigations
    .filter((nav) => nav.type === 'Menu' || nav.type === 'Page')
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((nav) => {
      const Icon = getLucideIcon(nav.icon);
      const children = nav.type === 'Menu' ? mapNavigationToNavItems(nav.navigations) : [];

      return {
        title: nav.title,
        url: nav.route || '#',
        icon: Icon ? <Icon /> : undefined,
        ...(children.length > 0 ? { items: children } : {}),
      };
    });
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: navigations, isLoading } = useNavigationTreeByClient({
    clientApp: 'WebApp',
  });

  const navItems = React.useMemo(
    () => mapNavigationToNavItems(navigations ?? null),
    [navigations],
  );

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        {isLoading ? (
          <SidebarGroup>
            <SidebarMenu>
              {Array.from({ length: 6 }).map((_, i) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton>
                    <Skeleton className="size-4 rounded-md" />
                    <Skeleton className="h-4 flex-1" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ) : (
          <NavMain items={navItems} />
        )}
        {/* <NavProjects projects={data.projects} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
