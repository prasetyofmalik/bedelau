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
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface IncomingMailTableProps {
  mails: IncomingMail[];
  onEdit: (mail: IncomingMail) => void;
  refetch: () => void;
}

export function IncomingMailTable({ mails, onEdit, refetch }: IncomingMailTableProps) {
  const { toast } = useToast();

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

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('incoming_mails')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menghapus surat masuk",
      });
      return;
    }

    toast({
      title: "Berhasil",
      description: "Surat masuk berhasil dihapus",
    });
    refetch();
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
                <Button variant="ghost" size="icon" onClick={() => onEdit(mail)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDelete(mail.id)}
                >
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