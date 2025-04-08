export type MailFormType = "incoming" | "outgoing" | "sk";

export interface IncomingMail {
  id: number;
  number: string;
  date: string;
  sender: string;
  classification: string;
  disposition: string;
  disposition_date: string | null;
  recipient: string;
  reply_date: string | null;
}

export interface OutgoingMail {
  id: number;
  number: string;
  date: string;
  origin: string;
  destination: string;
  description: string;
  is_reply_letter: boolean;
  reference: string | null;
  link: string;
  employee_id: string;
  employee_name?: string;
  classification: string;
  delivery_method: string;
}

export interface SK {
  id: number;
  number: string;
  date: string;
  month_year: string;
  description: string;
  link: string;
  employee_id: string;
  employee_name?: string;
}

// Constants for selects
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