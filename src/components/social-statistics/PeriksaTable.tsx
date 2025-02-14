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
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export function PeriksaTable({ periksas, onEdit }: PeriksaSsnM25TableProps) {
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

  const getResponseBadge = (non_response?: boolean) => {
    switch (non_response) {
      case true:
        return <Badge className="bg-red-500">Nonrespons</Badge>;
      case false:
        return <Badge className="bg-green-500">Tidak</Badge>;
      default:
        return "-";
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
            <TableHead className="text-black p-1 text-center">Status Selesai Pemeriksaan</TableHead>
            <TableHead className="text-black py-1 text-center">No Urut Ruta</TableHead>
            <TableHead className="text-black p-1 text-xs text-center">Rata-rata Pengeluaran Makanan Sebulan</TableHead>
            <TableHead className="text-black p-1 text-xs text-center">Rata-rata Pengeluaran Bukan Makanan Sebulan</TableHead>
            <TableHead className="text-black p-1 text-xs text-center">Jumlah Komoditas Makanan (R304) KP</TableHead>
            <TableHead className="text-black p-1 text-xs text-center">Jumlah Komoditas Bukan Makanan (R305) KP</TableHead>
            <TableHead className="text-black p-1 text-center">Nonrespons</TableHead>
            <TableHead className="text-black p-1 text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {periksas.map((sample) => {
            const rowCount = Math.max(1, sample.periksa_data.length);

            return sample.periksa_data.length > 0 ? (
              sample.periksa_data.map((periksa: any, index: number) => (
                <TableRow key={`${sample.sample_code}_${periksa.no_ruta}`} className="border-b border-gray-400">
                  {index === 0 ? (
                    <>
                      <TableCell className="text-secondary p-1 text-center" rowSpan={rowCount}>
                        {sample.sample_code}
                      </TableCell>
                      <TableCell className="text-secondary p-1 text-xs md:text-base" rowSpan={rowCount}>{sample.pml}</TableCell>
                      <TableCell className="text-secondary p-1 text-xs md:text-base" rowSpan={rowCount}>{sample.ppl}</TableCell>
                    </>
                  ) : null}
                  <TableCell className="text-secondary p-1 text-center whitespace-nowrap">
                    {getStatusBadge(periksa.status)}
                  </TableCell>
                  <TableCell className="text-secondary py-1 text-center">{periksa.no_ruta || "-"}</TableCell>
                  <TableCell className="text-secondary py-1 text-center">{periksa.iv3_2_16 || "-"}</TableCell>
                  <TableCell className="text-secondary py-1 text-center">{periksa.iv3_3_8 || "-"}</TableCell>
                  <TableCell className="text-secondary py-1 text-center">{periksa.r304_kp || "-"}</TableCell>
                  <TableCell className="text-secondary py-1 text-center">{periksa.r305_kp || "-"}</TableCell>
                  <TableCell className="text-secondary p-1 text-center">
                    {getResponseBadge(periksa.non_response)}
                  </TableCell>
                  <TableCell className="text-secondary p-1 text-center">
                    {periksa.status == "belum" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(periksa)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow key={sample.sample_code} className="border-b border-gray-400">
                <TableCell className="text-secondary p-1 text-center">{sample.sample_code}</TableCell>
                <TableCell className="text-secondary p-1 text-xs md:text-base">{sample.pml}</TableCell>
                <TableCell className="text-secondary p-1 text-xs md:text-base">{sample.ppl}</TableCell>
                <TableCell className="text-secondary p-1 text-center whitespace-nowrap">{getStatusBadge(undefined)}</TableCell>
                <TableCell className="text-secondary py-1 text-center">-</TableCell>
                <TableCell className="text-secondary py-1 text-center">-</TableCell>
                <TableCell className="text-secondary py-1 text-center">-</TableCell>
                <TableCell className="text-secondary py-1 text-center">-</TableCell>
                <TableCell className="text-secondary py-1 text-center">-</TableCell>
                <TableCell className="text-secondary p-1 text-center">{getResponseBadge()}</TableCell>
                <TableCell className="text-secondary p-1 text-center"></TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}