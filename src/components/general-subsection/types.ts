export interface IncomingMail {
  id: string;
  number: string;
  date: string;
  sender: string;
  classification: string;
  disposition: string;
  disposition_date: string;
  reply_date?: string;
}

export interface OutgoingMail {
  id: string;
  number: string;
  date: string;
  origin: string;
  destination: string;
  description: string;
  is_reply_letter: boolean;
  reference: string;
  employee_id: string;
  employee_name?: string;
}

export interface SK {
  id: string;
  number: string;
  month_year: string;
  date: string;
  description: string;
  employee_id: string;
  employee_name?: string;
  link: string;
}

export type MailFormType = "incoming" | "outgoing" | "sk";

interface LetterType {
  label: string;
  requiresReply: boolean;
}

export const LETTER_TYPES: Record<string, LetterType> = {
  UNDANGAN: { label: "Undangan", requiresReply: true },
  PEMBERITAHUAN: { label: "Pemberitahuan", requiresReply: false },
  PERMOHONAN: { label: "Permohonan", requiresReply: true },
  LAPORAN: { label: "Laporan", requiresReply: false },
  PENGANTAR: { label: "Pengantar", requiresReply: false },
};

export const DISPOSITION_OPTIONS = [
  "Tindak Lanjuti",
  "Koordinasikan",
  "Pantau Progressnya",
  "Pelajari",
  "Wakili",
  "Hadiri",
  "Siapkan",
  "Selesaikan",
  "Jawab/Balas",
  "Arsipkan",
];

export const TEAM_OPTIONS = [
  "Team A",
  "Team B",
  "Team C",
  "Team D",
];