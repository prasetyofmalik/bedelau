import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { IncomingMail, LETTER_TYPES } from "./types";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

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
  const [hoveredColumn, setHoveredColumn] = useState<keyof IncomingMail | null>(null);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    try {
      return format(parseISO(dateString), "d MMMM yyyy", { locale: id });
    } catch {
      return dateString;
    }
  };

  const getLetterStatus = (mail: IncomingMail) => {
    if (!mail.classification || !LETTER_TYPES[mail.classification]) {
      return "Status Tidak Diketahui";
    }

    const letterType = LETTER_TYPES[mail.classification];
    if (!letterType.requiresReply) {
      return "Tidak Butuh Balasan";
    }
    
    return mail.reply_date ? "Sudah Dibalas" : "Belum Dibalas";
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

  const renderSortIcon = (columnKey: keyof IncomingMail) => {
    if (sortConfig?.key === columnKey) {
      return sortConfig.direction === 'asc' ? 
        <ArrowUp className="inline h-4 w-4 ml-1" /> : 
        <ArrowDown className="inline h-4 w-4 ml-1" />;
    }
    return hoveredColumn === columnKey ? <ArrowUp className="inline h-4 w-4 ml-1 opacity-50" /> : null;
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
        <TableRow className="bg-blue-500">
          <TableHead 
            onClick={() => handleSort('number')} 
            onMouseEnter={() => setHoveredColumn('number')}
            onMouseLeave={() => setHoveredColumn(null)}
            className="cursor-pointer hover:bg-blue-600 text-white"
          >
            No. Surat {renderSortIcon('number')}
          </TableHead>
          <TableHead 
            onClick={() => handleSort('date')}
            onMouseEnter={() => setHoveredColumn('date')}
            onMouseLeave={() => setHoveredColumn(null)}
            className="cursor-pointer hover:bg-blue-600 text-white"
          >
            Tanggal {renderSortIcon('date')}
          </TableHead>
          <TableHead 
            onClick={() => handleSort('sender')}
            onMouseEnter={() => setHoveredColumn('sender')}
            onMouseLeave={() => setHoveredColumn(null)}
            className="cursor-pointer hover:bg-blue-600 text-white"
          >
            Pengirim {renderSortIcon('sender')}
          </TableHead>
          <TableHead 
            onClick={() => handleSort('classification')}
            onMouseEnter={() => setHoveredColumn('classification')}
            onMouseLeave={() => setHoveredColumn(null)}
            className="cursor-pointer hover:bg-blue-600 text-white"
          >
            Klasifikasi {renderSortIcon('classification')}
          </TableHead>
          <TableHead 
            onClick={() => handleSort('created_at')}
            onMouseEnter={() => setHoveredColumn('created_at')}
            onMouseLeave={() => setHoveredColumn(null)}
            className="cursor-pointer hover:bg-blue-600 text-white"
          >
            Tgl Diterima {renderSortIcon('created_at')}
          </TableHead>
            <TableHead 
            onClick={() => handleSort('disposition')}
            onMouseEnter={() => setHoveredColumn('disposition')}
            onMouseLeave={() => setHoveredColumn(null)}
            className={"cursor-pointer hover:bg-primary text-white"}
            >
            Disposisi {renderSortIcon('disposition')}
            </TableHead>
          <TableHead 
            onClick={() => handleSort('disposition_date')}
            onMouseEnter={() => setHoveredColumn('disposition_date')}
            onMouseLeave={() => setHoveredColumn(null)}
            className="cursor-pointer hover:bg-blue-600 text-white"
          >
            Tgl Disposisi {renderSortIcon('disposition_date')}
          </TableHead>
          <TableHead 
            onClick={() => handleSort('recipient')}
            onMouseEnter={() => setHoveredColumn('recipient')}
            onMouseLeave={() => setHoveredColumn(null)}
            className="cursor-pointer hover:bg-blue-600 text-white"
          >
            Penerima {renderSortIcon('recipient')}
          </TableHead>
          <TableHead 
            onClick={() => handleSort('reply_date')}
            onMouseEnter={() => setHoveredColumn('reply_date')}
            onMouseLeave={() => setHoveredColumn(null)}
            className="cursor-pointer hover:bg-blue-600 text-white"
          >
            Tgl Balasan {renderSortIcon('reply_date')}
          </TableHead>
          <TableHead className="text-white">Status</TableHead>
          <TableHead className="text-white">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedMails.map((mail) => (
          <TableRow key={mail.id}>
            <TableCell>{mail.number}</TableCell>
            <TableCell>{formatDate(mail.date)}</TableCell>
            <TableCell>{mail.sender}</TableCell>
            <TableCell>
              {mail.classification && LETTER_TYPES[mail.classification] 
                ? LETTER_TYPES[mail.classification].label 
                : 'Klasifikasi Tidak Diketahui'}
            </TableCell>
            <TableCell>{formatDate(mail.created_at)}</TableCell>
            <TableCell>{mail.disposition}</TableCell>
            <TableCell>{formatDate(mail.disposition_date)}</TableCell>
            <TableCell>{mail.recipient}</TableCell>
            <TableCell>{formatDate(mail.reply_date)}</TableCell>
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
