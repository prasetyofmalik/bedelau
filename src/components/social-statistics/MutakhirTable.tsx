import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MutakhirTableProps } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export function MutakhirTable({ updates, onEdit }: MutakhirTableProps) {
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "sudah":
        return <Badge className="bg-green-500">Sudah Selesai</Badge>;
      case "belum":
        return <Badge className="bg-yellow-500">Belum Selesai</Badge>;
      default:
        return <Badge className="bg-red-500">Belum Input</Badge>;
    }
  };

  return (
    <div className="rounded-md border max-h-[78vh] overflow-x-auto">
      <Table>
        <TableHeader className="bg-yellow-300">
          <TableRow className="sticky top-0 z-1">
            <TableHead className="text-black p-1 text-center">Kecamatan</TableHead>
            <TableHead className="text-black p-1 text-center">Desa/Kelurahan</TableHead>
            <TableHead className="text-black p-1 text-center">NKS</TableHead>
            <TableHead className="text-black p-1 text-center">Perkiraan Jumlah Ruta</TableHead>
            <TableHead className="text-black py-1 text-center">PML</TableHead>
            <TableHead className="text-black py-1 text-center">PPL</TableHead>
            <TableHead className="text-black p-1 text-center">Status Pemutakhiran</TableHead>
            <TableHead className="text-black p-1 text-xs text-center">Jumlah Keluarga Sebelum (Blok II)</TableHead>
            <TableHead className="text-black p-1 text-xs text-center">Jumlah Keluarga Hasil (Blok II)</TableHead>
            <TableHead className="text-black p-1 text-xs text-center">Jumlah Ruta Hasil (Blok II)</TableHead>
            <TableHead className="text-black p-1 text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {updates.map((update) => (
            <TableRow key={update.sample_code}>
              <TableCell className="text-secondary text-xs md:text-base p-1">{update.kecamatan}</TableCell>
              <TableCell className="text-secondary text-xs md:text-base p-1">{update.desa_kelurahan}</TableCell>
              <TableCell className="text-secondary p-1">{update.sample_code}</TableCell>
              <TableCell className="text-secondary py-1 text-right">{update.households_before}</TableCell>
              <TableCell className="text-secondary text-xs md:text-base p-1">{update.pml}</TableCell>
              <TableCell className="text-secondary text-xs md:text-base p-1">{update.ppl}</TableCell>
              <TableCell className="text-secondary p-1 text-center">{getStatusBadge(update.status)}</TableCell>
              <TableCell className="text-secondary py-1 text-right">{update.families_before || "-"}</TableCell>
              <TableCell className="text-secondary py-1 text-right">{update.families_after || "-"}</TableCell>
              <TableCell className="text-secondary py-1 text-right">{update.households_after || "-"}</TableCell>
              <TableCell className="text-secondary p-1">
                {update.status == "belum" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(update)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
