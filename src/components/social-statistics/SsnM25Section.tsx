import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, FileDown } from "lucide-react";
import {
  useIncomingMails,
  useOutgoingMails,
} from "../general-subsection/hooks/useMails";
import { IncomingMailTable } from "../general-subsection/IncomingMailTable";
import { OutgoingMailTable } from "../general-subsection/OutgoingMailTable";
import { AddMailForm } from "../general-subsection/AddMailForm";
import { IncomingMail, OutgoingMail } from "../general-subsection/types";
import { exportToExcel } from "@/utils/excelExport";

export function DashboardSsnM25Section() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMailOpen, setIsAddMailOpen] = useState(false);
  const [editingMail, setEditingMail] = useState<IncomingMail | null>(null);
  const {
    data: mails = [],
    isLoading,
    refetch,
  } = useIncomingMails(searchQuery);

  const handleExport = () => {
    const exportData = mails.map((mail) => ({
      "Nomor Surat": mail.number,
      Tanggal: mail.date,
      Pengirim: mail.sender,
      Klasifikasi: mail.classification,
      Disposisi: mail.disposition,
      "Tanggal Disposisi": mail.disposition_date,
      "Tanggal Balasan": mail.reply_date || "-",
    }));
    exportToExcel(exportData, "surat-masuk");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center w-full sm:w-auto">
          <Input
            placeholder="Cari diagram..."
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
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        {/* {isLoading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : (
          <IncomingMailTable 
            mails={mails} 
            onEdit={handleEdit}
            refetch={refetch}
          />
        )} */}
      </div>
    </div>
  );
}

export function InputPclSsnM25Section() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMailOpen, setIsAddMailOpen] = useState(false);
  const {
    data: mails = [],
    isLoading,
    refetch,
  } = useOutgoingMails(searchQuery);

  const handleExport = () => {
    const exportData = mails.map((mail) => ({
      "Nomor Surat": mail.number,
      Tanggal: mail.date,
      Pengirim: mail.origin,
      Tujuan: mail.destination,
      Uraian: mail.description,
      "Surat Balasan": mail.is_reply_letter ? "Ya" : "Tidak",
      Referensi: mail.reference,
      Pembuat: mail.employee_name,
    }));
    exportToExcel(exportData, "surat-keluar");
  };

  const handleClose = () => {
    setIsAddMailOpen(false);
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
              onClick={() => setIsAddMailOpen(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Pemutakhiran
            </Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-x-auto">
          {/* {isLoading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : (
          <OutgoingMailTable 
            mails={mails} 
            onEdit={handleEdit}
            refetch={refetch}
          />
        )} */}
        </div>

        <AddMailForm
          type="outgoing"
          isOpen={isAddMailOpen}
          onClose={handleClose}
          onSuccess={refetch}
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
            <Button
              onClick={() => setIsAddMailOpen(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Progress
            </Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-x-auto">
          {/* {isLoading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : (
          <OutgoingMailTable 
            mails={mails} 
            onEdit={handleEdit}
            refetch={refetch}
          />
        )} */}
        </div>

        <AddMailForm
          type="outgoing"
          isOpen={isAddMailOpen}
          onClose={handleClose}
          onSuccess={refetch}
        />
      </div>
    </>
  );
}

export function InputPmlSsnM25Section() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMailOpen, setIsAddMailOpen] = useState(false);
  const {
    data: mails = [],
    isLoading,
    refetch,
  } = useOutgoingMails(searchQuery);

  const handleExport = () => {
    const exportData = mails.map((mail) => ({
      "Nomor Surat": mail.number,
      Tanggal: mail.date,
      Pengirim: mail.origin,
      Tujuan: mail.destination,
      Uraian: mail.description,
      "Surat Balasan": mail.is_reply_letter ? "Ya" : "Tidak",
      Referensi: mail.reference,
      Pembuat: mail.employee_name,
    }));
    exportToExcel(exportData, "surat-keluar");
  };

  const handleClose = () => {
    setIsAddMailOpen(false);
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
            <Button
              onClick={() => setIsAddMailOpen(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Progress
            </Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-x-auto">
          {/* {isLoading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : (
          <OutgoingMailTable 
            mails={mails} 
            onEdit={handleEdit}
            refetch={refetch}
          />
        )} */}
        </div>

        <AddMailForm
          type="outgoing"
          isOpen={isAddMailOpen}
          onClose={handleClose}
          onSuccess={refetch}
        />
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
            <Button
              onClick={() => setIsAddMailOpen(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Fenomena
            </Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-x-auto">
          {/* {isLoading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : (
          <OutgoingMailTable 
            mails={mails} 
            onEdit={handleEdit}
            refetch={refetch}
          />
        )} */}
        </div>

        <AddMailForm
          type="outgoing"
          isOpen={isAddMailOpen}
          onClose={handleClose}
          onSuccess={refetch}
        />
      </div>
    </>
  );
}
