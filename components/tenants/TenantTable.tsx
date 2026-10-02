"use client";

import { useRouter } from "next/navigation";
import { MoreVertical } from "lucide-react";
import { flexRender, useTable, tableFeatures, rowPaginationFeature, createPaginatedRowModel } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { Tenant } from "@/types/tenant";
import TenantStatusBadge from "./TenantStatusBadge";
import ModulesIndicator from "./ModulesIndicator";
import TenantPagination from "./TenantPagination";

const features = tableFeatures({
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
});

interface Props {
  data: Tenant[];
}

export default function TenantTable({ data }: Props) {
  const router = useRouter();

  const columns: ColumnDef<typeof features, Tenant>[] = [
    {
      accessorKey: "name",
      header: "Tenant",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-[#18213D]">{row.original.name}</p>
          <p className="mt-0.5 text-xs text-slate-400">{row.original.slug} · {row.original.plan}</p>
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
      cell: ({ row }) => <ModulesIndicator enabled={row.original.modulesEnabled} total={row.original.totalModules} />,
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
      cell: () => (
        <button type="button" onClick={(e) => e.stopPropagation()} className="rounded-md p-2 text-slate-500 hover:bg-slate-100">
          <MoreVertical size={17} />
        </button>
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
                  <th key={header.id} className="px-5 py-4 text-left text-sm font-semibold text-[#020D2B]">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} onClick={() => router.push(`/tenants/${row.original.id}`)} className="cursor-pointer border-b border-slate-200 transition-colors last:border-b-0 hover:bg-slate-50">
                {row.getAllCells().map((cell) => (
                  <td key={cell.id} className="px-5 py-4 text-sm text-slate-600">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TenantPagination pageIndex={pagination.pageIndex} pageCount={table.getPageCount()} previousPage={() => table.previousPage()} nextPage={() => table.nextPage()} canPreviousPage={table.getCanPreviousPage()} canNextPage={table.getCanNextPage()} />
    </div>
  );
}