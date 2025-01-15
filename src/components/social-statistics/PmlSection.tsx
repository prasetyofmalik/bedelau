import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, FileDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { exportToExcel } from "@/utils/excelExport";

export function PmlSection() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: updates = [], isLoading } = useQuery({
    queryKey: ['ssn_m25_updates', searchQuery],
    queryFn: async () => {
      const query = supabase
        .from('ssn_m25_updates')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query.ilike('sample_code', `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleExport = () => {
    const exportData = updates.map((update) => ({
      "NKS": update.sample_code,
      "Jumlah Keluarga Sebelum": update.families_before,
      "Jumlah Keluarga Setelah": update.families_after,
      "Jumlah Rumah Tangga": update.households_after,
    }));
    exportToExcel(exportData, "pemutakhiran-data");
  };

  return (
    <>
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Progress Lapangan PML</h3>
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

      <div className="space-y-6 mt-10">
        <h3 className="text-xl font-semibold">Fenomena Lapangan</h3>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center w-full sm:w-auto">
            <Input
              placeholder="Cari fenomena..."
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
              Tambah Fenomena
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