"use client";

import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, ArrowUpDown, MoreVertical } from "lucide-react";
import {
  flexRender,
  useTable,
  tableFeatures,
  rowPaginationFeature,
  rowSortingFeature,
  createPaginatedRowModel,
  createSortedRowModel,
  sortFn_text,
  sortFn_basic,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";

import type { Tenant } from "@/types/tenant";
import TenantStatusBadge from "./TenantStatusBadge";
import ModulesIndicator from "./ModulesIndicator";
import TenantPagination from "./TenantPagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteTenantMutation } from "@/hooks/tenants/use-tenants";

const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: {
    text: sortFn_text,
    basic: sortFn_basic,
  },
});

interface Props {
  data: Tenant[];
}

export default function TenantTable({ data }: Props) {
  const router = useRouter();
  const deleteTenant = useDeleteTenantMutation();

  const handleDelete = (tenant: Tenant) => {
    if (
      !window.confirm(`Delete tenant "${tenant.name}"? This cannot be undone.`)
    ) {
      return;
    }

    deleteTenant.mutate(tenant.id, {
      onError: (error) => window.alert(error.message),
    });
  };

  const columns: ColumnDef<typeof features, Tenant>[] = [
    {
      accessorKey: "name",
      header: "Tenant",
      sortFn: "text",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-[#18213D]">{row.original.name}</p>
          <p className="mt-0.5 text-xs text-slate-400">
            {row.original.slug} · {row.original.plan}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      sortFn: "text",
      cell: ({ row }) => <TenantStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "modulesEnabled",
      header: "Modules Enabled",
      sortFn: "basic",
      cell: ({ row }) => (
        <ModulesIndicator
          enabled={row.original.modulesEnabled}
          total={row.original.totalModules}
        />
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      sortFn: "text",
    },
    {
      accessorKey: "lastActive",
      header: "Last Active",
      sortFn: "text",
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                aria-label={`Actions for ${row.original.name}`}
                onClick={(event) => event.stopPropagation()}
                className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
              />
            }
          >
            <MoreVertical size={17} />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-40 hover:bg-transparent"
            onClick={(event) => event.stopPropagation()}
          >
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  `/tenants/create-tenant/organization-basics?tenantId=${encodeURIComponent(row.original.id)}`,
                )
              }
              className="flex cursor-pointer items-center gap-2 text-blue-600"
            >
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              variant="destructive"
              onClick={() => handleDelete(row.original)}
              className="flex cursor-pointer items-center gap-2 text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const table = useTable({
    features,
    data,
    columns,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
  });

  const pagination = table.state.pagination;

  return (
    <div className="overflow-hidden rounded-[18px] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-slate-200">
                {headerGroup.headers.map((header) => {
                  const column = header.column;
                  const canSort = column.getCanSort();
                  const sorted = column.getIsSorted();

                  return (
                    <th
                      key={header.id}
                      className="px-5 py-4 text-left text-sm font-semibold text-[#020D2B]"
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          onClick={column.getToggleSortingHandler()}
                          className="cursor-pointer inline-flex items-center gap-2 text-left transition-colors hover:text-blue-600"
                          title={`Sort by ${column.id}`}
                        >
                          {flexRender(
                            column.columnDef.header,
                            header.getContext(),
                          )}

                          {sorted === "asc" ? (
                            <ArrowUp size={15} className="text-blue-600" />
                          ) : sorted === "desc" ? (
                            <ArrowDown size={15} className="text-blue-600" />
                          ) 
                          : (
                            <ArrowUpDown size={15} className="text-slate-400" />
                          )
                          }
                        </button>
                      ) : (
                        flexRender(column.columnDef.header, header.getContext())
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => router.push(`/tenants/${row.original.id}`)}
                className="cursor-pointer border-b border-slate-200 transition-colors last:border-b-0 hover:bg-slate-50"
              >
                {row.getAllCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-5 py-4 text-sm text-slate-600"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}

            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-10 text-center text-sm text-slate-500"
                >
                  No tenants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <TenantPagination
        pageIndex={pagination.pageIndex}
        pageCount={table.getPageCount()}
        previousPage={() => table.previousPage()}
        nextPage={() => table.nextPage()}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
      />
    </div>
  );
}
