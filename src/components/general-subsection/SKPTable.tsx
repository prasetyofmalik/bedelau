import React from "react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface SKPTableProps {
  onEditClick: (data: any) => void;
  filter: "all" | "today" | "week" | "month";
}

const SKPTable: React.FC<SKPTableProps> = ({ onEditClick, filter }) => {
  // This is a placeholder. In a real implementation, you would fetch data from your backend
  const mockData = [
    {
      id: 1,
      nip: "198501232010121003",
      nama: "Prasetyo Fajar Malik",
      tahun: "2023",
      semester: "1",
      nilai: "90",
      status: "Sangat Baik",
      createdAt: new Date(),
    },
    {
      id: 2,
      nip: "199206172015032001",
      nama: "Anisa Rahmawati",
      tahun: "2023",
      semester: "1",
      nilai: "85",
      status: "Baik",
      createdAt: new Date(),
    },
  ];

  // Filter data based on selected filter
  const filteredData = mockData.filter((item) => {
    const itemDate = new Date(item.createdAt);
    const today = new Date();

    switch (filter) {
      case "today":
        return itemDate.toDateString() === today.toDateString();
      case "week":
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        return itemDate >= startOfWeek;
      case "month":
        return (
          itemDate.getMonth() === today.getMonth() &&
          itemDate.getFullYear() === today.getFullYear()
        );
      default:
        return true;
    }
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NIP</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Tahun</TableHead>
            <TableHead>Semester</TableHead>
            <TableHead>Nilai</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.nip}</TableCell>
                <TableCell>{item.nama}</TableCell>
                <TableCell>{item.tahun}</TableCell>
                <TableCell>{item.semester}</TableCell>
                <TableCell>{item.nilai}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditClick(item)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                Tidak ada data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SKPTable;
