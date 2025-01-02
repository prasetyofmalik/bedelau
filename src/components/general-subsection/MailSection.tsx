import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, FileDown, Pencil, Trash2 } from "lucide-react";

// Define letter types and which ones require replies
const LETTER_TYPES = {
  REQUEST: { label: "Surat Permohonan", requiresReply: true },
  NOTIFICATION: { label: "Surat Pemberitahuan", requiresReply: false },
  INVITATION: { label: "Surat Undangan", requiresReply: true },
  REPORT: { label: "Surat Laporan", requiresReply: false },
  DECREE: { label: "Surat Keputusan", requiresReply: false },
};

export function IncomingMailSection() {
  const [searchQuery, setSearchQuery] = useState("");

  // Temporary mock data with letter types
  const mails = [
    {
      id: 1,
      number: "001/IN/2024",
      date: "2024-03-20",
      sender: "Department A",
      classification: "REQUEST",
      disposition: "To be reviewed",
      dispositionDate: "2024-03-21",
      replyDate: null,
      status: "Belum Dibalas",
    },
    {
      id: 2,
      number: "002/IN/2024",
      date: "2024-03-21",
      sender: "Department B",
      classification: "NOTIFICATION",
      disposition: "For archive",
      dispositionDate: "2024-03-22",
      replyDate: "-",
      status: "Tidak Memerlukan Balasan",
    },
    {
      id: 3,
      number: "003/IN/2024",
      date: "2024-03-22",
      sender: "Department C",
      classification: "INVITATION",
      disposition: "To be reviewed",
      dispositionDate: "2024-03-23",
      replyDate: "2024-03-24",
      status: "Sudah Dibalas",
    },
  ];

  const getLetterStatus = (mail) => {
    const letterType = LETTER_TYPES[mail.classification];
    
    if (!letterType.requiresReply) {
      return "Tidak Memerlukan Balasan";
    }
    
    return mail.replyDate ? "Sudah Dibalas" : "Belum Dibalas";
  };

  const getReplyDate = (mail) => {
    const letterType = LETTER_TYPES[mail.classification];
    
    if (!letterType.requiresReply) {
      return "-";
    }
    
    return mail.replyDate || "Belum dibalas";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Cari surat masuk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[300px]"
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Surat Masuk
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. Surat</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Pengirim</TableHead>
              <TableHead>Klasifikasi</TableHead>
              <TableHead>Disposisi</TableHead>
              <TableHead>Tgl Disposisi</TableHead>
              <TableHead>Tgl Balasan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mails.map((mail) => (
              <TableRow key={mail.id}>
                <TableCell>{mail.number}</TableCell>
                <TableCell>{mail.date}</TableCell>
                <TableCell>{mail.sender}</TableCell>
                <TableCell>{LETTER_TYPES[mail.classification].label}</TableCell>
                <TableCell>{mail.disposition}</TableCell>
                <TableCell>{mail.dispositionDate}</TableCell>
                <TableCell>{getReplyDate(mail)}</TableCell>
                <TableCell>{getLetterStatus(mail)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export function OutgoingMailSection() {
  const [searchQuery, setSearchQuery] = useState("");

  // Temporary mock data
  const mails = [
    {
      id: 1,
      number: "001/OUT/2024",
      date: "2024-03-20",
      origin: "Team A",
      description: "Response to inquiry",
      status: "Reply",
      reference: "001/IN/2024",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Cari surat keluar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[300px]"
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Surat Keluar
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. Surat</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Asal Tim</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Referensi</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mails.map((mail) => (
              <TableRow key={mail.id}>
                <TableCell>{mail.number}</TableCell>
                <TableCell>{mail.date}</TableCell>
                <TableCell>{mail.origin}</TableCell>
                <TableCell>{mail.description}</TableCell>
                <TableCell>{mail.status}</TableCell>
                <TableCell>{mail.reference}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}