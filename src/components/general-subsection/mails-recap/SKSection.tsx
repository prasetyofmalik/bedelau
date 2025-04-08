import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, FileDown } from "lucide-react";
import { SKTable } from "./SKTable";
import { AddMailForm } from "./AddMailForm";
import { useMails } from "./hooks/useMails";
import { SK } from "./types";
import { exportToExcel } from "@/utils/excelExport";

export function SKSection() {
  const [isAddSKOpen, setIsAddSKOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSK, setSelectedSK] = useState<SK | null>(null);

  const { data: sks = [], isLoading, refetch } = useMails<SK>({
    table: "sk_documents",
    searchQuery,
    searchFields: ["number", "description", "month_year"],
  });

  const handleExport = () => {
    const exportData = sks.map(sk => ({
      'Nomor SK': sk.number,
      'Bulan/Tahun': sk.month_year,
      'Tanggal SK': sk.date,
      'Uraian': sk.description,
      'Pembuat': sk.employee_name,
      'Link': sk.link
    }));
    exportToExcel(exportData, 'sk-documents');
  };

  const handleEdit = (sk: SK) => {
    setSelectedSK(sk);
    setIsAddSKOpen(true);
  };

  const handleClose = () => {
    setIsAddSKOpen(false);
    setSelectedSK(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center w-full sm:w-auto">
          <Input
            placeholder="Cari SK..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-[300px]"
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button variant="outline" className="w-full sm:w-auto" onClick={handleExport}>
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsAddSKOpen(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Tambah SK
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : (
          <SKTable
            sks={sks}
            onEdit={handleEdit}
            refetch={refetch}
          />
        )}
      </div>

      <AddMailForm
        type="sk"
        isOpen={isAddSKOpen}
        onClose={handleClose}
        onSuccess={refetch}
        initialData={selectedSK}
      />
    </div>
  );
}