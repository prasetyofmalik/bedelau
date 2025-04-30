import { QAFCard } from "./QAFCard";
import {
  FileSearch,
  FileCheck,
  ClipboardList,
  CheckCircle2,
  FileText,
  Download,
} from "lucide-react";

// Define the array of QAF resources
const qafResources = [
  {
    id: 1,
    title: "Daftar SOP",
    icon: FileSearch,
    color: "text-blue-600",
    bgColor: "#D3E4FD",
    description: "Daftar SOP BPS Kabupaten Siak",
    url: "https://www.bps.go.id/docs",
  },
  {
    id: 2,
    title: "Input Kertas Kerja",
    icon: FileCheck,
    color: "text-yellow-600",
    bgColor: "#FEF7CD",
    description: "Input Kertas Kerja SOP",
    url: "https://www.bps.go.id/evaluation",
  },
  {
    id: 3,
    title: "Input Monev",
    icon: ClipboardList,
    color: "text-orange-600",
    bgColor: "#FEEBCB",
    description: "Input Form Monitoring dan Evaluasi Penerapan SOP",
    url: "https://www.bps.go.id/evaluation",
  },
  {
    id: 4,
    title: "Input Tindak Lanjut",
    icon: CheckCircle2,
    color: "text-green-600",
    bgColor: "#DEF7EC",
    description: "Input Form Tindak Lanjut",
    url: "https://www.bps.go.id/evaluation",
  },
  {
    id: 5,
    title: "Input Laporan Kegiatan",
    icon: FileText,
    color: "text-amber-700",
    bgColor: "#FEF3C7",
    description: "Input Laporan Kegiatan dan Penerapan SOP",
    url: "https://www.bps.go.id/technical",
  },
  {
    id: 6,
    title: "Unduhan",
    icon: Download,
    color: "text-red-600",
    bgColor: "#FEE2E2",
    description: "Unduhan Template",
    url: "https://www.bps.go.id/config",
  },
];

export function QAFList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {qafResources.map((resource) => (
        <QAFCard
          key={resource.id}
          title={resource.title}
          icon={resource.icon}
          color={resource.color}
          description={resource.description}
          url={resource.url}
        />
      ))}
    </div>
  );
}
