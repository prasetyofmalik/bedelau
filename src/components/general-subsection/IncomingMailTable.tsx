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
import { IncomingMail, LETTER_TYPES } from "./types";

interface IncomingMailTableProps {
  mails: IncomingMail[];
}

export function IncomingMailTable({ mails }: IncomingMailTableProps) {
  const getLetterStatus = (mail: IncomingMail) => {
    const letterType = LETTER_TYPES[mail.classification];
    
    if (!letterType.requiresReply) {
      return "Tidak Memerlukan Balasan";
    }
    
    return mail.reply_date ? "Sudah Dibalas" : "Belum Dibalas";
  };

  const getReplyDate = (mail: IncomingMail) => {
    const letterType = LETTER_TYPES[mail.classification];
    
    if (!letterType.requiresReply) {
      return "-";
    }
    
    return mail.reply_date || "Belum dibalas";
  };

  return (
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
            <TableCell>{mail.disposition_date}</TableCell>
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
  );
}