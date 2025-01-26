import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CacahSsnM25TableProps } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

const getR203Label = (value?: string) => {
  switch (value) {
    case "1":
      return "Terisi Lengkap";
    case "2":
      return "Terisi tdk lengkap";
    case "3":
      return "Tidak ada ART/responden yang memberikan informasi sampai akhir masa pencacahan";
    case "4":
      return "Menolak";
    case "5":
      return "Ruta pindah";
    default:
      return "-";
  }
};

export function CacahTable({ cacahs, onEdit }: CacahSsnM25TableProps) {
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
    <div className="rounded-md border h-[80vh] overflow-x-auto">
      <Table>
        <TableHeader
          className="bg-yellow-300"
          style={{ position: "sticky", top: "0", zIndex: "1 !important" }}
        >
          <TableRow>
            <TableHead>NKS</TableHead>
            <TableHead>PML</TableHead>
            <TableHead>PPL</TableHead>
            <TableHead>Status Selesai Pencacahan</TableHead>
            <TableHead>No Urut Ruta</TableHead>
            <TableHead>Hasil Pencacahan Ruta (R203) MSBP</TableHead>
            <TableHead>Hasil Pencacahan Ruta (R203) KP</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cacahs.map((sample) => {
            const rowCount = Math.max(1, sample.cacah_data.length);

            return sample.cacah_data.length > 0 ? (
              sample.cacah_data.map((cacah: any, index: number) => (
                <TableRow key={`${sample.sample_code}_${cacah.no_ruta}`}>
                  {index === 0 ? (
                    <>
                      <TableCell rowSpan={rowCount}>
                        {sample.sample_code}
                      </TableCell>
                      <TableCell rowSpan={rowCount}>{sample.pml}</TableCell>
                      <TableCell rowSpan={rowCount}>{sample.ppl}</TableCell>
                    </>
                  ) : null}
                  <TableCell>{getStatusBadge(cacah.status)}</TableCell>
                  <TableCell>{cacah.no_ruta || "-"}</TableCell>
                  <TableCell>
                    {getR203Label(cacah.r203_msbp?.toString())}
                  </TableCell>
                  <TableCell>
                    {getR203Label(cacah.r203_kp?.toString())}
                  </TableCell>
                  <TableCell>
                    {cacah.status == "belum" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(cacah)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow key={sample.sample_code}>
                <TableCell>{sample.sample_code}</TableCell>
                <TableCell>{sample.pml}</TableCell>
                <TableCell>{sample.ppl}</TableCell>
                <TableCell>{getStatusBadge(undefined)}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
