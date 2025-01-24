import { format, eachDayOfInterval, startOfMonth, endOfMonth } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { id } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface MonitoringData {
  ppl: string;
  date: string;
  count: number;
}

interface PplMonitoringTableProps {
  type: "pemutakhiran" | "pencacahan";
}

export function PplMonitoringTable({ type }: PplMonitoringTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const currentDate = new Date();
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  // Fetch PPL list and their daily counts
  const { data: monitoringData } = useQuery({
    queryKey: ["sak_ppl_monitoring", type],
    queryFn: async () => {
      // First get all unique PPLs from samples
      const { data: pplList, error: pplError } = await supabase
        .from("sak_f25_samples")
        .select("ppl");

      if (pplError) throw pplError;
      if (!pplList) return [];

      // Get unique PPLs, filtering out null values
      const uniquePpls = [
        ...new Set(
          pplList.filter((item) => item.ppl !== null).map((item) => item.ppl)
        ),
      ];

      // Get daily counts for each PPL
      const { data: dailyCounts, error: countsError } = await supabase.from(
        type === "pemutakhiran" ? "sak_f25_updates" : "sak_f25_cacah"
      ).select(`
          created_at,
          sample_code,
          sak_f25_samples!inner (
            ppl
          )
        `);

      if (countsError) throw countsError;
      if (!dailyCounts) return [];

      // Process data into required format
      const processedData: MonitoringData[] = [];

      uniquePpls.forEach((ppl) => {
        daysInMonth.forEach((date) => {
          const dateStr = format(date, "yyyy-MM-dd");
          const count = dailyCounts.filter(
            (item) =>
              item.sak_f25_samples.ppl === ppl &&
              item.created_at.startsWith(dateStr)
          ).length;

          processedData.push({
            ppl,
            date: dateStr,
            count,
          });
        });
      });

      return processedData;
    },
  });

  if (!monitoringData) return null;

  // Group data by PPL
  const pplGroups = monitoringData.reduce((acc, curr) => {
    if (!acc[curr.ppl]) {
      acc[curr.ppl] = [];
    }
    acc[curr.ppl].push(curr);
    return acc;
  }, {} as Record<string, MonitoringData[]>);

  // Filter PPLs based on search query
  const filteredPplGroups = Object.entries(pplGroups).filter(([ppl]) =>
    ppl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (count: number) => {
    if (count > 0) return "bg-green-500";
    return "bg-yellow-500";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">
          Progress {type === "pemutakhiran" ? "Pemutakhiran" : "Pencacahan"}{" "}
          Harian PPL
        </h3>
        <Input
          type="search"
          placeholder="Cari PPL..."
          className="max-w-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="overflow-auto h-[78vh]">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              <TableHead className="bg-white sticky left-0 z-10">Nama PPL</TableHead>
              {daysInMonth.map((date) => (
              <TableHead
                key={date.toString()}
                className="bg-white text-center w-12"
              >
                {format(date, "d", { locale: id })}
              </TableHead>
              ))}
              <TableHead>Jumlah</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPplGroups.map(([ppl, data]) => (
              <TableRow key={ppl}>
                <TableCell className="font-medium bg-white sticky left-0 z-10">{ppl}</TableCell>
                {daysInMonth.map((date) => {
                  const dateStr = format(date, "yyyy-MM-dd");
                  const dayData = data.find((d) => d.date === dateStr);
                  return (
                    <TableCell
                      key={dateStr}
                      className={`text-center ${getStatusColor(
                        dayData?.count || 0
                      )}`}
                    >
                      {dayData?.count || 0}
                    </TableCell>
                  );
                })}
                <TableCell className="font-medium text-center bg-white">
                  {data.reduce((sum, d) => sum + d.count, 0)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
