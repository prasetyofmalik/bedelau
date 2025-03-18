import React from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmployees } from "./hooks/useEmployees";
import { useSKPDocuments } from "./hooks/useSKPDocuments";

interface SKPDashboardProps {
  type: "yearly" | "monthly";
  period: string;
}

export function SKPDashboard({ type, period }: SKPDashboardProps) {
  const { data: employees = [], isLoading: isLoadingEmployees } =
    useEmployees();
  const { data: skpDocuments = [], isLoading: isLoadingSkp } = useSKPDocuments(
    type,
    period
  );

  // Define colors for the chart
  const COLORS = ["#4f46e5", "#f43f5e", "#10b981", "#f59e0b"];

  // Calculate stats
  const totalEmployees = employees.length;
  const employeesWithSkp = new Set(skpDocuments.map((skp) => skp.employee_id))
    .size;
  const employeesWithoutSkp = totalEmployees - employeesWithSkp;

  // Prepare data for the charts
  const submissionData = [
    {
      name: "Sudah Mengumpulkan",
      value: employeesWithSkp,
      color: "#4f46e5",
    },
    {
      name: "Belum Mengumpulkan",
      value: employeesWithoutSkp,
      color: "#f43f5e",
    },
  ];

  const getLabelText = () => {
    if (type === "yearly") {
      const labels: Record<string, string> = {
        penetapan: "Penetapan",
        penilaian: "Penilaian",
        evaluasi: "Evaluasi",
      };
      return labels[period] || period;
    } else {
      const months = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ];
      const monthIndex = parseInt(period, 10) - 1;
      return months[monthIndex] || period;
    }
  };

  const chartConfig = {
    submitted: {
      label: "Submitted",
      color: "#4f46e5",
    },
    notSubmitted: {
      label: "Not Submitted",
      color: "#f43f5e",
    },
  };

  if (isLoadingEmployees || isLoadingSkp) {
    return <div className="py-10 text-center">Loading dashboard data...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Rekap Pengumpulan SKP {type === "yearly" ? "Tahunan" : "Bulanan"} -{" "}
            {getLabelText()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="w-full md:w-1/2">
              <ChartContainer
                config={chartConfig}
                className="aspect-square w-full max-w-md mx-auto"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={submissionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {submissionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value) => [`${value} pegawai`, "Jumlah"]}
                        />
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="w-full md:w-1/2">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-indigo-600"></div>
                    <span>Sudah Mengumpulkan</span>
                  </span>
                  <span className="font-medium">
                    {employeesWithSkp} pegawai (
                    {Math.round((employeesWithSkp / totalEmployees) * 100) || 0}
                    %)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-rose-500"></div>
                    <span>Belum Mengumpulkan</span>
                  </span>
                  <span className="font-medium">
                    {employeesWithoutSkp} pegawai (
                    {Math.round((employeesWithoutSkp / totalEmployees) * 100) ||
                      0}
                    %)
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="font-semibold">Total Pegawai</span>
                  <span className="font-semibold">
                    {totalEmployees} pegawai
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
