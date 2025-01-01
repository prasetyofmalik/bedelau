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