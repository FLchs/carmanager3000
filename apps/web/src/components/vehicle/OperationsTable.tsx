import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowDownWideNarrow, ArrowUpWideNarrow, LoaderCircleIcon, X } from "lucide-react";
import { Suspense, useCallback, useMemo, useState } from "react";

import { useDialog } from "@/hooks/useConfirm";
import { openapi } from "@/lib/openapi";

import Button from "../ui/Button";
import NewOperationModal from "./NewOperationModal";

function MaintenanceLogTable({ id }: { id: number }) {
  const [showAddModal, setShowAddModal] = useState(false);
  return (
    <div className="bg-bg border-border rounded-lg border-1">
      <div className="flex flex-row justify-between px-4 pt-2">
        <h3 className="text-text-muted">Recorded operations</h3>
        <Button callback={() => setShowAddModal(true)}>Add</Button>
      </div>
      <Suspense
        fallback={<LoaderCircleIcon className="m-auto mb-4 animate-spin" />}
      >
        <OperationTable id={id} />
      </Suspense>
      <NewOperationModal
        id={id.toString()}
        onClose={() => setShowAddModal(false)}
        visible={showAddModal}
      />
    </div>
  );
}

function OperationTable({ id }: { id: number }) {
  const client = useQueryClient()
  const { data } = useSuspenseQuery(
    openapi.vehicles.operations.list.queryOptions({
      input: { params: { vehicleId: id } },
    }),
  );
  const { confirm } = useDialog();

  const { mutate: deleteOperation } = useMutation(openapi.vehicles.operations.remove.mutationOptions({
    onError: async () => {
      void client.invalidateQueries({
        queryKey: openapi.vehicles.get.key(),
      });
    },
    onMutate: async (log, context) => {
      context.client.setQueryData(
        openapi.vehicles.operations.list.queryKey({
          input: { params: { vehicleId: Number(id) } },
        }),
        (old) => {
          return old?.filter((item) => item.id !== log.id)
        },
      );
    },
    onSuccess: () => {
      void client.invalidateQueries({
        queryKey: openapi.vehicles.operations.key()
      });
    }
  }))

  const onDelete = useCallback(async (id: number) => {
    if (
      await confirm({ title: "Do you really want to delete this operation ?" })
    ) {
      deleteOperation({ id });
    }
  }, [confirm, deleteOperation]);


  const columnHelper = createColumnHelper<typeof data[number]>()

  const columns = useMemo(() => [
    columnHelper.accessor('mileage', {
      cell: info => info.renderValue(),
      header: () => 'Mileage',
    }),
    columnHelper.accessor('note', {
      enableSorting: false,
      header: () => <span>Notes</span>,
    }),
    columnHelper.accessor('type', {
      enableSorting: false,
      header: 'Status',
    }),
    columnHelper.accessor('date', {
      header: 'Date',
      cell: row => {
        const value = row.getValue()
        if (!value)
          return ""
        const date = new Date(value)
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      }

    }),
    columnHelper.accessor('id', {
      id: "delete",
      cell: info => <span className="cursor-pointer" onClick={() => onDelete(info.getValue())}><X /></span>,
      enableSorting: false,
      header: ""
    }),

  ], [columnHelper, onDelete])

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div>
      <table className="w-full text-left">
        <thead className="border-border border-b font-bold">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th className="px-4 py-2" key={header.id}>

                  {header.isPlaceholder ? undefined : (
                    <div
                      className={
                        header.column.getCanSort()
                          ? 'cursor-pointer select-none'
                          : ''
                      }
                      title={
                        header.column.getCanSort()
                          ? header.column.getNextSortingOrder() === 'asc'
                            ? 'Sort ascending'
                            // eslint-disable-next-line unicorn/no-nested-ternary
                            : header.column.getNextSortingOrder() === 'desc'
                              ? 'Sort descending'
                              : 'Clear sort'
                          : undefined
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: <ArrowDownWideNarrow className="inline ml-1" size={18} />,
                        desc: <ArrowUpWideNarrow className="inline ml-1" size={18} />,
                      }[header.column.getIsSorted() as string] ?? undefined}
                    </div>
                  )}

                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr
              className={`border-border hover:bg-bg-dark border-b last:border-0`}
              key={row.id}
            >
              {row.getVisibleCells().map(cell => (
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

export default MaintenanceLogTable;
