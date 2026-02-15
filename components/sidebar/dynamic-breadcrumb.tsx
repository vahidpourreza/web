"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Fragment } from "react"

const routeLabels: Record<string, string> = {
  "": "داشبورد",
  access: "کاربران و دسترسی‌ها",
  centers: "مراکز",
  "access-groups": "گروه‌های دسترسی",
  users: "کاربران",
  invitations: "دعوت‌نامه‌ها",
  sales: "فروش",
  "menu-items": "آیتم منو",
  groups: "گروه‌بندی",
  categories: "دسته‌بندی",
  pos: "صندوق فروش",
  orders: "سفارشات",
  "cash-management": "مدیریت صندوق",
  settings: "تنظیمات",
  clients: "کلاینت و دستگاه‌ها",
  messaging: "پیام‌رسانی",
  events: "رخدادها",
  order: "فروش",
  "tenant-setting": "کیوسک و نوبت",
}

export function DynamicBreadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>داشبورد</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1
          const href = "/" + segments.slice(0, index + 1).join("/")
          const label = routeLabels[segment] || segment

          return (
            <Fragment key={segment}>
              {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
              <BreadcrumbItem className={isLast ? "" : "hidden md:block"}>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
