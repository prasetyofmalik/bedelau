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

export function CacahTable({ cacahs }: CacahSsnM25TableProps) {
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "sudah":
        return <Badge className="bg-green-500">Sudah Selesai</Badge>;
      case "progress":
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
            <TableHead>NKS</TableHead>
            <TableHead>PML</TableHead>
            <TableHead>PCL</TableHead>
            <TableHead>Status Selesai Pencacahan</TableHead>
            <TableHead>No Urut Ruta</TableHead>
            <TableHead>Hasil Pencacahan Ruta (R203) MSBP</TableHead>
            <TableHead>Hasil Pencacahan Ruta (R203) KP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cacahs.map((cacah) => (
            <TableRow key={cacah.sample_code}>
              <TableCell>{cacah.sample_code}</TableCell>
              <TableCell>{cacah.pml}</TableCell>
              <TableCell>{cacah.pcl}</TableCell>
              <TableCell>{getStatusBadge(cacah.status)}</TableCell>
              <TableCell>{cacah.no_ruta}</TableCell>
              <TableCell>{cacah.r203_msbp || "-"}</TableCell>
              <TableCell>{cacah.r203_kp || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
