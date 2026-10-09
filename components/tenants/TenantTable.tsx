"use client";

import { useRouter } from "next/navigation";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  flexRender,
  useTable,
  tableFeatures,
  rowPaginationFeature,
  createPaginatedRowModel,
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
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
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
    )
      return;
    deleteTenant.mutate(tenant.id, {
      onError: (error) => window.alert(error.message),
    });
  };

  const columns: ColumnDef<typeof features, Tenant>[] = [
    {
      accessorKey: "name",
      header: "Tenant",
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
      cell: ({ row }) => <TenantStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "modulesEnabled",
      header: "Modules Enabled",
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
    },
    {
      accessorKey: "lastActive",
      header: "Last Active",
    },
    {
      id: "actions",
      header: "",
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
            align="end"
            onClick={(event) => event.stopPropagation()}
          >
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  `/tenants/create-tenant/organization-basics?tenantId=${encodeURIComponent(row.original.id)}`,
                )
              }
              className="flex items-center gap-2 text-blue-600 hover:bg-none cursor-pointer"
            >
              <Pencil size={15} />
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => handleDelete(row.original)}
              className="flex items-center gap-2 text-red-600 hover:bg-none cursor-pointer"
            >
              <Trash2 size={15} />
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
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-5 py-4 text-left text-sm font-semibold text-[#020D2B]"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
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
                  No tenants match this filter.
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
