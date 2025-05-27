import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, FileDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { CacahDataForm } from "./CacahForm";
import { CacahTable } from "./CacahTable";
import { CacahSsnM25Data, SurveyType } from "./types";
import { exportToExcel } from "@/utils/excelExport";

interface CacahSectionProps {
  surveyType: SurveyType;
}

export function CacahSection({ surveyType }: CacahSectionProps) {
  const [searchQuery2, setSearchQuery2] = useState("");
  const [isAddCacahOpen, setIsAddCacahOpen] = useState(false);
  const [editingCacah, setEditingCacah] = useState<CacahSsnM25Data | null>(
    null
  );

  const tableName = `${surveyType}_samples`;
  const cacahTableName = `${surveyType}_cacah`;

  // Define columns based on survey type
  const getCacahColumns = () => {
    const baseColumns = "id,no_ruta,status,created_at";
    
    if (surveyType === "seruti25") {
      return `${baseColumns},r203_seruti,sample_type`;
    } else {
      // ssn_m25 and other survey types
      return `${baseColumns},r203_kor,r203_kp,r203_seruti`;
    }
  };

  // Query to get all samples
  const { data: allSamples = [] } = useQuery({
    queryKey: [`${surveyType}_samples`, searchQuery2],
    queryFn: async () => {
      let query = supabase.from(tableName).select("*");

      if (searchQuery2) {
        query = query.or(
          `sample_code.ilike.%${searchQuery2}%, kecamatan.ilike.%${searchQuery2}%, desa_kelurahan.ilike.%${searchQuery2}%, pml.ilike.%${searchQuery2}%, ppl.ilike.%${searchQuery2}%`
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

  // Query to get all cacah data
  const {
    data: tercacahSamples = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [`${surveyType}_cacah`, searchQuery2],
    queryFn: async () => {
      const cacahColumns = getCacahColumns();
      
      let query = supabase
        .from(tableName)
        .select(
          `
          sample_code,
          kecamatan,
          desa_kelurahan,
          pml,
          ppl,
          ${cacahTableName} (
            ${cacahColumns}
          )
        `
        )
        .order("sample_code");

      if (searchQuery2) {
        query = query.or(
          `sample_code.ilike.%${searchQuery2}%,pml.ilike.%${searchQuery2}%,ppl.ilike.%${searchQuery2}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;

      // Transform the data to include all samples, even those without cacah data
      return data.map((sample: any) => ({
        ...sample,
        cacah_data: sample[cacahTableName] || [],
      }));
    },
  });

  const handleExport = () => {
    const exportData = tercacahSamples.flatMap((sample) =>
      sample.cacah_data.length > 0
        ? sample.cacah_data.map((cacah: any) => {
            const baseData = {
              "kode prop": "14",
              "kode kab": "05",
              "kode NKS [6 digit]": sample.sample_code,
              "No Urut Ruta [max: 10]": cacah.no_ruta,
              "Sudah Selesai [sudah/belum]": cacah.status,
            };

            if (surveyType === "seruti25") {
              return {
                ...baseData,
                "Jenis Sampel": cacah.sample_type || "-",
                "Hasil Pencacahan Ruta (R203) Seruti": cacah.r203_seruti || "-",
              };
            } else {
              return {
                ...baseData,
                "Hasil Pencacahan Ruta (R203) KOR": cacah.r203_kor || "-",
                "Hasil Pencacahan Ruta (R203) KP": cacah.r203_kp || "-",
                "Hasil Pencacahan Ruta (R203) Seruti":
                  sample.sample_code?.startsWith("2")
                    ? cacah.r203_seruti || "-"
                    : "-",
              };
            }
          })
        : [
            {
              "kode prop": "14",
              "kode kab": "05",
              "kode NKS [6 digit]": sample.sample_code,
              "No Urut Ruta [max: 10]": "-",
              "Sudah Selesai [sudah/belum]": "-",
              ...(surveyType === "seruti25"
                ? {
                    "Jenis Sampel": "-",
                    "Hasil Pencacahan Ruta (R203) Seruti": "-",
                  }
                : {
                    "Hasil Pencacahan Ruta (R203) KOR": "-",
                    "Hasil Pencacahan Ruta (R203) KP": "-",
                    "Hasil Pencacahan Ruta (R203) Seruti": "-",
                  }),
            },
          ]
    );
    exportToExcel(exportData, "progress-pencacahan");
  };

  const handleClose = () => {
    setIsAddCacahOpen(false);
    setEditingCacah(null);
  };

  const handleEdit = (data: CacahSsnM25Data) => {
    const enrichedData = {
      ...data,
      sample_code:
        tercacahSamples.find((sample) =>
          sample.cacah_data.some((cacah: any) => cacah.id === data.id)
        )?.sample_code || "",
    };
    setEditingCacah(enrichedData);
    setIsAddCacahOpen(true);
  };

  return (
    <div className="space-y-6 flex flex-col">
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
            onSuccess={refetch}
            surveyType={surveyType}
          />
        )}
      </div>

      <CacahDataForm
        isOpen={isAddCacahOpen}
        onClose={handleClose}
        onSuccess={refetch}
        initialData={editingCacah}
        surveyType={surveyType}
      />
    </div>
  );
}