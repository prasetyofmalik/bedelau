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

export function IncomingMailSection() {
  const [searchQuery, setSearchQuery] = useState("");

  // Temporary mock data
  const mails = [
    {
      id: 1,
      number: "001/IN/2024",
      date: "2024-03-20",
      sender: "Department A",
      classification: "Urgent",
      disposition: "To be reviewed",
      dispositionDate: "2024-03-21",
      replyDate: "2024-03-22",
      status: "Replied",
    },
  ];

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
                <TableCell>{mail.classification}</TableCell>
                <TableCell>{mail.disposition}</TableCell>
                <TableCell>{mail.dispositionDate}</TableCell>
                <TableCell>{mail.replyDate}</TableCell>
                <TableCell>{mail.status}</TableCell>
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