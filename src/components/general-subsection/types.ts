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
  status: string;
  reference: string;
};

export const LETTER_TYPES = {
  REQUEST: { label: "Surat Permohonan", requiresReply: true },
  NOTIFICATION: { label: "Surat Pemberitahuan", requiresReply: false },
  INVITATION: { label: "Surat Undangan", requiresReply: true },
  REPORT: { label: "Surat Laporan", requiresReply: false },
  DECREE: { label: "Surat Keputusan", requiresReply: false },
} as const;