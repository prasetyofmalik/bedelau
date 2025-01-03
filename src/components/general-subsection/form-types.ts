import { IncomingMail, OutgoingMail, LETTER_TYPES } from "./types";

export type MailFormType = "incoming" | "outgoing";

export interface AddMailFormProps {
  type: MailFormType;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export interface IncomingMailFormData {
  number: string;
  date: string;
  sender: string;
  classification: string;
  disposition: string;
  disposition_date: string;
}

export interface OutgoingMailFormData {
  number: string;
  date: string;
  origin: string;
  description: string;
  status: string;
  reference: string;
}