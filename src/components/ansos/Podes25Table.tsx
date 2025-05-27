import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { UpdatePodes25Data, SampleData } from "./types";

interface Podes25TableProps {
  updates: (UpdatePodes25Data & SampleData)[];
  onEdit: (data: UpdatePodes25Data) => void;
  refetch: () => void;
}

export function Podes25Table({ updates, onEdit, refetch }: Podes25TableProps) {
  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from("podes25_updates")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Data berhasil dihapus");
      refetch();
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Gagal menghapus data");
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "sudah":
        return (
          <Badge className="bg-green-100 text-green-800">Sudah Selesai</Badge>
        );
      case "belum":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Belum Selesai</Badge>
        );
      default:
        return <Badge className="bg-gray-100 text-gray-800">Belum Input</Badge>;
    }
  };

  return (
    <div className="rounded-md border max-h-[78vh] overflow-x-auto">
      <Table>
        <TableHeader className="bg-yellow-300">
          <TableRow className="border-b border-gray-400">
            <TableHead className="text-black p-1 text-center">Kode Desa/Kel</TableHead>
            <TableHead className="text-black p-1 text-center">Kecamatan</TableHead>
            <TableHead className="text-black p-1 text-center">Desa/Kelurahan</TableHead>
            <TableHead className="text-black p-1 text-center">PML</TableHead>
            <TableHead className="text-black p-1 text-center">PPL</TableHead>
            <TableHead className="text-black p-1 text-center">Status</TableHead>
            <TableHead className="text-black p-1 text-center">Tanggal Input</TableHead>
            <TableHead className="text-black p-1 text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {updates.map((update) => (
            <TableRow key={update.sample_code}>
              <TableCell className="font-medium">
                {update.sample_code}
              </TableCell>
              <TableCell>{update.kecamatan}</TableCell>
              <TableCell>{update.desa_kelurahan}</TableCell>
              <TableCell>{update.pml}</TableCell>
              <TableCell>{update.ppl}</TableCell>
              <TableCell>{getStatusBadge(update.status)}</TableCell>
              <TableCell>
                {update.created_at
                  ? new Date(update.created_at).toLocaleDateString("id-ID")
                  : "-"}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white">
                    <DropdownMenuItem
                      onClick={() => onEdit(update)}
                      className="cursor-pointer"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    {update.id && (
                      <DropdownMenuItem
                        onClick={() => handleDelete(update.id!)}
                        className="cursor-pointer text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
