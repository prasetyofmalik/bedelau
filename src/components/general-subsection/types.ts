export type IncomingMail = {
  id: string;
  number: string;
  date: string;
  sender: string;
  classification: keyof typeof LETTER_TYPES;
  disposition: string;
  disposition_date: string;
  reply_date: string | null;
};

export type OutgoingMail = {
  id: string;
  number: string;
  date: string;
  origin: string;
  description: string;
  is_reply_letter: boolean;
  reference: string;
  destination: string;
  employee_id: string;
  employee_name?: string; // Added this field for the joined data
};

export const LETTER_TYPES = {
  REQUEST: { label: "Surat Permohonan", requiresReply: true },
  NOTIFICATION: { label: "Surat Pemberitahuan", requiresReply: false },
  INVITATION: { label: "Surat Undangan", requiresReply: true },
  REPORT: { label: "Surat Laporan", requiresReply: false },
  DECREE: { label: "Surat Keputusan", requiresReply: false },
} as const;

export const DISPOSITION_OPTIONS = [
  "Segera",
  "Penting",
  "Biasa",
  "Rahasia",
] as const;

export const TEAM_OPTIONS = [
  "UMUM",
  "SS (Statistik Sektoral)",
  "NASA",
  "ANSOS",
  "PJD",
  "NEODIST",
  "KAPE",
  "RB (REFORMASI BIROKRASI)",
  "HUMAS",
  "SAKIP",
] as const;
