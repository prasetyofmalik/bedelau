import {
  Notebook,
  Coffee,
  Tablet,
  IdCard,
  Calculator,
  Laptop,
  Mails,
  ChevronsUp,
  ClipboardList,
  BarChart,
  BarChart2,
  BarChart3,
  FileSpreadsheet,
  HousePlus,
  Camera,
  Workflow,
  FileCheck,
  MonitorCheck,
  CalendarCheck,
} from "lucide-react";
import { TeamEvaluationCategory } from "@/components/umum/team-evaluation/types";

export const teams = [
  {
    id: 1,
    name: "UMUM",
    icon: Notebook,
    color: "text-blue-600",
    text: "Subbagian Umum",
    items: [
      {
        title: "Rencana Kerja",
        url: "/monitoring/umum/work-plan",
        icon: CalendarCheck,
      },
      {
        title: "Rekap Surat",
        url: "/monitoring/umum/mails-recap",
        icon: Mails,
      },
      {
        title: "Rekap SKP",
        url: "/monitoring/umum/skp-recap",
        icon: ChevronsUp,
      },
      // {
      //   title: "Evaluasi Tim Kerja",
      //   url: "/monitoring/umum/team-evaluation",
      //   icon: FileSpreadsheet,
      // },
    ],
    categories: [] as TeamEvaluationCategory[],
  },
  {
    id: 2,
    name: "ANSOS",
    icon: Coffee,
    color: "text-red-500",
    text: "Fungsi Statistik Sosial",
    items: [
      {
        title: "Rencana Kerja",
        url: "/monitoring/ansos/work-plan",
        icon: CalendarCheck,
      },
      // {
      //   title: "Susenas Maret 2025",
      //   url: "/monitoring/ansos/ssn-m25",
      //   icon: ClipboardList,
      // },
      // {
      //   title: "Sakernas Februari 2025",
      //   url: "/monitoring/ansos/sak-f25",
      //   icon: BarChart3,
      // },
      {
        title: "PODES 2025",
        url: "/monitoring/ansos/podes25",
        icon: BarChart2,
      },
      {
        title: "Seruti Triwulan II 2025",
        url: "/monitoring/ansos/seruti25",
        icon: HousePlus,
      },
    ],
    categories: [] as TeamEvaluationCategory[],
  },
  {
    id: 3,
    name: "KAPE",
    icon: Tablet,
    color: "text-amber-600",
    text: "Fungsi Statistik Produksi",
    items: [
      {
        title: "Rencana Kerja",
        url: "/monitoring/kape/work-plan",
        icon: CalendarCheck,
      },
    ],
    categories: [] as TeamEvaluationCategory[],
  },
  {
    id: 4,
    name: "NEODIST",
    icon: IdCard,
    color: "text-lime-600",
    text: "Fungsi Statistik Distribusi",
    items: [
      {
        title: "Rencana Kerja",
        url: "/monitoring/neodist/work-plan",
        icon: CalendarCheck,
      },
    ],
    categories: [] as TeamEvaluationCategory[],
  },
  {
    id: 5,
    name: "NASA",
    icon: Calculator,
    color: "text-emerald-600",
    text: "Fungsi Neraca dan Analisis Statistik",
    items: [
      {
        title: "Rencana Kerja",
        url: "/monitoring/nasa/work-plan",
        icon: CalendarCheck,
      },
    ],
    categories: [] as TeamEvaluationCategory[],
  },
  {
    id: 6,
    name: "PJD",
    icon: Laptop,
    color: "text-yellow-600",
    text: "Fungsi Pengolahan, Jaringan, dan Diseminasi",
    items: [
      {
        title: "Rencana Kerja",
        url: "/monitoring/pjd/work-plan",
        icon: CalendarCheck,
      },
    ],
    categories: [] as TeamEvaluationCategory[],
  },
  {
    id: 7,
    name: "SS",
    icon: BarChart,
    color: "text-red-500",
    text: "Statistik Sektoral",
    items: [
      {
        title: "Rencana Kerja",
        url: "/monitoring/ss/work-plan",
        icon: CalendarCheck,
      },
    ],
    categories: [] as TeamEvaluationCategory[],
  },
  {
    id: 8,
    name: "SAKIP",
    icon: FileCheck,
    color: "text-amber-600",
    text: "Sistem Akuntabilitas Kinerja Instansi Pemerintahan",
    items: [
      {
        title: "Rencana Kerja",
        url: "/monitoring/sakip/work-plan",
        icon: CalendarCheck,
      },
    ],
    categories: [] as TeamEvaluationCategory[],
  },
  {
    id: 9,
    name: "PEKPPP",
    icon: MonitorCheck,
    color: "text-lime-600",
    text: "Pemantauan dan Evaluasi Penyelenggaran Pelayanan Publik",
    items: [
      {
        title: "Rencana Kerja",
        url: "/monitoring/pekppp/work-plan",
        icon: CalendarCheck,
      },
    ],
    categories: [] as TeamEvaluationCategory[],
  },
  {
    id: 10,
    name: "RB",
    icon: Workflow,
    color: "text-emerald-600",
    text: "Reformasi Birokrasi",
    items: [
      {
        title: "Rencana Kerja",
        url: "/monitoring/rb/work-plan",
        icon: CalendarCheck,
      },
    ],
    categories: [] as TeamEvaluationCategory[],
  },
  {
    id: 11,
    name: "HUMAS",
    icon: Camera,
    color: "text-yellow-600",
    text: "Hubungan Masyarakat",
    items: [
      {
        title: "Rencana Kerja",
        url: "/monitoring/humas/work-plan",
        icon: CalendarCheck,
      },
    ],
    categories: [] as TeamEvaluationCategory[],
  },
];
