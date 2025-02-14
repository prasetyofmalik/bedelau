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
      return "Terisi lengkap";
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
    <div className="rounded-md border max-h-[78vh] overflow-x-auto">
      <Table>
        <TableHeader className="bg-yellow-300">
          <TableRow className="border-b border-gray-400">
            <TableHead className="text-black p-1 text-center">NKS</TableHead>
            <TableHead className="text-black p-1 text-center">PML</TableHead>
            <TableHead className="text-black p-1 text-center">PPL</TableHead>
            <TableHead className="text-black p-1 text-center">
              Status Pencacahan
            </TableHead>
            <TableHead className="text-black py-1 text-center">
              No Urut Ruta
            </TableHead>
            <TableHead className="text-black p-1 text-xs text-center">
              Hasil Pencacahan Ruta (R203) KOR
            </TableHead>
            <TableHead className="text-black p-1 text-xs text-center">
              Hasil Pencacahan Ruta (R203) KP
            </TableHead>
            <TableHead className="text-black p-1 text-xs text-center">
              Hasil Pencacahan Ruta (R203) Seruti
            </TableHead>
            <TableHead className="text-black p-1 text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cacahs.map((sample) => {
            const rowCount = Math.max(1, sample.cacah_data.length);

            return sample.cacah_data.length > 0 ? (
              sample.cacah_data.map((cacah: any, index: number) => (
                <TableRow
                  key={`${sample.sample_code}_${cacah.no_ruta}`}
                  className="border-b border-gray-400"
                >
                  {index === 0 ? (
                    <>
                      <TableCell
                        className="text-secondary p-1"
                        rowSpan={rowCount}
                      >
                        {sample.sample_code}
                      </TableCell>
                      <TableCell
                        className="text-secondary p-1 text-xs md:text-base"
                        rowSpan={rowCount}
                      >
                        {sample.pml}
                      </TableCell>
                      <TableCell
                        className="text-secondary p-1 text-xs md:text-base"
                        rowSpan={rowCount}
                      >
                        {sample.ppl}
                      </TableCell>
                    </>
                  ) : null}
                  <TableCell className="text-secondary p-1 text-center whitespace-nowrap">
                    {getStatusBadge(cacah.status)}
                  </TableCell>
                  <TableCell className="text-secondary p-1 pr-4 text-right">
                    {cacah.no_ruta || "-"}
                  </TableCell>
                  <TableCell className="text-secondary p-1 text-xs md:text-base">
                    {getR203Label(cacah.r203_kor?.toString())}
                  </TableCell>
                  <TableCell className="text-secondary p-1 text-xs md:text-base">
                    {getR203Label(cacah.r203_kp?.toString())}
                  </TableCell>
                  <TableCell className="text-secondary p-1 text-xs md:text-base">
                    {sample.sample_code?.startsWith("2")
                      ? getR203Label(cacah.r203_seruti?.toString())
                      : "-"}
                  </TableCell>
                  <TableCell className="text-secondary p-1">
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
              <TableRow
                key={sample.sample_code}
                className="border-b border-gray-400"
              >
                <TableCell className="text-secondary p-1">
                  {sample.sample_code}
                </TableCell>
                <TableCell className="text-secondary p-1 text-xs md:text-base">
                  {sample.pml}
                </TableCell>
                <TableCell className="text-secondary p-1 text-xs md:text-base">
                  {sample.ppl}
                </TableCell>
                <TableCell className="text-secondary p-1 text-center whitespace-nowrap">
                  {getStatusBadge(undefined)}
                </TableCell>
                <TableCell className="text-secondary p-1 pr-4 text-right">
                  -
                </TableCell>
                <TableCell className="text-secondary p-1 text-xs md:text-base">
                  -
                </TableCell>
                <TableCell className="text-secondary p-1 text-xs md:text-base">
                  -
                </TableCell>
                <TableCell className="text-secondary p-1 text-xs md:text-base">
                  -
                </TableCell>
                <TableCell className="text-secondary p-1"></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
