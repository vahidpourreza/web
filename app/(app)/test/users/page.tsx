"use client"

import * as React from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { type ColumnDef, type PaginationState, type SortingState } from "@tanstack/react-table"
import { EyeIcon, MoreHorizontalIcon, PencilIcon, SearchIcon, Trash2Icon } from "lucide-react"
import { DataTable } from "@/components/data-table/data-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { usePagedUsers } from "@/api/access/account/hooks"
import type { UserResponse } from "@/api/access/account/service"

const userColumns: ColumnDef<UserResponse>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: "mobile",
    header: "موبایل",
  },
  {
    id: "fullName",
    header: "نام و نام خانوادگی",
    enableSorting: false,
    cell: ({ row }) => (
      <span>{row.original.firstName} {row.original.lastName}</span>
    ),
  },
  {
    accessorKey: "username",
    header: "نام کاربری",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.username ?? "—"}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "ایمیل",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.email ?? "—"}</span>
    ),
  },
  {
    accessorKey: "roleName",
    header: "نقش",
  },
  {
    accessorKey: "statusName",
    header: "وضعیت",
  },
  {
    accessorKey: "genderName",
    header: "جنسیت",
    enableSorting: false,
  },
  {
    accessorKey: "birthDay",
    header: "تاریخ تولد",
    cell: ({ row }) => (
      <span className="text-muted-foreground tabular-nums">{row.original.birthDay ?? "—"}</span>
    ),
  },
  {
    accessorKey: "isRoot",
    header: "روت",
    enableSorting: false,
    cell: ({ row }) => row.original.isRoot ? <span className="text-xs font-medium text-destructive">بله</span> : null,
  },
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <EyeIcon />
            مشاهده
          </DropdownMenuItem>
          <DropdownMenuItem>
            <PencilIcon />
            ویرایش
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <Trash2Icon />
            حذف
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
]

function UsersContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Derive state from URL
  const pageIndex = Number(searchParams.get("page") ?? "0")
  const pageSize = Number(searchParams.get("size") ?? "10")
  const sortBy = searchParams.get("sort") ?? undefined
  const sortDesc = searchParams.get("desc") === "1"
  const statusType = searchParams.get("status") ?? ""
  const roleType = searchParams.get("role") ?? ""

  // Local input state for debounced text filters
  const [nameInput, setNameInput] = React.useState(searchParams.get("name") ?? "")
  const [mobileInput, setMobileInput] = React.useState(searchParams.get("mobile") ?? "")

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "") params.delete(key)
      else params.set(key, value)
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  // Debounce name filter
  const isFirstNameRender = React.useRef(true)
  React.useEffect(() => {
    if (isFirstNameRender.current) { isFirstNameRender.current = false; return }
    const t = setTimeout(() => updateParams({ name: nameInput || null, page: null }), 400)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameInput])

  // Debounce mobile filter
  const isFirstMobileRender = React.useRef(true)
  React.useEffect(() => {
    if (isFirstMobileRender.current) { isFirstMobileRender.current = false; return }
    const t = setTimeout(() => updateParams({ mobile: mobileInput || null, page: null }), 400)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileInput])

  const pagination: PaginationState = { pageIndex, pageSize }
  const sorting: SortingState = sortBy ? [{ id: sortBy, desc: sortDesc }] : []

  const queryParams = {
    pageNumber: pageIndex + 1,
    pageSize,
    needTotalCount: true,
    sortBy,
    sortAscending: sortBy ? !sortDesc : undefined,
    fullName: searchParams.get("name") || undefined,
    mobile: searchParams.get("mobile") || undefined,
    statusType: statusType || undefined,
    roleType: roleType || undefined,
  }

  const { data, isLoading, isFetching, isError } = usePagedUsers(queryParams)
  const pageCount = data ? Math.ceil(data.totalCount / pageSize) : 0

  return (
    <div className="p-6 space-y-3">
      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative">
          <SearchIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="جستجو نام..."
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="pr-8 h-8 w-48"
          />
        </div>
        <div className="relative">
          <SearchIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="موبایل..."
            value={mobileInput}
            onChange={(e) => setMobileInput(e.target.value)}
            className="pr-8 h-8 w-40"
          />
        </div>
        <Select
          value={statusType || "all"}
          onValueChange={(v) => updateParams({ status: v === "all" ? null : v, page: null })}
        >
          <SelectTrigger size="sm" className="w-36">
            <SelectValue placeholder="وضعیت" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه وضعیت‌ها</SelectItem>
            <SelectItem value="1">در انتظار</SelectItem>
            <SelectItem value="2">فعال</SelectItem>
            <SelectItem value="3">معلق</SelectItem>
            <SelectItem value="4">حذف شده</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={roleType || "all"}
          onValueChange={(v) => updateParams({ role: v === "all" ? null : v, page: null })}
        >
          <SelectTrigger size="sm" className="w-36">
            <SelectValue placeholder="نقش" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه نقش‌ها</SelectItem>
            <SelectItem value="1">روت</SelectItem>
            <SelectItem value="2">ادمین بروکر</SelectItem>
            <SelectItem value="3">ادمین تنانت</SelectItem>
            <SelectItem value="4">کارمند تنانت</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <>
          {/* Toolbar skeleton */}
          <div className="flex items-center justify-end gap-2">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-8 w-28" />
          </div>
          {/* Table skeleton */}
          <div className="rounded-lg border overflow-hidden">
            <div className="bg-muted px-4 py-3">
              <Skeleton className="h-4 w-full" />
            </div>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-3 border-t">
                <Skeleton className="h-4 w-24 shrink-0" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
          {/* Pagination skeleton */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-4 w-20" />
              <div className="flex gap-1">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </div>
        </>
      ) : (
        <DataTable
          columns={userColumns}
          data={data?.queryResult ?? []}
          pageCount={pageCount}
          isFetching={isFetching}
          isError={isError}
          pagination={pagination}
          onPaginationChange={(updater) => {
            const next = typeof updater === "function" ? updater(pagination) : updater
            updateParams({
              page: next.pageIndex > 0 ? String(next.pageIndex) : null,
              size: next.pageSize !== 10 ? String(next.pageSize) : null,
            })
          }}
          sorting={sorting}
          onSortingChange={(updater) => {
            const next = typeof updater === "function" ? updater(sorting) : updater
            if (next.length === 0) {
              updateParams({ sort: null, desc: null, page: null })
            } else {
              updateParams({ sort: next[0].id, desc: next[0].desc ? "1" : null, page: null })
            }
          }}
        />
      )}
    </div>
  )
}

export default function UsersPage() {
  return (
    <React.Suspense>
      <UsersContent />
    </React.Suspense>
  )
}
