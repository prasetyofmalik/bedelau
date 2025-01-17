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

  // Group periksas by sample_code
  const groupedPeriksas = periksas.reduce((acc, periksa) => {
    if (!acc[periksa.sample_code]) {
      acc[periksa.sample_code] = [];
    }
    acc[periksa.sample_code].push(periksa);
    return acc;
  }, {} as Record<string, typeof periksas>);

  // Sort entries by no_ruta for each sample_code
  Object.keys(groupedPeriksas).forEach(sampleCode => {
    groupedPeriksas[sampleCode].sort((a, b) => {
      const noRutaA = a.no_ruta ? parseInt(a.no_ruta.toString(), 10) : 0;
      const noRutaB = b.no_ruta ? parseInt(b.no_ruta.toString(), 10) : 0;
      return noRutaA - noRutaB;
    });
  });

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
          {Object.entries(groupedPeriksas).map(([sampleCode, entries]) => (
            entries.map((periksa, index) => (
              <TableRow key={`${periksa.sample_code}_${periksa.no_ruta}`}>
                {index === 0 ? (
                  <>
                    <TableCell rowSpan={entries.length}>{periksa.sample_code}</TableCell>
                    <TableCell rowSpan={entries.length}>{periksa.pml}</TableCell>
                    <TableCell rowSpan={entries.length}>{periksa.pcl}</TableCell>
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}