"use client"

import * as React from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { useSortable } from "@dnd-kit/sortable"
import { GripVerticalIcon, MoreHorizontalIcon, ChevronDownIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export type SectionType =
  | "cover-page"
  | "table-of-contents"
  | "narrative"
  | "technical-content"

export type RowStatus = "in-process" | "done"

export interface OutlineRow {
  id: string
  header: string
  sectionType: SectionType
  status: RowStatus
  target: number
  limit: number
  reviewer: string | null
}

const sectionTypeLabels: Record<SectionType, string> = {
  "cover-page": "صفحه جلد",
  "table-of-contents": "فهرست مطالب",
  narrative: "روایی",
  "technical-content": "محتوای فنی",
}

const statusConfig: Record<RowStatus, { label: string; dotClass: string }> = {
  "in-process": { label: "در حال انجام", dotClass: "bg-muted-foreground/50" },
  done: { label: "انجام شده", dotClass: "bg-green-500" },
}

const REVIEWERS = ["علی رضایی", "سارا محمدی", "رضا کریمی", "نگار حسینی"]

function DragHandle({ rowId }: { rowId: string }) {
  const { attributes, listeners } = useSortable({ id: rowId })
  return (
    <Button
      variant="ghost"
      size="icon-xs"
      className="text-muted-foreground/40 hover:text-muted-foreground cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <GripVerticalIcon />
    </Button>
  )
}

function ReviewerCell({ reviewer }: { reviewer: string | null }) {
  const [assigned, setAssigned] = React.useState(reviewer)
  if (assigned) {
    return <span className="text-sm">{assigned}</span>
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 text-muted-foreground gap-1">
          <ChevronDownIcon className="size-3" />
          تعیین بازبین
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {REVIEWERS.map((r) => (
          <DropdownMenuItem key={r} onSelect={() => setAssigned(r)}>
            {r}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const outlineColumns: ColumnDef<OutlineRow>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle rowId={row.original.id} />,
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
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
    accessorKey: "header",
    header: "عنوان",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("header")}</span>
    ),
  },
  {
    accessorKey: "sectionType",
    header: "نوع بخش",
    cell: ({ row }) => {
      const type = row.getValue("sectionType") as SectionType
      return (
        <Badge variant="outline" className="font-normal">
          {sectionTypeLabels[type]}
        </Badge>
      )
    },
  },
  {
    accessorKey: "status",
    header: "وضعیت",
    cell: ({ row }) => {
      const status = row.getValue("status") as RowStatus
      const config = statusConfig[status]
      return (
        <div className="flex items-center gap-1.5">
          <span className={cn("size-2 rounded-full shrink-0", config.dotClass)} />
          <span className="text-sm">{config.label}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "target",
    header: "هدف",
    cell: ({ row }) => (
      <span className="text-muted-foreground tabular-nums">{row.getValue("target")}</span>
    ),
  },
  {
    accessorKey: "limit",
    header: "محدودیت",
    cell: ({ row }) => (
      <span className="text-muted-foreground tabular-nums">{row.getValue("limit")}</span>
    ),
  },
  {
    accessorKey: "reviewer",
    header: "بازبین",
    cell: ({ row }) => <ReviewerCell reviewer={row.getValue("reviewer")} />,
  },
  {
    id: "actions",
    header: () => null,
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>ویرایش</DropdownMenuItem>
          <DropdownMenuItem>تکثیر</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">حذف</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
]
