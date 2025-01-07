import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, FileDown } from "lucide-react";
import { useIncomingMails, useOutgoingMails } from "./hooks/useMails";
import { IncomingMailTable } from "./IncomingMailTable";
import { OutgoingMailTable } from "./OutgoingMailTable";
import { AddMailForm } from "./AddMailForm";
import { IncomingMail, OutgoingMail } from "./types";
import { exportToExcel } from "@/utils/excelExport";

export function IncomingMailSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMailOpen, setIsAddMailOpen] = useState(false);
  const [editingMail, setEditingMail] = useState<IncomingMail | null>(null);
  const { data: mails = [], isLoading, refetch } = useIncomingMails(searchQuery);

  const handleExport = () => {
    const exportData = mails.map(mail => ({
      'Nomor Surat': mail.number,
      'Tanggal': mail.date,
      'Pengirim': mail.sender,
      'Klasifikasi': mail.classification,
      'Disposisi': mail.disposition,
      'Tanggal Disposisi': mail.disposition_date,
      'Tanggal Balasan': mail.reply_date || '-'
    }));
    exportToExcel(exportData, 'surat-masuk');
  };

  const handleEdit = (mail: IncomingMail) => {
    setEditingMail(mail);
    setIsAddMailOpen(true);
  };

  const handleClose = () => {
    setIsAddMailOpen(false);
    setEditingMail(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center w-full sm:w-auto">
          <Input
            placeholder="Cari surat masuk..."
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
          <Button onClick={() => setIsAddMailOpen(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Surat Masuk
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : (
          <IncomingMailTable 
            mails={mails} 
            onEdit={handleEdit}
            refetch={refetch}
          />
        )}
      </div>

      <AddMailForm
        type="incoming"
        isOpen={isAddMailOpen}
        onClose={handleClose}
        onSuccess={refetch}
        initialData={editingMail}
      />
    </div>
  );
}

export function OutgoingMailSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMailOpen, setIsAddMailOpen] = useState(false);
  const [editingMail, setEditingMail] = useState<OutgoingMail | null>(null);
  const { data: mails = [], isLoading, refetch } = useOutgoingMails(searchQuery);

  const handleExport = () => {
    const exportData = mails.map(mail => ({
      'Nomor Surat': mail.number,
      'Tanggal': mail.date,
      'Sumber': mail.origin,
      'Tujuan': mail.destination,
      'Uraian': mail.description,
      'Surat Balasan': mail.is_reply_letter ? 'Ya' : 'Tidak',
      'Referensi': mail.reference,
      'Pembuat': mail.employee_name
    }));
    exportToExcel(exportData, 'surat-keluar');
  };

  const handleEdit = (mail: OutgoingMail) => {
    setEditingMail(mail);
    setIsAddMailOpen(true);
  };

  const handleClose = () => {
    setIsAddMailOpen(false);
    setEditingMail(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center w-full sm:w-auto">
          <Input
            placeholder="Cari surat keluar..."
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
          <Button onClick={() => setIsAddMailOpen(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Surat Keluar
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : (
          <OutgoingMailTable 
            mails={mails} 
            onEdit={handleEdit}
            refetch={refetch}
          />
        )}
      </div>

      <AddMailForm
        type="outgoing"
        isOpen={isAddMailOpen}
        onClose={handleClose}
        onSuccess={refetch}
        initialData={editingMail}
      />
    </div>
  );
}
