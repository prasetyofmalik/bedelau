import { IncomingMail, OutgoingMail, SK } from "./types";

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
}
