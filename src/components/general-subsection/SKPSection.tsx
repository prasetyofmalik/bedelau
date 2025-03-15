import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, FileDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useSKPDocuments } from "./hooks/useSKPDocuments";
import { SKPForm } from "./SKPForm";
import { SKPTable } from "./SKPTable";
import { SKP } from "./skp-types";
import { exportToExcel } from "@/utils/excelExport";

export default function SKPSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddSKPOpen, setIsAddSKPOpen] = useState(false);
  const [editingSKP, setEditingSKP] = useState<SKP | null>(null);

  // Default tabs and periods
  const [yearlyTab, setYearlyTab] = useState("penetapan");
  const [monthlyTab, setMonthlyTab] = useState("01");
  const [mainTab, setMainTab] = useState("yearly");

  // Fetch data based on selected tabs
  const {
    data: skpDocuments = [],
    isLoading,
    refetch,
  } = useSKPDocuments(mainTab, mainTab === "yearly" ? yearlyTab : monthlyTab);

  // Filter data based on search query
  const filteredSKPs = skpDocuments.filter(
    (skp) =>
      skp.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skp.period.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    const exportData = filteredSKPs.map((skp) => ({
      "Nama Pegawai": skp.employee_name,
      "Tipe SKP": skp.skp_type === "yearly" ? "Tahunan" : "Bulanan",
      Periode: getPeriodLabel(skp.skp_type, skp.period),
      "Link Dokumen": skp.document_link,
      "Tanggal Upload": new Date(skp.created_at || "").toLocaleDateString(
        "id-ID"
      ),
    }));

    exportToExcel(
      exportData,
      `rekap-skp-${mainTab}-${mainTab === "yearly" ? yearlyTab : monthlyTab}`
    );
  };

  const getPeriodLabel = (type: string, period: string) => {
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

  const handleEdit = (data: SKP) => {
    setEditingSKP(data);
    setIsAddSKPOpen(true);
  };

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue="yearly"
        value={mainTab}
        onValueChange={setMainTab}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="yearly">Tahunan</TabsTrigger>
          <TabsTrigger value="monthly">Bulanan</TabsTrigger>
        </TabsList>

        <TabsContent value="yearly" className="space-y-4">
          <Tabs
            defaultValue="penetapan"
            value={yearlyTab}
            onValueChange={setYearlyTab}
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="penetapan">Penetapan</TabsTrigger>
              <TabsTrigger value="penilaian">Penilaian</TabsTrigger>
              <TabsTrigger value="evaluasi">Evaluasi</TabsTrigger>
            </TabsList>

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
                />
              )}
            </div>
          </Tabs>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Tabs
            defaultValue="01"
            value={monthlyTab}
            onValueChange={setMonthlyTab}
            className="w-full"
          >
            <TabsList className="mb-4 flex flex-wrap">
              <TabsTrigger value="01">Januari</TabsTrigger>
              <TabsTrigger value="02">Februari</TabsTrigger>
              <TabsTrigger value="03">Maret</TabsTrigger>
              <TabsTrigger value="04">April</TabsTrigger>
              <TabsTrigger value="05">Mei</TabsTrigger>
              <TabsTrigger value="06">Juni</TabsTrigger>
              <TabsTrigger value="07">Juli</TabsTrigger>
              <TabsTrigger value="08">Agustus</TabsTrigger>
              <TabsTrigger value="09">September</TabsTrigger>
              <TabsTrigger value="10">Oktober</TabsTrigger>
              <TabsTrigger value="11">November</TabsTrigger>
              <TabsTrigger value="12">Desember</TabsTrigger>
            </TabsList>

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
                />
              )}
            </div>
          </Tabs>
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
      />
    </div>
  );
}
