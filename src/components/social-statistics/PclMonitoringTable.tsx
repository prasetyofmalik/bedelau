import { format, eachDayOfInterval, startOfMonth, endOfMonth } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { id } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface MonitoringData {
  pcl: string;
  date: string;
  count: number;
}

interface PclMonitoringTableProps {
  type: 'pemutakhiran' | 'pencacahan';
}

export function PclMonitoringTable({ type }: PclMonitoringTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const currentDate = new Date();
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  // Fetch PCL list and their daily counts
  const { data: monitoringData } = useQuery({
    queryKey: ['pcl_monitoring', type],
    queryFn: async () => {
      // First get all unique PCLs from samples
      const { data: pclList, error: pclError } = await supabase
        .from('ssn_m25_samples')
        .select('pcl');

      if (pclError) throw pclError;
      if (!pclList) return [];

      // Get unique PCLs, filtering out null values
      const uniquePcls = [...new Set(pclList
        .filter(item => item.pcl !== null)
        .map(item => item.pcl)
      )];

      // Get daily counts for each PCL
      const { data: dailyCounts, error: countsError } = await supabase
        .from(type === 'pemutakhiran' ? 'ssn_m25_updates' : 'ssn_m25_cacah')
        .select(`
          created_at,
          sample_code,
          ssn_m25_samples!inner (
            pcl
          )
        `);

      if (countsError) throw countsError;
      if (!dailyCounts) return [];

      // Process data into required format
      const processedData: MonitoringData[] = [];

      uniquePcls.forEach(pcl => {
        daysInMonth.forEach(date => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const count = dailyCounts.filter(item => 
            item.ssn_m25_samples.pcl === pcl && 
            item.created_at.startsWith(dateStr)
          ).length;

          processedData.push({
            pcl,
            date: dateStr,
            count
          });
        });
      });

      return processedData;
    }
  });

  if (!monitoringData) return null;

  // Group data by PCL
  const pclGroups = monitoringData.reduce((acc, curr) => {
    if (!acc[curr.pcl]) {
      acc[curr.pcl] = [];
    }
    acc[curr.pcl].push(curr);
    return acc;
  }, {} as Record<string, MonitoringData[]>);

  // Filter PCLs based on search query
  const filteredPclGroups = Object.entries(pclGroups).filter(([pcl]) => 
    pcl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (count: number) => {
    if (count > 0) return "bg-green-500";
    return "bg-yellow-500";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">
          Progress {type === 'pemutakhiran' ? 'Pemutakhiran' : 'Pencacahan'} Harian PCL
        </h3>
        <Input
          type="search"
          placeholder="Cari PCL..."
          className="max-w-xs"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="overflow-auto h-[78vh]">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              <TableHead className="bg-muted">Nama PCL</TableHead>
              {daysInMonth.map((date) => (
                <TableHead 
                  key={date.toString()}
                  className="bg-muted text-center w-12"
                >
                  {format(date, 'd', { locale: id })}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPclGroups.map(([pcl, data]) => (
              <TableRow key={pcl}>
                <TableCell className="font-medium">{pcl}</TableCell>
                {daysInMonth.map((date) => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  const dayData = data.find(d => d.date === dateStr);
                  return (
                    <TableCell 
                      key={dateStr}
                      className={`text-center ${getStatusColor(dayData?.count || 0)}`}
                    >
                      {dayData?.count || 0}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}