import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, FileDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useSKPDocuments } from "./hooks/useSKPDocuments";
import { SKPForm } from "./SKPForm";
import { SKPTable } from "./SKPTable";
import { YearlySKP, MonthlySKP } from "./types";
import { exportToExcel } from "@/utils/excelExport";
import { SKPDashboard } from "../../umum/skp-recap/SKPDashboard";

export default function SKPSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddSKPOpen, setIsAddSKPOpen] = useState(false);
  const [editingSKP, setEditingSKP] = useState<YearlySKP | MonthlySKP | null>(
    null
  );

  // Default periods
  const [yearlyPeriod, setYearlyPeriod] = useState("penetapan");
  const [monthlyPeriod, setMonthlyPeriod] = useState("01");
  const [mainTab, setMainTab] = useState<"yearly" | "monthly">("yearly");
  const [contentTab, setContentTab] = useState<"dashboard" | "documents">(
    "dashboard"
  );

  // Fetch data based on selected tabs
  const {
    data: skpDocuments = [],
    isLoading,
    refetch,
  } = useSKPDocuments(
    mainTab,
    mainTab === "yearly" ? yearlyPeriod : monthlyPeriod
  );

  // Filter data based on search query
  const filteredSKPs = skpDocuments.filter(
    (skp) =>
      skp.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skp.period.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    const exportData = filteredSKPs.map((skp) => {
      const baseData = {
        "Nama Pegawai": skp.employee_name,
        Periode: getPeriodLabel(mainTab, skp.period),
        "SKP Link": (skp as any).skp_link,
        "Tanggal Upload": new Date(skp.created_at || "").toLocaleDateString(
          "id-ID"
        ),
      };

      // Add CKP link for monthly SKPs
      if (mainTab === "monthly") {
        return {
          ...baseData,
          "CKP Link": (skp as MonthlySKP).ckp_link || "-",
        };
      }

      return baseData;
    });

    exportToExcel(
      exportData,
      `rekap-skp-${mainTab}-${
        mainTab === "yearly" ? yearlyPeriod : monthlyPeriod
      }`
    );
  };

  const getPeriodLabel = (type: "yearly" | "monthly", period: string) => {
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

  const handleClose = () => {
    setIsAddSKPOpen(false);
    setEditingSKP(null);
  };

  const handleEdit = (data: YearlySKP | MonthlySKP) => {
    setEditingSKP(data);
    setIsAddSKPOpen(true);
  };

  return (
    <div className="space-y-6">
      <Tabs
        value={mainTab}
        onValueChange={(value: "yearly" | "monthly") => setMainTab(value)}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="yearly">SKP Tahunan</TabsTrigger>
          <TabsTrigger value="monthly">SKP Bulanan</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="w-full mb-6">
        {mainTab === "yearly" ? (
          <Select value={yearlyPeriod} onValueChange={setYearlyPeriod}>
            <SelectTrigger className="w-full sm:w-[200px] bg-white">
              <SelectValue placeholder="Pilih periode..." />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="penetapan">Penetapan</SelectItem>
              <SelectItem value="penilaian">Penilaian</SelectItem>
              <SelectItem value="evaluasi">Evaluasi</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Select value={monthlyPeriod} onValueChange={setMonthlyPeriod}>
            <SelectTrigger className="w-full sm:w-[200px] bg-white">
              <SelectValue placeholder="Pilih bulan..." />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="01">Januari</SelectItem>
              <SelectItem value="02">Februari</SelectItem>
              <SelectItem value="03">Maret</SelectItem>
              <SelectItem value="04">April</SelectItem>
              <SelectItem value="05">Mei</SelectItem>
              <SelectItem value="06">Juni</SelectItem>
              <SelectItem value="07">Juli</SelectItem>
              <SelectItem value="08">Agustus</SelectItem>
              <SelectItem value="09">September</SelectItem>
              <SelectItem value="10">Oktober</SelectItem>
              <SelectItem value="11">November</SelectItem>
              <SelectItem value="12">Desember</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <Tabs
        value={contentTab}
        onValueChange={(value: "dashboard" | "documents") =>
          setContentTab(value)
        }
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="documents">Dokumen</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <SKPDashboard
            type={mainTab}
            period={mainTab === "yearly" ? yearlyPeriod : monthlyPeriod}
          />
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center w-full sm:w-auto">
              <Input
                placeholder="Cari dokumen SKP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-[300px]"
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={handleExport}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button
                onClick={() => setIsAddSKPOpen(true)}
                className="w-full sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Tambah Dokumen
              </Button>
            </div>
          </div>

          <div className="border rounded-lg mt-6 overflow-y-auto flex-grow">
            {isLoading ? (
              <div className="p-8 text-center">Loading...</div>
            ) : (
              <SKPTable
                skps={filteredSKPs}
                onEdit={handleEdit}
                refetch={refetch}
                type={mainTab}
              />
            )}
          </div>
        </TabsContent>
      </Tabs>

      <SKPForm
        isOpen={isAddSKPOpen}
        onClose={handleClose}
        onSuccess={() => {
          refetch();
          toast.success(
            `Dokumen SKP berhasil ${editingSKP ? "diupdate" : "ditambahkan"}`
          );
        }}
        initialData={editingSKP}
        type={mainTab}
      />
    </div>
  );
}
