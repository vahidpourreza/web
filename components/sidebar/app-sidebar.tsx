'use client';

import * as React from 'react';

import { NavMain } from '@/components/sidebar/nav-main';
// import { NavProjects } from "@/components/sidebar/nav-projects"
// import { NavSecondary } from "@/components/sidebar/nav-secondary"
import { NavUser } from '@/components/sidebar/nav-user';
import { TeamSwitcher } from '@/components/sidebar/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
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
} from 'lucide-react';

const data = {
  teams: [
    {
      name: 'اسمارت کاپ',
      logo: <Coffee />,
      plan: 'نسخه بتا',
    },
  ],
  navMain: [
    {
      title: 'داشبورد',
      url: '/',
      icon: <LayoutDashboardIcon />,
    },
    {
      title: 'کاربران و دسترسی‌ها',
      url: '#',
      icon: <UsersIcon />,
      items: [
        {
          title: 'مراکز',
          url: '/access/centers',
          icon: <BuildingIcon />,
        },
        {
          title: 'گروه‌های دسترسی',
          url: '/access/access-groups',
          icon: <ShieldCheckIcon />,
        },
        {
          title: 'کاربران',
          url: '/access/users',
          icon: <UserIcon />,
        },
        {
          title: 'دعوت‌نامه‌ها',
          url: '/access/invitations',
          icon: <MailPlusIcon />,
        },
      ],
    },
    {
      title: 'فروش',
      url: '#',
      icon: <ShoppingBagIcon />,
      items: [
        {
          title: 'اطلاعات پایه',
          url: '#',
          icon: <DatabaseIcon />,
          items: [
            {
              title: 'آیتم منو',
              url: '/sales/menu-items',
              icon: <UtensilsCrossedIcon />,
            },
            {
              title: 'گروه‌بندی',
              url: '/sales/groups',
              icon: <GroupIcon />,
            },
            {
              title: 'دسته‌بندی',
              url: '/sales/categories',
              icon: <TagsIcon />,
            },
          ],
        },
        {
          title: 'عملیات‌ها',
          url: '#',
          icon: <ClipboardListIcon />,
          items: [
            {
              title: 'صندوق فروش',
              url: '/sales/pos',
              icon: <MonitorIcon />,
            },
            {
              title: 'سفارشات',
              url: '/sales/orders',
              icon: <ReceiptTextIcon />,
            },
            {
              title: 'مدیریت صندوق',
              url: '/sales/cash-management',
              icon: <WalletIcon />,
            },
          ],
        },
      ],
    },
    {
      title: 'تنظیمات',
      url: '#',
      icon: <Settings2Icon />,
      items: [
        {
          title: 'کلاینت‌ها',
          url: '#',
          icon: <CloudIcon />,
          items: [
            {
              title: 'کلاینت و دستگاه‌ها',
              url: '/settings/clients/clients',
              icon: <NetworkIcon />,
            },
          ],
        },
        {
          title: 'پیام‌رسانی',
          url: '#',
          icon: <SendIcon />,
          items: [
            {
              title: 'رخدادها',
              url: '/settings/messaging/events',
              icon: <CalendarClockIcon />,
            },
          ],
        },
        {
          title: 'فروش',
          url: '#',
          icon: <ShoppingCartIcon />,
          items: [
            {
              title: 'کیوسک و نوبت',
              url: '/settings/order/tenant-setting',
              icon: <FolderOpenIcon />,
            },
          ],
        },
      ],
    },
  ],
  // navSecondary: [
  //   {
  //     title: "پشتیبانی",
  //     url: "#",
  //     icon: <LifeBuoyIcon />,
  //   },
  //   {
  //     title: "بازخورد",
  //     url: "#",
  //     icon: <SendIcon />,
  //   },
  // ],
  // projects: [
  //   {
  //     name: "مهندسی طراحی",
  //     url: "#",
  //     icon: <FrameIcon />,
  //   },
  //   {
  //     name: "فروش و بازاریابی",
  //     url: "#",
  //     icon: <PieChartIcon />,
  //   },
  //   {
  //     name: "سفر",
  //     url: "#",
  //     icon: <MapIcon />,
  //   },
  // ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
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
