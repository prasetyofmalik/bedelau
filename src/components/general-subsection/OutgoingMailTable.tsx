import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { OutgoingMail } from "./types";

interface OutgoingMailTableProps {
  mails: OutgoingMail[];
}

export function OutgoingMailTable({ mails }: OutgoingMailTableProps) {
  return (
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
  );
}