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
    <div className="rounded-md border h-[78vh] overflow-x-auto">
      <Table>
        <TableHeader
          className="bg-yellow-300"
          style={{ position: "sticky", top: "0", zIndex: "1 !important" }}
        >
          <TableRow>
            <TableHead>Kecamatan</TableHead>
            <TableHead>Desa/Kelurahan</TableHead>
            <TableHead>NKS</TableHead>
            <TableHead>Perkiraan Jumlah Ruta</TableHead>
            <TableHead>PML</TableHead>
            <TableHead>PPL</TableHead>
            <TableHead>Status Pemutakhiran</TableHead>
            <TableHead>Jumlah Keluarga Sebelum (Blok II)</TableHead>
            <TableHead>Jumlah Keluarga Hasil (Blok II)</TableHead>
            <TableHead>Jumlah Ruta Hasil (Blok II)</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {updates.map((update) => (
            <TableRow key={update.sample_code}>
              <TableCell>{update.kecamatan}</TableCell>
              <TableCell>{update.desa_kelurahan}</TableCell>
              <TableCell>{update.sample_code}</TableCell>
              <TableCell>{update.households_before}</TableCell>
              <TableCell>{update.pml}</TableCell>
              <TableCell>{update.ppl}</TableCell>
              <TableCell>{getStatusBadge(update.status)}</TableCell>
              <TableCell>{update.families_before || "-"}</TableCell>
              <TableCell>{update.families_after || "-"}</TableCell>
              <TableCell>{update.households_after || "-"}</TableCell>
              <TableCell>
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