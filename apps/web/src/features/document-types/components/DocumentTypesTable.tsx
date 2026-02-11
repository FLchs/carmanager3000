import { useSuspenseQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";
import { useMemo } from "react";

import { openapi } from "#/lib/openapi";

function DocumentTypesTable() {
  return (
    <div className="rounded-lg border border-border bg-bg">
      <Table />
    </div>
  );
}

function Table() {
  const { data } = useSuspenseQuery(openapi.documentTypes.list.queryOptions());

  const columnHelper = createColumnHelper<(typeof data)[number]>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        cell: (info) => info.renderValue(),
        header: () => "Name",
      }),
    ],
    [columnHelper],
  );

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div>
      <table className="w-full text-left">
        <thead className="border-b border-border font-bold">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th className="px-4 py-2" key={header.id}>
                  {header.isPlaceholder ? undefined : (
                    <div
                      className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                      title={
                        header.column.getCanSort()
                          ? header.column.getNextSortingOrder() === "asc"
                            ? "Sort ascending"
                            : // eslint-disable-next-line unicorn/no-nested-ternary
                              header.column.getNextSortingOrder() === "desc"
                              ? "Sort descending"
                              : "Clear sort"
                          : undefined
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <ArrowDownWideNarrow className="ml-1 inline" size={18} />,
                        desc: <ArrowUpWideNarrow className="ml-1 inline" size={18} />,
                      }[header.column.getIsSorted() as string] ?? undefined}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr className={`border-b border-border last:border-0 hover:bg-bg-dark`} key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td className="px-4 py-2" key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DocumentTypesTable;
