"use client"

import * as React from "react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavProjects } from "@/components/sidebar/nav-projects"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
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
  HistoryIcon,
  StarIcon,
  SettingsIcon,
  SparklesIcon,
  TelescopeIcon,
  AtomIcon,
  InfoIcon,
  RocketIcon,
  GraduationCapIcon,
  FileTextIcon,
  SlidersHorizontalIcon,
  LanguagesIcon,
  PaletteIcon,
  UsersIcon,
  CreditCardIcon,
  GaugeIcon,
  LayoutDashboardIcon,
} from "lucide-react"

const data = {
  user: {
    name: "وحید",
    mobile: "09112223344",
    avatar: "/avatars/shadcn.png",
  },
  teams: [
    {
      name: "اسمارت کاپ",
      logo: <Coffee />,
      plan: "نسخه بتا",
    },
  ],
  navMain: [
    {
      title: "داشبورد",
      url: "/",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "محیط آزمایشی",
      url: "#",
      icon: <TerminalSquareIcon />,
      isActive: true,
      items: [
        {
          title: "تاریخچه",
          url: "#",
          icon: <HistoryIcon />,
        },
        {
          title: "ستاره‌دار",
          url: "#",
          icon: <StarIcon />,
        },
        {
          title: "تنظیمات",
          url: "#",
          icon: <SettingsIcon />,
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
          icon: <SparklesIcon />,
        },
        {
          title: "کاوشگر",
          url: "#",
          icon: <TelescopeIcon />,
        },
        {
          title: "کوانتوم",
          url: "#",
          icon: <AtomIcon />,
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
          icon: <InfoIcon />,
        },
        {
          title: "شروع کنید",
          url: "#",
          icon: <RocketIcon />,
        },
        {
          title: "آموزش‌ها",
          url: "#",
          icon: <GraduationCapIcon />,
        },
        {
          title: "تغییرات",
          url: "#",
          icon: <FileTextIcon />,
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
          icon: <SlidersHorizontalIcon />,
          items: [
            {
              title: "زبان",
              url: "#",
              icon: <LanguagesIcon />,
            },
            {
              title: "ظاهر",
              url: "#",
              icon: <PaletteIcon />,
            },
          ],
        },
        {
          title: "تیم",
          url: "#",
          icon: <UsersIcon />,
        },
        {
          title: "صورتحساب",
          url: "#",
          icon: <CreditCardIcon />,
        },
        {
          title: "محدودیت‌ها",
          url: "#",
          icon: <GaugeIcon />,
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
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
