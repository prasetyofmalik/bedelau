export interface SampleData {
  id: string;
  sample_code: string;
  kecamatan: string;
  desa_kelurahan: string;
  households_before: number;
  pml: string;
  ppl: string;
  created_at?: string;
}

export interface UpdateData {
  id?: number;
  sample_code: string;
  families_before: number;
  families_after: number;
  households_after: number;
  created_at?: string;
  status?: 'belum' | 'sudah';
}

export interface CacahSsnM25Data {
  id?: string;
  sample_code: string;
  no_ruta: string;
  status?: 'belum' | 'sudah';
  r203_msbp: string;
  r203_kp: string;
  created_at?: string;
}

export interface PeriksaSsnM25Data {
  id: string;
  sample_code: string;
  no_ruta: string;
  status?: 'belum' | 'sudah';
  iv3_2_16: string;
  iv3_3_8: string;
  r304_kp: string;
  r305_kp: string;
  created_at?: string;
}

export interface FenomenaSsnM25Data {
  id: string;
  created_at?: string;
  sample_code: string;
  households_after: number;
  bansos: string;
  change_expense: string;
  internet_signal: string;
  economy_access: string;
  edu_access: string;
  health_access: string;
}

export interface UpdateDataFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: UpdateData | null;
}

export interface CacahSsnM25DataFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: CacahSsnM25Data | null;
}

export interface PeriksaSsnM25DataFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: PeriksaSsnM25Data | null;
}

export interface FenomenaSsnM25DataFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: UpdateData | null;
}

export interface UpdateTableProps {
  updates: (UpdateData & SampleData)[];
  onEdit: (data: UpdateData) => void;
  refetch: () => void;
}

export interface CacahSsnM25TableProps {
  cacahs: {
    sample_code: string;
    pml: string;
    ppl: string;
    cacah_data: CacahSsnM25Data[];
  }[];
  onSuccess: () => void;
  onEdit: (data: CacahSsnM25Data) => void;
}

export interface PeriksaSsnM25TableProps {
  periksas: {
    sample_code: string;
    pml: string;
    ppl: string;
    periksa_data: PeriksaSsnM25Data[];
  }[];
  onSuccess: () => void;
  onEdit: (data: PeriksaSsnM25Data) => void;
}

export interface FenomenaSsnM25TableProps {
  fenomenas: (FenomenaSsnM25Data & SampleData)[];
  onEdit: (data: FenomenaSsnM25Data) => void;
  refetch: () => void;
}

export type SurveyType = "ssn_m25" | "sak_f25";

export interface MutakhirSectionProps {
  surveyType: SurveyType;
}

export interface MutakhirTableProps {
  updates: (UpdateData & SampleData)[];
  onEdit: (data: UpdateData) => void;
  refetch: () => void;
  surveyType: SurveyType;
}

export interface MutakhirFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: UpdateData | null;
  surveyType: SurveyType;
}

export interface PemutakhiranChartProps {
  data: any[];
  surveyType: SurveyType;
}

export interface PplMonitoringTableProps {
  type: "pemutakhiran" | "pencacahan";
  surveyType: SurveyType;
}