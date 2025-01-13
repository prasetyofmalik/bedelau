import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase";

export function EmployeeSection() {
  const { data: employees } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "employee");
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Daftar Pegawai</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Pegawai
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>No. HP</TableHead>
              <TableHead>NIP BPS</TableHead>
              <TableHead>NIP</TableHead>
              <TableHead>Jabatan</TableHead>
              <TableHead>Golongan</TableHead>
              <TableHead>Kode Gol</TableHead>
              <TableHead>Rekening</TableHead>
              <TableHead>NPWP</TableHead>
              <TableHead>NIK</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees?.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.full_name}</TableCell>
                <TableCell>{employee.no_hp}</TableCell>
                <TableCell>{employee.nip_bps}</TableCell>
                <TableCell>{employee.nip}</TableCell>
                <TableCell>{employee.jabatan}</TableCell>
                <TableCell>{employee.gol}</TableCell>
                <TableCell>{employee.kode_gol}</TableCell>
                <TableCell>{employee.rekening}</TableCell>
                <TableCell>{employee.npwp}</TableCell>
                <TableCell>{employee.nik}</TableCell>
                <TableCell>{employee.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
