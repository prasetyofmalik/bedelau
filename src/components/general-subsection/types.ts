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
  created_at: string;
  disposition: string;
  disposition_date: string | null;
  recipient: string;
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
  'official': { label: 'Surat Dinas (Permintaan Data, Usulan)', requiresReply: true },
  'sim': { label: 'Surat Izin Magang (SIM)', requiresReply: true },
  'sk': { label: 'Surat Keputusan (SK)', requiresReply: false },
  'se': { label: 'Surat Edaran (SE)', requiresReply: false },
  'invitation': { label: 'Surat Undangan', requiresReply: false },
  'other': { label: 'Lainnya', requiresReply: false },
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
  'srikandi': 'Via SRIKANDI',
  'manual': 'Manual'
} as const;

export const DISPOSITION_OPTIONS = [
  'Tindak Lanjuti',
  'Arsipkan',
  'Lainnya'
] as const;

export const TEAM_OPTIONS = [
  'Umum',
  'SS (Statistik Sektoral)',
  'NASA',
  'ANSOS',
  'PJD',
  'NEODIST',
  'KAPE',
  'RB (Reformasi Birokrasi)',
  'Humas',
  'SAKIP',
] as const;