"use client"

import * as React from "react"
import { type ColumnDef, type PaginationState, type SortingState } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table/data-table"
import { Skeleton } from "@/components/ui/skeleton"
import { usePagedUsers } from "@/api/access/account/hooks"
import type { UserResponse } from "@/api/access/account/service"

const userColumns: ColumnDef<UserResponse>[] = [
  {
    accessorKey: "mobile",
    header: "موبایل",
  },
  {
    id: "fullName",
    header: "نام و نام خانوادگی",
    cell: ({ row }) => (
      <span>{row.original.firstName} {row.original.lastName}</span>
    ),
  },
  {
    accessorKey: "username",
    header: "نام کاربری",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.username ?? "—"}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "ایمیل",
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
    cell: ({ row }) => row.original.isRoot ? <span className="text-xs font-medium text-destructive">بله</span> : null,
  },
]

export default function UsersPage() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = React.useState<SortingState>([])

  const params = {
    pageNumber: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    needTotalCount: true,
    sortBy: sorting[0]?.id,
    sortAscending: sorting[0] ? !sorting[0].desc : undefined,
  }

  const { data, isLoading } = usePagedUsers(params)

  const pageCount = data
    ? Math.ceil(data.totalCount / pagination.pageSize)
    : 0

  return (
    <div className="p-6 space-y-3">
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
          pagination={pagination}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortingChange={setSorting}
        />
      )}
    </div>
  )
}
