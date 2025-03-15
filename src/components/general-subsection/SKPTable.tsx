import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExternalLink, Pencil, Folder } from "lucide-react";
import { SKPTableProps, MonthlySKP } from "./skp-types";

export function SKPTable({ skps, onEdit, refetch, type }: SKPTableProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getPeriodLabel = (type: "yearly" | "monthly", period: string) => {
    if (type === "yearly") {
      const labels: Record<string, string> = {
        penetapan: "Penetapan",
        penilaian: "Penilaian",
        evaluasi: "Evaluasi",
      };
      return labels[period] || period;
    } else {
      const months = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ];
      const monthIndex = parseInt(period, 10) - 1;
      return months[monthIndex] || period;
    }
  };

  return (
    <div className="rounded-md border max-h-[60vh] overflow-auto">
      <Table>
        <TableHeader className="bg-slate-100">
          <TableRow>
            <TableHead className="py-2">Nama Pegawai</TableHead>
            <TableHead className="py-2">Periode</TableHead>
            <TableHead className="py-2">Tanggal Upload</TableHead>
            <TableHead className="py-2">SKP</TableHead>
            {type === "monthly" && <TableHead className="py-2">CKP</TableHead>}
            <TableHead className="py-2 text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skps.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={type === "monthly" ? 7 : 6}
                className="h-24 text-center text-muted-foreground"
              >
                Tidak ada data dokumen SKP.
              </TableCell>
            </TableRow>
          ) : (
            skps.map((skp) => (
              <TableRow key={skp.id}>
                <TableCell className="py-2 font-medium">
                  {skp.employee_name}
                </TableCell>
                <TableCell className="py-2">
                  {getPeriodLabel(type, skp.period)}
                </TableCell>
                <TableCell className="py-2">
                  {formatDate(skp.created_at)}
                </TableCell>
                <TableCell className="py-2">
                  <a
                    href={(skp as any).skp_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    Lihat SKP <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                </TableCell>
                {type === "monthly" && (
                  <TableCell className="py-2">
                    {(skp as MonthlySKP).ckp_link ? (
                      <a
                        href={(skp as MonthlySKP).ckp_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        Lihat CKP <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    ) : (
                      <span className="text-gray-400">Tidak ada</span>
                    )}
                  </TableCell>
                )}
                <TableCell className="py-2 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(skp)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
