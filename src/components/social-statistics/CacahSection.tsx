import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, FileDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { CacahDataForm } from "./CacahForm";
import { CacahTable } from "./CacahTable";
import { CacahSsnM25Data, } from "./types";
import { exportToExcel } from "@/utils/excelExport";

export function CacahSection() {
  const [searchQuery2, setSearchQuery2] = useState("");
  const [isAddCacahOpen, setIsAddCacahOpen] = useState(false);
  const [editingCacah, setEditingCacah] = useState<CacahSsnM25Data | null>(
    null
  );

  // Query to get all samples
  const { data: allSamples = [] } = useQuery({
    queryKey: ["ssn_m25_samples", searchQuery2],
    queryFn: async () => {
      let query = supabase.from("ssn_m25_samples").select("*");

      if (searchQuery2) {
        query = query.or(
          `sample_code.ilike.%${searchQuery2}%, pml.ilike.%${searchQuery2}%, pcl.ilike.%${searchQuery2}%`
        );
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching samples:", error);
        throw error;
      }
      return data;
    },
  });

  // Query to get all tercacah
  const {
    data: tercacahSamples = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["ssn_m25_cacah", searchQuery2],
    queryFn: async () => {
      let query = supabase
        .from("ssn_m25_cacah")
        .select(
          `
          id,
          sample_code,
          no_ruta,
          r203_msbp,
          r203_kp,
          status,
          created_at
        `
        )
        .order("created_at", { ascending: false });

      const { data: cacahs, error } = await query;
      if (error) {
        console.error("Error fetching cacah:", error);
        throw error;
      }

      // Create a map of cacahs by sample_code
      const cacahsMap = new Map();
      cacahs?.forEach((cacah) => {
        if (!cacahsMap.has(cacah.sample_code)) {
          cacahsMap.set(cacah.sample_code, cacah);
        }
      });

      // Combine samples with their cacahs
      return allSamples.map((sample) => {
        const cacah = cacahsMap.get(sample.sample_code);
        return {
          ...sample,
          id: cacah?.id || null,
          no_ruta: cacah?.no_ruta || null,
          r203_msbp: cacah?.r203_msbp || null,
          r203_kp: cacah?.r203_kp || null,
          status: cacah?.status || "belum",
          created_at: cacah?.created_at || null,
        };
      });
    },
    enabled: allSamples.length > 0, // Only run this query after samples are loaded
  });

  const handleExport = () => {
    const exportData = tercacahSamples.map((cacah) => ({
      "kode prop": "14",
      "kode kab": "05",
      "kode NKS [6 digit]": cacah.sample_code,
      "No Urut Ruta [max: 10]": cacah.no_ruta,
      "Sudah Selesai [sudah/belum]": cacah.status || "belum",
      "Hasil Pencacahan Ruta (R203) MSBP": cacah.r203_msbp || "-",
      "Hasil Pencacahan Ruta (R203) KP": cacah.r203_kp || "-",
    }));
    exportToExcel(exportData, "progress-pencacahan");
  };

  const handleClose = () => {
    setIsAddCacahOpen(false);
    setEditingCacah(null);
  };

  const handleEdit = (data: CacahSsnM25Data) => {
    setEditingCacah(data);
    setIsAddCacahOpen(true);
  };

  return (
    <>
      <div className="space-y-6 mt-10 flex flex-col">
        <h3 className="text-xl font-semibold">Progress Lapangan PCL</h3>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center w-full sm:w-auto">
            <Input
              placeholder="Cari pencacahan..."
              value={searchQuery2}
              onChange={(e) => setSearchQuery2(e.target.value)}
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
              onClick={() => setIsAddCacahOpen(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Pencacahan
            </Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-y-auto flex-grow">
          {isLoading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : (
            <CacahTable
              cacahs={tercacahSamples}
              onEdit={handleEdit}
              refetch={refetch}
            />
          )}
        </div>

        <CacahDataForm
          isOpen={isAddCacahOpen}
          onClose={handleClose}
          onSuccess={refetch}
          initialData={editingCacah}
        />
      </div>
    </>
  );
}
