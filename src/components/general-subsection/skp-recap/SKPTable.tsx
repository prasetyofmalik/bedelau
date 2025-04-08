import { Button } from "@/components/ui/button";
import { ExternalLink, Pencil } from "lucide-react";
import { SKPTableProps, MonthlySKP } from "./types";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export function SKPTable({ skps, onEdit, type }: SKPTableProps) {
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
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: '60vh' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa', py: 2 }}>Nama Pegawai</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa', py: 2 }}>Periode</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa', py: 2 }}>Tanggal Upload</TableCell>
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa', py: 2 }}>SKP</TableCell>
              {type === "monthly" && <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa', py: 2 }}>CKP</TableCell>}
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa', py: 2, textAlign: 'right' }}>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {skps.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={type === "monthly" ? 6 : 5}
                  sx={{ height: 96, textAlign: 'center', color: 'text.secondary' }}
                >
                  Tidak ada data dokumen SKP.
                </TableCell>
              </TableRow>
            ) : (
              skps.map((skp) => (
                <TableRow key={skp.id} hover>
                  <TableCell sx={{ py: 2 }}>{skp.employee_name}</TableCell>
                  <TableCell sx={{ py: 2 }}>{getPeriodLabel(type, skp.period)}</TableCell>
                  <TableCell sx={{ py: 2 }}>{formatDate(skp.created_at)}</TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <a
                      href={(skp as any).skp_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#3b82f6', display: 'flex', alignItems: 'center' }}
                    >
                      Lihat SKP <ExternalLink style={{ marginLeft: 4, width: 16, height: 16 }} />
                    </a>
                  </TableCell>
                  {type === "monthly" && (
                    <TableCell sx={{ py: 2 }}>
                      {(skp as MonthlySKP).ckp_link ? (
                        <a
                          href={(skp as MonthlySKP).ckp_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#3b82f6', display: 'flex', alignItems: 'center' }}
                        >
                          Lihat CKP <ExternalLink style={{ marginLeft: 4, width: 16, height: 16 }} />
                        </a>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>Tidak ada</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell sx={{ py: 2, textAlign: 'right' }}>
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
      </TableContainer>
    </Paper>
  );
}
