import {
  format,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  isBefore,
  startOfDay,
  isSameMonth,
} from "date-fns";
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
import { ArrowUp, ArrowDown } from "lucide-react";

interface MonitoringData {
  ppl: string;
  date: string;
  count: number;
}

type SortConfig = {
  direction: "asc" | "desc";
} | null;

export function PplMonitoringTable({
  type,
  surveyType,
}: PplMonitoringTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [date, setDate] = useState<DateRange | undefined>(() => {
    if (type === "pemutakhiran") {
      return {
        from: new Date(2025, 1, 1), // February 1, 2025
        to: new Date(2025, 1, 6), // February 6, 2025
      };
    } else {
      return {
        from: new Date(2025, 1, 8), // February 8, 2025
        to: new Date(2025, 1, 27), // February 27, 2025
      };
    }
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [isHovered, setIsHovered] = useState(false);

  const daysInRange =
    date?.from && date?.to
      ? eachDayOfInterval({
          start: date.from,
          end: date.to,
        })
      : eachDayOfInterval({
          start:
            type === "pemutakhiran"
              ? new Date(2025, 1, 1)
              : new Date(2025, 1, 8),
          end:
            type === "pemutakhiran"
              ? new Date(2025, 1, 6)
              : new Date(2025, 1, 27),
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
      const firstDayOfMonth = startOfMonth(new Date());
      const isViewingCurrentMonth =
        date?.from && isSameMonth(date.from, new Date());

      uniquePpls.forEach((ppl) => {
        // Create a map to store counts per date
        const countsPerDate = new Map<string, number>();
        // Process each daily count
        dailyCounts.forEach((item) => {
          if (item[`${surveyType}_samples`].ppl === ppl) {
            const createdDate = new Date(item.created_at);
            const dateStr = format(createdDate, "yyyy-MM-dd");

            // add the count to the 1st of the current month
            if (
              type === "pemutakhiran" &&
              isViewingCurrentMonth &&
              isBefore(createdDate, firstDayOfMonth)
            ) {
              const firstDayStr = format(firstDayOfMonth, "yyyy-MM-dd");
              countsPerDate.set(
                firstDayStr,
                (countsPerDate.get(firstDayStr) || 0) + 1
              );
            } else {
              countsPerDate.set(dateStr, (countsPerDate.get(dateStr) || 0) + 1);
            }
          }
        });

        // Convert the map to array entries
        daysInRange.forEach((date) => {
          const dateStr = format(date, "yyyy-MM-dd");
          processedData.push({
            ppl,
            date: dateStr,
            count: countsPerDate.get(dateStr) || 0,
          });
        });
      });

      return processedData;
    },
  });

  if (!monitoringData) return null;

  const handleSort = () => {
    setSortConfig((currentSort) => {
      if (!currentSort) {
        return { direction: "asc" };
      }
      if (currentSort.direction === "asc") {
        return { direction: "desc" };
      }
      return null;
    });
  };
  const renderSortIcon = () => {
    if (sortConfig) {
      return sortConfig.direction === "asc" ? (
        <ArrowUp className="inline h-4 w-4 ml-1" />
      ) : (
        <ArrowDown className="inline h-4 w-4 ml-1" />
      );
    }
    return isHovered ? (
      <ArrowUp className="inline h-4 w-4 ml-1 opacity-50" />
    ) : null;
  };

  // Group and sort data
  const pplGroups = monitoringData.reduce((acc, curr) => {
    if (!acc[curr.ppl]) {
      acc[curr.ppl] = [];
    }
    acc[curr.ppl].push(curr);
    return acc;
  }, {} as Record<string, MonitoringData[]>);

  // Filter PPLs based on search query
  const filteredPplGroups = Object.entries(pplGroups || {})
    .filter(([ppl]) => ppl.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (!sortConfig) return 0;

      const sumA = a[1].reduce((sum, d) => sum + d.count, 0);
      const sumB = b[1].reduce((sum, d) => sum + d.count, 0);

      return sortConfig.direction === "asc" ? sumA - sumB : sumB - sumA;
    });

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
      <div className="overflow-auto max-h-[95vh]">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-2">
            <TableRow>
              <TableHead className="bg-white sticky left-0 z-2" rowSpan={2}>
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
              <TableHead
                className="bg-white text-center cursor-pointer hover:bg-gray-100"
                rowSpan={2}
                onClick={handleSort}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Jumlah {renderSortIcon()}
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
                <TableCell className="text-sm bg-white sticky left-0 z-2 p-1 pr-3">
                  {ppl}
                </TableCell>
                {daysInRange.map((date) => {
                  const dateStr = format(date, "yyyy-MM-dd");
                  const dayData = data.find((d) => d.date === dateStr);
                  return (
                    <TableCell
                      key={dateStr}
                      className={`text-center ${
                        dayData?.count
                          ? "bg-green-600 text-white"
                          : "bg-yellow-400"
                      }`}
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
