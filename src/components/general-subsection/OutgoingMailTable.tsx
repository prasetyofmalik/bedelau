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
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface OutgoingMailTableProps {
  mails: OutgoingMail[];
  onEdit: (mail: OutgoingMail) => void;
  refetch: () => void;
}

export function OutgoingMailTable({ mails, onEdit, refetch }: OutgoingMailTableProps) {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('outgoing_mails')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menghapus surat keluar",
      });
      return;
    }

    toast({
      title: "Berhasil",
      description: "Surat keluar berhasil dihapus",
    });
    refetch();
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No. Surat</TableHead>
          <TableHead>Tanggal</TableHead>
          <TableHead>Asal Tim</TableHead>
          <TableHead>Deskripsi</TableHead>
          <TableHead>Surat Balasan</TableHead>
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
            <TableCell>{mail.is_reply_letter ? "Ya" : "Tidak"}</TableCell>
            <TableCell>{mail.reference}</TableCell>
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