import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase";

export function UserEmployeeDirectory() {
  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'employee')
        .order("created_at");
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Daftar Pegawai</h2>
      <div className="bg-white rounded-lg shadow  max-h-[70vh] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Nama</TableHead>
              <TableHead className="text-center">NIP</TableHead>
              <TableHead className="text-center">Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees?.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="py-1">{employee.full_name}</TableCell>
                <TableCell className="py-1">{employee.nip}</TableCell>
                <TableCell className="py-1">{employee.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}