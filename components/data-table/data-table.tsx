"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  AlertCircleIcon,
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Loader2Icon,
  SlidersHorizontalIcon,
  PlusIcon,
} from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DataTableProps<TData extends { id: string }> {
  columns: ColumnDef<TData>[]
  data: TData[]
  onAddRow?: () => void
  draggable?: boolean
  // Server-side mode — provide these to enable manual pagination/sorting
  pageCount?: number
  pagination?: PaginationState
  onPaginationChange?: OnChangeFn<PaginationState>
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  isFetching?: boolean
  isError?: boolean
}

function SortableRow<TData extends { id: string }>({
  row,
}: {
  row: Row<TData>
}) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      ref={setNodeRef}
      data-state={row.getIsSelected() ? "selected" : undefined}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        position: isDragging ? "relative" : undefined,
        zIndex: isDragging ? 1 : undefined,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTable<TData extends { id: string }>({
  columns,
  data: initialData,
  onAddRow,
  draggable = false,
  pageCount,
  pagination: controlledPagination,
  onPaginationChange,
  sorting: controlledSorting,
  onSortingChange,
  isFetching = false,
  isError = false,
}: DataTableProps<TData>) {
  const isServerSide = pageCount !== undefined

  const [data, setData] = React.useState(initialData)
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // Keep client-side data in sync when prop changes (client mode only)
  React.useEffect(() => {
    if (!isServerSide) setData(initialData)
  }, [initialData, isServerSide])

  const activeColumns = React.useMemo(
    () => draggable ? columns : columns.filter((col) => (col as { id?: string }).id !== "drag"),
    [columns, draggable]
  )

  const table = useReactTable({
    data: isServerSide ? initialData : data,
    columns: activeColumns,
    ...(isServerSide
      ? {
          manualPagination: true,
          manualSorting: true,
          pageCount,
          onPaginationChange,
          onSortingChange,
        }
      : {
          getPaginationRowModel: getPaginationRowModel(),
          getSortedRowModel: getSortedRowModel(),
          getFilteredRowModel: getFilteredRowModel(),
          onSortingChange: setInternalSorting,
        }),
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.id,
    state: {
      sorting: isServerSide ? (controlledSorting ?? []) : internalSorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      ...(isServerSide && controlledPagination ? { pagination: controlledPagination } : {}),
    },
    ...(!isServerSide ? { initialState: { pagination: { pageSize: 10 } } } : {}),
  })

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const rowIds = React.useMemo(
    () => table.getRowModel().rows.map((row) => row.original.id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table.getRowModel().rows]
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((prev) => {
        const oldIndex = prev.findIndex((item) => item.id === active.id)
        const newIndex = prev.findIndex((item) => item.id === over.id)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  const selectedCount = Object.keys(rowSelection).length
  const totalRows = isServerSide
    ? (pageCount ?? 0) * (controlledPagination?.pageSize ?? 10)
    : table.getFilteredRowModel().rows.length

  const hidableColumns = table.getAllColumns().filter((col) => col.getCanHide())

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-end gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontalIcon />
              سفارشی‌سازی ستون‌ها
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>نمایش ستون‌ها</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {hidableColumns.map((col) => (
              <DropdownMenuCheckboxItem
                key={col.id}
                checked={col.getIsVisible()}
                onCheckedChange={(value) => col.toggleVisibility(!!value)}
                className="capitalize"
              >
                {typeof col.columnDef.header === "string"
                  ? col.columnDef.header
                  : col.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="sm" onClick={onAddRow}>
          <PlusIcon />
          افزودن بخش
        </Button>
      </div>

      {/* Table */}
      <div className="relative rounded-lg border">
        {isFetching && !isError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/60 backdrop-blur-[1px]">
            <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}
        {isError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-background/80">
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <AlertCircleIcon className="size-4 shrink-0" />
              خطا در بارگذاری داده‌ها
            </span>
          </div>
        )}
        <Table>
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width:
                        header.column.getSize() !== 150
                          ? header.column.getSize()
                          : undefined,
                    }}
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button
                        className="flex items-center gap-1 cursor-pointer select-none"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === "asc" ? (
                          <ArrowUpIcon className="size-3.5" />
                        ) : header.column.getIsSorted() === "desc" ? (
                          <ArrowDownIcon className="size-3.5" />
                        ) : (
                          <ArrowUpDownIcon className="size-3.5 opacity-40" />
                        )}
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {draggable ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={rowIds}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.length ? (
                    table
                      .getRowModel()
                      .rows.map((row) => <SortableRow key={row.id} row={row} />)
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={activeColumns.length}
                        className="h-24 text-center"
                      >
                        {isError ? (
                          <span className="flex items-center justify-center gap-1.5 text-muted-foreground">
                            <AlertCircleIcon className="size-4 shrink-0" />
                            خطا در بارگذاری داده‌ها
                          </span>
                        ) : (
                          <span className="text-muted-foreground">نتیجه‌ای یافت نشد.</span>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </SortableContext>
              </DndContext>
            ) : (
              <>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() ? "selected" : undefined}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={activeColumns.length}
                      className="h-24 text-center text-muted-foreground"
                    >
                      نتیجه‌ای یافت نشد.
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {selectedCount} از {totalRows} ردیف انتخاب شده.
        </p>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground whitespace-nowrap">
              ردیف در صفحه
            </span>
            <Select
              value={String(table.getState().pagination.pageSize)}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger size="sm" className="w-16">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <p className="text-muted-foreground text-sm whitespace-nowrap">
            صفحه {table.getState().pagination.pageIndex + 1} از{" "}
            {table.getPageCount()}
          </p>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsRightIcon />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronRightIcon />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsLeftIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
