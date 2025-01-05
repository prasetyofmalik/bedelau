import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { IncomingMail, LETTER_TYPES } from "./types";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface IncomingMailTableProps {
  mails: IncomingMail[];
  onEdit: (mail: IncomingMail) => void;
  refetch: () => void;
}

type SortConfig = {
  key: keyof IncomingMail;
  direction: 'asc' | 'desc';
} | null;

export function IncomingMailTable({ mails, onEdit, refetch }: IncomingMailTableProps) {
  const { toast } = useToast();
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

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

  const handleSort = (key: keyof IncomingMail) => {
    setSortConfig((currentSort) => {
      if (currentSort?.key === key) {
        if (currentSort.direction === 'asc') {
          return { key, direction: 'desc' };
        }
        return null;
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedMails = [...mails].sort((a, b) => {
    if (!sortConfig) return 0;

    const { key, direction } = sortConfig;
    const aValue = a[key];
    const bValue = b[key];

    if (aValue === null) return 1;
    if (bValue === null) return -1;

    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead onClick={() => handleSort('number')} className="cursor-pointer hover:bg-muted">
            No. Surat <ArrowUpDown className="inline h-4 w-4 ml-1" />
          </TableHead>
          <TableHead onClick={() => handleSort('date')} className="cursor-pointer hover:bg-muted">
            Tanggal <ArrowUpDown className="inline h-4 w-4 ml-1" />
          </TableHead>
          <TableHead onClick={() => handleSort('sender')} className="cursor-pointer hover:bg-muted">
            Pengirim <ArrowUpDown className="inline h-4 w-4 ml-1" />
          </TableHead>
          <TableHead onClick={() => handleSort('classification')} className="cursor-pointer hover:bg-muted">
            Klasifikasi <ArrowUpDown className="inline h-4 w-4 ml-1" />
          </TableHead>
          <TableHead onClick={() => handleSort('disposition')} className="cursor-pointer hover:bg-muted">
            Disposisi <ArrowUpDown className="inline h-4 w-4 ml-1" />
          </TableHead>
          <TableHead onClick={() => handleSort('disposition_date')} className="cursor-pointer hover:bg-muted">
            Tgl Disposisi <ArrowUpDown className="inline h-4 w-4 ml-1" />
          </TableHead>
          <TableHead onClick={() => handleSort('reply_date')} className="cursor-pointer hover:bg-muted">
            Tgl Balasan <ArrowUpDown className="inline h-4 w-4 ml-1" />
          </TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedMails.map((mail) => (
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