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

export function CacahTable({ cacahs }: CacahSsnM25TableProps) {
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

  // Group cacahs by sample_code
  const groupedCacahs = cacahs.reduce((acc, cacah) => {
    if (!acc[cacah.sample_code]) {
      acc[cacah.sample_code] = [];
    }
    acc[cacah.sample_code].push(cacah);
    return acc;
  }, {} as Record<string, typeof cacahs>);

  // Sort entries by no_ruta for each sample_code
  Object.keys(groupedCacahs).forEach(sampleCode => {
    groupedCacahs[sampleCode].sort((a, b) => {
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
            <TableHead>Status Selesai Pencacahan</TableHead>
            <TableHead>No Urut Ruta</TableHead>
            <TableHead>Hasil Pencacahan Ruta (R203) MSBP</TableHead>
            <TableHead>Hasil Pencacahan Ruta (R203) KP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(groupedCacahs).map(([sampleCode, entries]) => (
            entries.map((cacah, index) => (
              <TableRow key={`${cacah.sample_code}_${cacah.no_ruta}`}>
                {index === 0 ? (
                  <>
                    <TableCell rowSpan={entries.length}>{cacah.sample_code}</TableCell>
                    <TableCell rowSpan={entries.length}>{cacah.pml}</TableCell>
                    <TableCell rowSpan={entries.length}>{cacah.pcl}</TableCell>
                  </>
                ) : null}
                <TableCell>{getStatusBadge(cacah.status)}</TableCell>
                <TableCell>{cacah.no_ruta || "-"}</TableCell>
                <TableCell>{getR203Label(cacah.r203_msbp?.toString())}</TableCell>
                <TableCell>{getR203Label(cacah.r203_kp?.toString())}</TableCell>
              </TableRow>
            ))
          ))}
        </TableBody>
      </Table>
    </div>
  );
}