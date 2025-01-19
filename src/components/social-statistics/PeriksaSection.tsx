import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, FileDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PeriksaDataForm } from "./PeriksaForm";
import { PeriksaTable } from "./PeriksaTable";
import { PeriksaSsnM25Data } from "./types";
import { exportToExcel } from "@/utils/excelExport";

export function PeriksaSection() {
  const [searchQuery3, setSearchQuery3] = useState("");
  const [isAddPeriksaOpen, setIsAddPeriksaOpen] = useState(false);
  const [editingPeriksa, setEditingPeriksa] = useState<PeriksaSsnM25Data | null>(null);

  const {
    data: diperiksaSamples = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["ssn_m25_periksa", searchQuery3],
    queryFn: async () => {
      let query = supabase
        .from("ssn_m25_samples")
        .select(
          `
          sample_code,
          kecamatan,
          desa_kelurahan,
          pml,
          pcl,
          ssn_m25_periksa (
            id,
            no_ruta,
            iv3_2_16,
            iv3_3_8,
            r304_kp,
            r305_kp,
            status,
            created_at
        )
        `
        )
        .order("sample_code");

        if (searchQuery3) {
          query = query.or(
            `sample_code.ilike.%${searchQuery3}%,pml.ilike.%${searchQuery3}%,pcl.ilike.%${searchQuery3}%`
          );
        }

      const { data, error } = await query;
      if (error) throw error;

      // Transform the data to include all samples, even those without periksa data
      return data.map((sample: any) => ({
        ...sample,
        periksa_data: sample.ssn_m25_periksa || [],
      }));
    },
  });

  const handleExport = () => {
    const exportData = diperiksaSamples.flatMap((sample) => 
      sample.periksa_data.length > 0
          ? sample.periksa_data.map((periksa: any) => ({
              "kode prop": "14",
              "kode kab": "05",
              "kode NKS [6 digit]": sample.sample_code,
              "No Urut Ruta [max: 10]": periksa.no_ruta,
              "Sudah Selesai [sudah/belum]": periksa.status,
              "Hasil Pemeriksaan Ruta (R203) MSBP": periksa.r203_msbp || "-",
              "Rata-rata Pengeluaran Makanan Sebulan": periksa.iv3_2_16 || "-",
              "Rata-rata Pengeluaran Bukan Makanan Sebulan": periksa.iv3_3_8 || "-",
              "Jumlah Komoditas Makanan (R304) KP": periksa.r304_kp || "-",
              "Jumlah Komoditas Bukan Makanan (R305) KP": periksa.r305_kp || "-",
            }))
          : [
              {
                "kode prop": "14",
              "kode kab": "05",
              "kode NKS [6 digit]": sample.sample_code,
              "No Urut Ruta [max: 10]": "-",
              "Sudah Selesai [sudah/belum]": "belum",
              "Hasil Pemeriksaan Ruta (R203) MSBP": "-",
              "Rata-rata Pengeluaran Makanan Sebulan": "-",
              "Rata-rata Pengeluaran Bukan Makanan Sebulan": "-",
              "Jumlah Komoditas Makanan (R304) KP": "-",
              "Jumlah Komoditas Bukan Makanan (R305) KP": "-",
              },
            ]
      );
    exportToExcel(exportData, "progress-pemeriksaan");
  };

  const handleClose = () => {
    setIsAddPeriksaOpen(false);
    setEditingPeriksa(null);
  };

  const handleEdit = (data: PeriksaSsnM25Data) => {
    setEditingPeriksa(data);
    setIsAddPeriksaOpen(true);
  };

  return (
    <>
      <div className="space-y-6 flex flex-col">
        <h3 className="text-xl font-semibold">Progress Pemeriksaan PML</h3>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center w-full sm:w-auto">
            <Input
              placeholder="Cari pemeriksaan..."
              value={searchQuery3}
              onChange={(e) => setSearchQuery3(e.target.value)}
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
              onClick={() => setIsAddPeriksaOpen(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Pemeriksaan
            </Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-y-auto flex-grow">
          {isLoading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : (
            <PeriksaTable
              periksas={diperiksaSamples}
              onEdit={handleEdit}
              onSuccess={refetch}
            />
          )}
        </div>

        <PeriksaDataForm
          isOpen={isAddPeriksaOpen}
          onClose={handleClose}
          onSuccess={refetch}
          initialData={editingPeriksa}
        />
      </div>
    </>
  );
}
