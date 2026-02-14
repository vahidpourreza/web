"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  TerminalSquareIcon,
  BotIcon,
  BookOpenIcon,
  Settings2Icon,
  LifeBuoyIcon,
  SendIcon,
  FrameIcon,
  PieChartIcon,
  MapIcon,
  Coffee,
} from "lucide-react";

const data = {
  user: {
    name: "وحید",
    mobile: "09112223344",
    avatar: "/avatars/shadcn.png",
  },
  navMain: [
    {
      title: "محیط آزمایشی",
      url: "#",
      icon: <TerminalSquareIcon />,
      isActive: true,
      items: [
        {
          title: "تاریخچه",
          url: "#",
        },
        {
          title: "ستاره‌دار",
          url: "#",
        },
        {
          title: "تنظیمات",
          url: "#",
        },
      ],
    },
    {
      title: "مدل‌ها",
      url: "#",
      icon: <BotIcon />,
      items: [
        {
          title: "جنسیس",
          url: "#",
        },
        {
          title: "کاوشگر",
          url: "#",
        },
        {
          title: "کوانتوم",
          url: "#",
        },
      ],
    },
    {
      title: "مستندات",
      url: "#",
      icon: <BookOpenIcon />,
      items: [
        {
          title: "معرفی",
          url: "#",
        },
        {
          title: "شروع کنید",
          url: "#",
        },
        {
          title: "آموزش‌ها",
          url: "#",
        },
        {
          title: "تغییرات",
          url: "#",
        },
      ],
    },
    {
      title: "تنظیمات",
      url: "#",
      icon: <Settings2Icon />,
      items: [
        {
          title: "عمومی",
          url: "#",
        },
        {
          title: "تیم",
          url: "#",
        },
        {
          title: "صورتحساب",
          url: "#",
        },
        {
          title: "محدودیت‌ها",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "پشتیبانی",
      url: "#",
      icon: <LifeBuoyIcon />,
    },
    {
      title: "بازخورد",
      url: "#",
      icon: <SendIcon />,
    },
  ],
  projects: [
    {
      name: "مهندسی طراحی",
      url: "#",
      icon: <FrameIcon />,
    },
    {
      name: "فروش و بازاریابی",
      url: "#",
      icon: <PieChartIcon />,
    },
    {
      name: "سفر",
      url: "#",
      icon: <MapIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Coffee className="size-4" />
                </div>
                <div className="grid flex-1 text-start text-sm leading-tight">
                  <span className="truncate font-medium">اسمارت کاپ</span>
                  <span className="truncate text-xs">نسخه بتا</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
