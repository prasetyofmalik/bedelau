export interface IncomingMail {
  id: string;
  number: string;
  date: string;
  sender: string;
  classification: string;
  disposition: string;
  disposition_date: string;
}

export interface OutgoingMail {
  id: string;
  number: string;
  date: string;
  origin: string;
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

export const TEAM_OPTIONS = [
  "Team A",
  "Team B",
  "Team C",
  "Team D",
];
