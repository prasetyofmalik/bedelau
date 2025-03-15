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

  const generateFolderLink = (
    type: "yearly" | "monthly",
    period: string
  ): string => {
    const baseLink = "https://drive.google.com/drive/folders/";

    if (type === "yearly") {
      const periodLinks: Record<string, string> = {
        penetapan: "1-mho2qgn1d0O7TEDzhO_6nk1r0BdaqZa",
        penilaian: "1Nn4yhH7dzZfuSRZC3RI2BYKC_nngL7B9",
        evaluasi: "1S5r73B6X5AaQGvmJkdQlS6IeR7DDZKcD",
      };
      return `${baseLink}${periodLinks[period] || period}`;
    } else {
      const monthLinks: Record<string, string> = {
        "01": "17MDMvWEqjNSuKfFf7Slp77bWfi_k4OX7",
        "02": "1lfL_22cRzXzVBkSZ86RaBwGxUr3EAQqx",
        "03": "1e1nuUtHqtnKgxUiS7w96QUs6hRfRsULf",
        "04": "1W2gjwrw2bWvgwUS1FRzZuLB8_ppwTmlB",
        "05": "1NonwxNHBu8Vt_xA8e8fsmLKV8P20MkmG",
        "06": "1bIKyj7sBbRRg1FXf8WCtIGltAyJc7LMI",
        "07": "1hd08kxogHcJqoheUtW-bBsIRIaA3tTgu",
        "08": "1Ry-NvemBAgRvgbWafdZyp4JH6c_k4aYV",
        "09": "1w2TQlvfHyRmb3bwiwC6FRvkgpvpQi9w0",
        "10": "1iwJ_q-laTbLAvbz_tf_f6Eb0B0op86i8",
        "11": "1L7e87ohaaQb6rnj_YMO8m0EBbGHanoCY",
        "12": "1VCmhndPixoKj56K9Atv_ZtrOYgbyeFO5",
      };
      return `${baseLink}${monthLinks[period] || period}`;
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
            <TableHead className="py-2">Folder</TableHead>
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
                    Lihat Dokumen <ExternalLink className="ml-1 h-4 w-4" />
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
                <TableCell className="py-2">
                  <a
                    href={generateFolderLink(type, skp.period)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <Folder className="mr-1 h-4 w-4" />
                    Buka
                  </a>
                </TableCell>
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
