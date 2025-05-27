import { DashboardPodes25Section as DashboardContent } from "./Podes25DashboardSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, FileDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Podes25DataForm } from "./Podes25Form";
import { Podes25Table } from "./Podes25Table";
import { UpdatePodes25Data } from "./types";
import { exportToExcel } from "@/utils/excelExport";

function Podes25MutakhirSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUpdateOpen, setIsAddUpdateOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<UpdatePodes25Data | null>(null);

  // Query to get all samples
  const { data: allSamples = [] } = useQuery({
    queryKey: ["podes25_samples", searchQuery],
    queryFn: async () => {
      let query = supabase.from("podes25_samples").select("*");

      if (searchQuery) {
        query = query.or(
          `sample_code.ilike.%${searchQuery}%, kecamatan.ilike.%${searchQuery}%, desa_kelurahan.ilike.%${searchQuery}%, pml.ilike.%${searchQuery}%, ppl.ilike.%${searchQuery}%`
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

  // Query to get all updates
  const {
    data: updatedSamples = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["podes25_updates", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("podes25_updates")
        .select("id, sample_code, status, created_at")
        .order("created_at", { ascending: false });

      const { data: updates, error } = await query;
      if (error) {
        console.error("Error fetching updates:", error);
        throw error;
      }

      // Create a map of updates by sample_code
      const updatesMap = new Map();
      updates?.forEach((update) => {
        if (!updatesMap.has(update.sample_code)) {
          updatesMap.set(update.sample_code, update);
        }
      });

      // Combine samples with their updates
      return allSamples.map((sample) => {
        const update = updatesMap.get(sample.sample_code);
        return {
          ...sample,
          id: update?.id || null,
          status: update?.status,
          created_at: update?.created_at || null,
        };
      });
    },
    enabled: allSamples.length > 0,
  });

  const handleExport = () => {
    const exportData = updatedSamples.map((update) => ({
      "Kode Desa/Kel.": update.sample_code,
      "Kecamatan": update.kecamatan,
      "Desa/Kelurahan": update.desa_kelurahan,
      "PML": update.pml,
      "PPL": update.ppl,
      "Status": update.status === "sudah" ? "Sudah Selesai" : update.status === "belum" ? "Belum Selesai" : "Belum Input",
      "Tanggal Input": update.created_at ? new Date(update.created_at).toLocaleDateString("id-ID") : "-",
    }));
    exportToExcel(exportData, "pemutakhiran-data-podes25");
  };

  const handleClose = () => {
    setIsAddUpdateOpen(false);
    setEditingUpdate(null);
  };

  const handleEdit = (data: UpdatePodes25Data) => {
    setEditingUpdate(data);
    setIsAddUpdateOpen(true);
  };

  return (
    <div className="space-y-6 flex flex-col">
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

      <div className="border rounded-lg overflow-y-auto flex-grow">
        {isLoading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : (
          <Podes25Table
            updates={updatedSamples}
            onEdit={handleEdit}
            refetch={refetch}
          />
        )}
      </div>

      <Podes25DataForm
        isOpen={isAddUpdateOpen}
        onClose={handleClose}
        onSuccess={refetch}
        initialData={editingUpdate}
      />
    </div>
  );
}

export function DashboardPodes25Section() {
  return <DashboardContent />;
}

export function InputPplPodes25Section() {
  return (
    <Tabs defaultValue="pemutakhiran" className="space-y-6">
      <TabsList className="inline-flex p-1 bg-muted/10 rounded-lg gap-2">
        <TabsTrigger
          value="pemutakhiran"
          className="rounded-md px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
        >
          Pemutakhiran
        </TabsTrigger>
      </TabsList>
      <TabsContent value="pemutakhiran">
        <Podes25MutakhirSection />
      </TabsContent>
    </Tabs>
  );
}