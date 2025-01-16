import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, FileDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { UpdateDataForm } from "./UpdateDataForm";
import { UpdateTable } from "./UpdateTable";
import { UpdateData, SampleData } from "./types";
import { exportToExcel } from "@/utils/excelExport";

export function PclSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUpdateOpen, setIsAddUpdateOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<UpdateData | null>(null);

  const { data: updates = [], isLoading, refetch } = useQuery({
    queryKey: ['ssn_m25_updates', searchQuery],
    queryFn: async () => {
      const query = supabase
        .from('ssn_m25_samples')
        .select(`
          sample_code,
          kecamatan,
          desa_kelurahan,
          households_before,
          pml,
          pcl,
          ssn_m25_updates (
            id,
            families_before,
            families_after,
            households_after,
            status,
            created_at
          )
        `)
        .order('created_at', { foreignTable: 'ssn_m25_updates', ascending: false });

      if (searchQuery) {
        query.ilike('sample_code', `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Transform the data to match the expected format
      return data.map((sample: any) => ({
        ...sample,
        id: sample.ssn_m25_updates?.[0]?.id,
        families_before: sample.ssn_m25_updates?.[0]?.families_before || null,
        families_after: sample.ssn_m25_updates?.[0]?.families_after || null,
        households_after: sample.ssn_m25_updates?.[0]?.households_after || null,
        status: sample.ssn_m25_updates?.[0]?.status || 'not_started',
        created_at: sample.ssn_m25_updates?.[0]?.created_at,
      }));
    },
  });

  const handleExport = () => {
    const exportData = updates.map((update) => ({
      "NKS": update.sample_code,
      "Kecamatan": update.kecamatan,
      "Desa/Kelurahan": update.desa_kelurahan,
      "Jumlah RT Susenas Maret 2023": update.households_before,
      "PML": update.pml,
      "PCL": update.pcl,
      "Jumlah Keluarga Sebelum": update.families_before || '-',
      "Jumlah Keluarga Setelah": update.families_after || '-',
      "Jumlah Rumah Tangga": update.households_after || '-',
    }));
    exportToExcel(exportData, "pemutakhiran-data");
  };

  const handleClose = () => {
    setIsAddUpdateOpen(false);
    setEditingUpdate(null);
  };

  const handleEdit = (data: UpdateData) => {
    setEditingUpdate(data);
    setIsAddUpdateOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Pemutakhiran Data</h3>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center w-full sm:w-auto">
            <Input
              placeholder="Cari pemutakhiran..."
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
              onClick={() => setIsAddUpdateOpen(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Pemutakhiran
            </Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : (
            <UpdateTable 
              updates={updates} 
              onEdit={handleEdit}
              refetch={refetch}
            />
          )}
        </div>

        <UpdateDataForm
          isOpen={isAddUpdateOpen}
          onClose={handleClose}
          onSuccess={refetch}
          initialData={editingUpdate}
        />
      </div>

      <div className="space-y-6 mt-10">
        <h3 className="text-xl font-semibold">Progress Lapangan PCL</h3>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center w-full sm:w-auto">
            <Input
              placeholder="Cari progress..."
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
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Progress
            </Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : (
            <div>Table implementation will be added</div>
          )}
        </div>
      </div>
    </>
  );
}