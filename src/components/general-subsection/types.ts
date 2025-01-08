export interface OutgoingMail {
  id: string;
  number: string;
  date: string | null;
  origin: string;
  destination: string;
  description: string;
  is_reply_letter: boolean;
  reference: string;
  employee_id?: string;
  employee_name?: string;
  classification: string;
  delivery_method: string;
  link?: string;
}

export interface IncomingMail {
  id: string;
  number: string;
  date: string | null;
  sender: string;
  classification: string;
  disposition: string;
  disposition_date: string | null;
  reply_date?: string | null;
}

export interface SK {
  id: string;
  number: string;
  date: string | null;
  month_year: string;
  description: string;
  link?: string;
  employee_id?: string;
  employee_name?: string;
}

export type MailFormType = "incoming" | "outgoing" | "sk";

export const LETTER_TYPES = {
  'invitation': { label: 'Surat Undangan', requiresReply: true },
  'assignment': { label: 'Surat Tugas', requiresReply: false },
  'official': { label: 'Surat Dinas (Permintaan Data, Usulan)', requiresReply: true },
  'statement': { label: 'Surat Pernyataan', requiresReply: false },
  'reference': { label: 'Surat Keterangan', requiresReply: false },
  'cover': { label: 'Surat Pengantar', requiresReply: false },
  'other': { label: 'Lainnya', requiresReply: false }
} as const;

export const LETTER_CLASSIFICATIONS = {
  'invitation': 'Surat Undangan',
  'assignment': 'Surat Tugas',
  'official': 'Surat Dinas (Permintaan Data, Usulan)',
  'statement': 'Surat Pernyataan',
  'reference': 'Surat Keterangan',
  'cover': 'Surat Pengantar',
  'other': 'Lainnya'
} as const;

export const DELIVERY_METHODS = {
  'srikandi': 'via Srikandi application',
  'manual': 'manual'
} as const;

export const DISPOSITION_OPTIONS = [
  'Tindak Lanjuti',
  'Koordinasikan',
  'Pantau Progresnya',
  'Buatkan Laporan',
  'Untuk Diketahui',
  'Untuk Ditindaklanjuti',
  'Hadir',
  'Wakili',
  'Siapkan',
  'Lainnya'
] as const;

export const TEAM_OPTIONS = [
  'Tim Analis Data',
  'Tim Pengembangan Sistem',
  'Tim Pengelola Infrastruktur',
  'Tim Pengelola Layanan',
  'Tim Tata Kelola TI'
] as const;