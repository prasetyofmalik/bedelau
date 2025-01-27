import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";
import { SK } from "./types";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

interface SKTableProps {
  sks: SK[];
  onEdit: (sk: SK) => void;
  refetch: () => void;
}

type SortConfig = {
  key: keyof SK;
  direction: "asc" | "desc";
} | null;

export function SKTable({ sks, onEdit, refetch }: SKTableProps) {
  const { toast } = useToast();
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [hoveredColumn, setHoveredColumn] = useState<keyof SK | null>(null);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    try {
      return format(parseISO(dateString), "d MMMM yyyy", { locale: id });
    } catch {
      return dateString;
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("sk_documents").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menghapus SK",
      });
      return;
    }

    toast({
      title: "Berhasil",
      description: "SK berhasil dihapus",
    });
    refetch();
  };

  const handleSort = (key: keyof SK) => {
    setSortConfig((currentSort) => {
      if (currentSort?.key === key) {
        if (currentSort.direction === "asc") {
          return { key, direction: "desc" };
        }
        return null;
      }
      return { key, direction: "asc" };
    });
  };

  const renderSortIcon = (columnKey: keyof SK) => {
    if (sortConfig?.key === columnKey) {
      return sortConfig.direction === "asc" ? (
        <ArrowUp className="inline h-4 w-4 ml-1" />
      ) : (
        <ArrowDown className="inline h-4 w-4 ml-1" />
      );
    }
    return hoveredColumn === columnKey ? (
      <ArrowUp className="inline h-4 w-4 ml-1 opacity-50" />
    ) : null;
  };

  const sortedSKs = [...sks].sort((a, b) => {
    if (!sortConfig) return 0;

    const { key, direction } = sortConfig;
    const aValue = a[key];
    const bValue = b[key];

    if (aValue === null) return 1;
    if (bValue === null) return -1;

    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-blue-500">
          <TableHead
            onClick={() => handleSort("number")}
            onMouseEnter={() => setHoveredColumn("number")}
            onMouseLeave={() => setHoveredColumn(null)}
            className="cursor-pointer hover:bg-blue-600 text-white"
          >
            No. SK {renderSortIcon('number')}
          </TableHead>
          <TableHead
            onClick={() => handleSort("month_year")}
            onMouseEnter={() => setHoveredColumn("month_year")}
            onMouseLeave={() => setHoveredColumn(null)}
            className="cursor-pointer hover:bg-blue-600 text-white"
          >
            Bulan/Tahun {renderSortIcon('month_year')}
          </TableHead>
          <TableHead
            onClick={() => handleSort("date")}
            onMouseEnter={() => setHoveredColumn("date")}
            onMouseLeave={() => setHoveredColumn(null)}
            className="cursor-pointer hover:bg-blue-600 text-white"
          >
            Tanggal SK {renderSortIcon('date')}
          </TableHead>
          <TableHead
            onClick={() => handleSort("description")}
            onMouseEnter={() => setHoveredColumn("description")}
            onMouseLeave={() => setHoveredColumn(null)}
            className="cursor-pointer hover:bg-blue-600 text-white"
          >
            Uraian {renderSortIcon('description')}
          </TableHead>
          <TableHead
            onClick={() => handleSort("employee_name")}
            onMouseEnter={() => setHoveredColumn("employee_name")}
            onMouseLeave={() => setHoveredColumn(null)}
            className="cursor-pointer hover:bg-blue-600 text-white"
          >
            Pembuat {renderSortIcon('employee_name')}
          </TableHead>
          <TableHead className="text-white">Link</TableHead>
          <TableHead className="text-white">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedSKs.map((sk) => (
          <TableRow key={sk.id}>
            <TableCell>{sk.number}</TableCell>
            <TableCell>{sk.month_year}</TableCell>
            <TableCell>{formatDate(sk.date)}</TableCell>
            <TableCell>{sk.description}</TableCell>
            <TableCell>{sk.employee_name}</TableCell>
            <TableCell>
              <a href={sk.link} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(sk)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(sk.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}