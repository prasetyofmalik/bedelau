import { Notebook, Coffee, Tablet, IdCard, Calculator, Laptop, Mails, ChevronsUp, ClipboardList, BarChart3, FileSpreadsheet, BarChart, Camera, Workflow, FileCheck, MonitorCheck } from "lucide-react";
import { TeamEvaluationCategory } from "@/components/general-subsection/team-evaluation/types";

export const teams = [
  {
    id: 1,
    name: "UMUM",
    icon: Notebook,
    color: "text-blue-600",
    text: "Subbagian Umum",
    items: [] as Array<{ title: string; url: string; icon: any }>,
    categories: ["achievement", "challenge", "improvement", "administration", "finance"] as TeamEvaluationCategory[],
  },
  {
    id: 2,
    name: "ANSOS",
    icon: Coffee,
    color: "text-red-500",
    text: "Fungsi Statistik Sosial",
    items: [] as Array<{ title: string; url: string; icon: any }>,
    categories: ["achievement", "challenge", "improvement", "survey", "data-analysis"] as TeamEvaluationCategory[],
  },
  {
    id: 3,
    name: "KAPE",
    icon: Tablet,
    color: "text-amber-600",
    text: "Fungsi Statistik Produksi",
    categories: ["achievement", "challenge", "improvement", "production", "agriculture"] as TeamEvaluationCategory[],
  },
  {
    id: 4,
    name: "NEODIST",
    icon: IdCard,
    color: "text-lime-600",
    text: "Fungsi Statistik Distribusi",
    categories: ["achievement", "challenge", "improvement", "distribution", "retail"] as TeamEvaluationCategory[],
  },
  {
    id: 5,
    name: "NASA",
    icon: Calculator,
    color: "text-emerald-600",
    text: "Fungsi Neraca dan Analisis Statistik",
    categories: ["achievement", "challenge", "improvement", "analysis", "reporting"] as TeamEvaluationCategory[],
  },
  {
    id: 6,
    name: "PJD",
    icon: Laptop,
    color: "text-yellow-600",
    text: "Fungsi Pengolahan, Jaringan, dan Diseminasi",
    categories: ["achievement", "challenge", "improvement", "processing", "network"] as TeamEvaluationCategory[],
  },
  {
    id: 7,
    name: "SS",
    icon: BarChart,
    color: "text-red-500",
    text: "Statistik Sektoral",
    categories: ["achievement", "challenge", "improvement", "sectoral", "coordination"] as TeamEvaluationCategory[],
  },
  {
    id: 8,
    name: "SAKIP",
    icon: FileCheck,
    color: "text-amber-600",
    text: "Sistem Akuntabilitas Kinerja Instansi Pemerintahan",
    categories: ["achievement", "challenge", "improvement", "accountability", "reporting"] as TeamEvaluationCategory[],
  },
  {
    id: 9,
    name: "PEKPPP",
    icon: MonitorCheck,
    color: "text-lime-600",
    text: "Pemantauan dan Evaluasi Penyelenggaran Pelayanan Publik",
    categories: ["achievement", "challenge", "improvement", "monitoring", "evaluation"] as TeamEvaluationCategory[],
  },
  {
    id: 10,
    name: "RB",
    icon: Workflow,
    color: "text-emerald-600",
    text: "Reformasi Birokrasi",
    categories: ["achievement", "challenge", "improvement", "reform", "bureaucracy"] as TeamEvaluationCategory[],
  },
  {
    id: 11,
    name: "HUMAS",
    icon: Camera,
    color: "text-yellow-600",
    text: "Hubungan Masyarakat",
    categories: ["achievement", "challenge", "improvement", "publication", "outreach"] as TeamEvaluationCategory[],
  },
];

const generalSubsectionItems = [
  {
    title: "Rekap Surat",
    url: "/monitoring/general-subsection/mails-recap",
    icon: Mails,
  },
  {
    title: "Rekap SKP",
    url: "/monitoring/general-subsection/skp-recap",
    icon: ChevronsUp,
  },
  {
    title: "Evaluasi Tim Kerja",
    url: "/monitoring/general-subsection/team-evaluation",
    icon: FileSpreadsheet,
  },
];

const socialStatisticsItems = [
  {
    title: "Susenas Maret 2025",
    url: "/monitoring/social-statistics/ssn-m25",
    icon: ClipboardList,
  },
  {
    title: "Sakernas Februari 2025",
    url: "/monitoring/social-statistics/sak-f25",
    icon: BarChart3,
  },
];

teams[0].items = generalSubsectionItems;
teams[1].items = socialStatisticsItems;
