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
import { PplMonitoringTableProps } from "./types";
import { DateRangePicker } from "./DateRangePicker";
import { DateRange } from "react-day-picker";

interface MonitoringData {
  ppl: string;
  date: string;
  count: number;
}

export function PplMonitoringTable({
  type,
  surveyType,
}: PplMonitoringTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const daysInRange =
    date?.from && date?.to
      ? eachDayOfInterval({
          start: date.from,
          end: date.to,
        })
      : eachDayOfInterval({
          start: startOfMonth(new Date()),
          end: endOfMonth(new Date()),
        });

  // Fetch PPL list and their daily counts
  const { data: monitoringData } = useQuery({
    queryKey: [`${surveyType}_ppl_monitoring`, type, date?.from, date?.to],
    queryFn: async () => {
      // First get all unique PPLs from samples
      const { data: pplList, error: pplError } = await supabase
        .from(`${surveyType}_samples`)
        .select("ppl");

      if (pplError) throw pplError;
      if (!pplList) return [];

      // Get unique PPLs, filtering out null values
      const uniquePpls = Array.from(
        new Set(
          pplList.filter((item) => item.ppl !== null).map((item) => item.ppl)
        )
      );

      // Get daily counts for each PPL
      const { data: dailyCounts, error: countsError } = await supabase.from(
        type === "pemutakhiran"
          ? `${surveyType}_updates`
          : `${surveyType}_cacah`
      ).select(`
          created_at,
          sample_code,
          ${surveyType}_samples!inner (
            ppl
          )
        `);

      if (countsError) throw countsError;
      if (!dailyCounts) return [];

      // Process data into required format
      const processedData: MonitoringData[] = [];

      uniquePpls.forEach((ppl) => {
        daysInRange.forEach((date) => {
          const dateStr = format(date, "yyyy-MM-dd");
          const count = dailyCounts.filter(
            (item) =>
              item[`${surveyType}_samples`].ppl === ppl &&
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
    if (count > 0) return "bg-green-600 text-white";
    return "bg-yellow-400";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
        <Input
          type="search"
          placeholder="Cari PPL..."
          className="max-w-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <DateRangePicker date={date} onDateChange={setDate} />
      </div>
      <div className="overflow-auto max-h-[78vh]">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              <TableHead className="bg-white sticky left-0 z-10" rowSpan={2}>
                Nama PPL
              </TableHead>
                <TableHead
                colSpan={daysInRange.length}
                className="text-center bg-white"
                >
                {date?.from && date?.to
                  ? format(date.from, "MMM yyyy", { locale: id }) ===
                  format(date.to, "MMM yyyy", { locale: id })
                  ? format(date.from, "MMM yyyy", { locale: id })
                  : `${format(date.from, "MMM yyyy", {
                    locale: id,
                    })} - ${format(date.to, "MMM yyyy", { locale: id })}`
                  : format(new Date(), "MMMM yyyy", { locale: id })}
                </TableHead>
              <TableHead className="bg-white text-center" rowSpan={2}>
                Jumlah
              </TableHead>
            </TableRow>
            <TableRow>
              {daysInRange.map((date) => (
                <TableHead
                  key={date.toString()}
                  className="bg-white text-center w-12"
                >
                  {format(date, "d", { locale: id })}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPplGroups.map(([ppl, data]) => (
              <TableRow key={ppl} className="h-8">
                <TableCell className="text-sm bg-white sticky left-0 z-10 p-1 pr-3">
                  {ppl}
                </TableCell>
                {daysInRange.map((date) => {
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
                <TableCell className="text-sm text-center bg-white">
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