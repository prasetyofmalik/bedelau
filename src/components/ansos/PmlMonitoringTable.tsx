import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export const PmlMonitoringTable = ({ type }: { type: "sak" | "ssn" }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const tableName = type === "sak" ? "sak_f25_samples" : "ssn_m25_samples";

  const { data: samples } = useQuery({
    queryKey: [tableName],
    queryFn: async () => {
      const { data, error } = await supabase.from(tableName).select("*");
      if (error) throw error;
      return data || [];
    },
  });

  // Group by PML
  const pmlGroups = useMemo(() => {
    if (!samples) return [];

    const groups = {};
    samples.forEach((sample) => {
      if (!groups[sample.pml]) {
        groups[sample.pml] = [];
      }
      groups[sample.pml].push(sample);
    });

    return Object.entries(groups).map(([pml, items]) => ({
      pml,
      count: (items as typeof samples).length,
      samples: items,
    }));
  }, [samples]);

  const columns = [
    {
      accessorKey: "pml",
      header: "PML",
    },
    {
      accessorKey: "count",
      header: "Jumlah Sampel",
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const pmlData = row.original;
        if (!pmlData || !pmlData.samples) return null;

        // Safe check for samples and created_at property
        const samplesArray = Array.isArray(pmlData.samples)
          ? pmlData.samples
          : [];

        // Calculate completion rate based on sample count and completion status
        const totalSamples = samplesArray.length;
        let completedSamples = 0;

        // Safely handle the case when samples might not have created_at
        if (totalSamples > 0) {
          completedSamples = samplesArray.filter(
            (sample) =>
              sample && typeof sample === "object" && "created_at" in sample
          ).length;
        }

        const percent =
          totalSamples > 0 ? (completedSamples / totalSamples) * 100 : 0;

        return (
          <div className="flex items-center gap-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${percent}%` }}
              ></div>
            </div>
            <span>{percent.toFixed(0)}%</span>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: pmlGroups,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div>
      <Table className="border">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
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
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
