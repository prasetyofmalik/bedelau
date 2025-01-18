import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PeriksaSsnM25TableProps } from "./types";
import { Badge } from "@/components/ui/badge";

export function PeriksaTable({ periksas }: PeriksaSsnM25TableProps) {
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
            <TableHead>NKS</TableHead>
            <TableHead>PML</TableHead>
            <TableHead>PCL</TableHead>
            <TableHead>Status Selesai Pemeriksaan</TableHead>
            <TableHead>No Urut Ruta</TableHead>
            <TableHead>Rata-rata Pengeluaran Makanan Sebulan</TableHead>
            <TableHead>Rata-rata Pengeluaran Bukan Makanan Sebulan</TableHead>
            <TableHead>Jumlah Komoditas Makanan (R304) KP</TableHead>
            <TableHead>Jumlah Komoditas Bukan Makanan (R305) KP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {periksas.map((sample) => {
            const rowCount = Math.max(1, sample.periksa_data.length);

            return sample.periksa_data.length > 0 ? ( 
              sample.periksa_data.map((periksa:any, index:number) => (
              <TableRow key={`${sample.sample_code}_${periksa.no_ruta}`}>
                {index === 0 ? (
                  <>
                    <TableCell rowSpan={rowCount}>{sample.sample_code}</TableCell>
                    <TableCell rowSpan={rowCount}>{sample.pml}</TableCell>
                    <TableCell rowSpan={rowCount}>{sample.pcl}</TableCell>
                  </>
                ) : null}
                <TableCell>{getStatusBadge(periksa.status)}</TableCell>
                <TableCell>{periksa.no_ruta || "-"}</TableCell>
                <TableCell>{periksa.iv3_2_16 || "-"}</TableCell>
                <TableCell>{periksa.iv3_3_8 || "-"}</TableCell>
                <TableCell>{periksa.r304_kp || "-"}</TableCell>
                <TableCell>{periksa.r305_kp || "-"}</TableCell>
              </TableRow>
              ))
            ) : (
              <TableRow key={sample.sample_code}>
                <TableCell>{sample.sample_code}</TableCell>
                <TableCell>{sample.pml}</TableCell>
                <TableCell>{sample.pcl}</TableCell>
                <TableCell>{getStatusBadge(undefined)}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}