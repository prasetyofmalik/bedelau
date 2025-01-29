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
        .eq("role", "employee")
        .order("created_at");
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between">
        <h2 className="text-2xl font-semibold mb-4 md:mb-0">Daftar Pegawai</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Pegawai
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow max-h-[70vh] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Nama</TableHead>
              <TableHead className="text-center">No. HP</TableHead>
              <TableHead className="text-center">NIP BPS</TableHead>
              <TableHead className="text-center">NIP</TableHead>
              <TableHead className="text-center">Jabatan</TableHead>
              <TableHead className="text-center">Golongan</TableHead>
              <TableHead className="text-center">Kode Gol</TableHead>
              <TableHead className="text-center">Rekening</TableHead>
              <TableHead className="text-center">NPWP</TableHead>
              <TableHead className="text-center">NIK</TableHead>
              <TableHead className="text-center">Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees?.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="py-1">{employee.full_name}</TableCell>
                <TableCell className="py-1">{employee.no_hp}</TableCell>
                <TableCell className="py-1">{employee.nip_bps}</TableCell>
                <TableCell className="py-1">{employee.nip}</TableCell>
                <TableCell className="py-1">{employee.jabatan}</TableCell>
                <TableCell className="py-1">{employee.gol}</TableCell>
                <TableCell className="py-1">{employee.kode_gol}</TableCell>
                <TableCell className="py-1">{employee.rekening}</TableCell>
                <TableCell className="py-1">{employee.npwp}</TableCell>
                <TableCell className="py-1">{employee.nik}</TableCell>
                <TableCell className="py-1">{employee.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
