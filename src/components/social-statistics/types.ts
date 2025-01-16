export interface SampleSsnM25Data {
  id: string;
  sample_code: string;
  kecamatan: string;
  desa_kelurahan: string;
  households_before: number;
  pml: string;
  pcl: string;
  created_at?: string;
}

export interface UpdateSsnM25Data {
  id?: number;
  sample_code: string;
  families_before: number;
  families_after: number;
  households_after: number;
  created_at?: string;
  status?: 'belum' | 'sudah';
}

export interface CacahSsnM25Data {
  id: string;
  sample_code: string;
  no_ruta: string;
  status?: 'belum' | 'sudah';
  r203_msbp: string;
  r203_kp: string;
  created_at?: string;
}

export interface UpdateSsnM25DataFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: UpdateSsnM25Data | null;
}

export interface CacahSsnM25DataFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: CacahSsnM25Data | null;
}

export interface UpdateSsnM25TableProps {
  updates: (UpdateSsnM25Data & SampleSsnM25Data)[];
  onEdit: (data: UpdateSsnM25Data) => void;
  refetch: () => void;
}

export interface CacahSsnM25TableProps {
  cacahs: (CacahSsnM25Data & SampleSsnM25Data)[];
  onEdit: (data: CacahSsnM25Data) => void;
  refetch: () => void;
}