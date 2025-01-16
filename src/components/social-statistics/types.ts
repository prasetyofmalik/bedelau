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
  status?: 'not_started' | 'completed';
}

export interface UpdateSsnM25DataFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: UpdateSsnM25Data | null;
}

export interface UpdateSsnM25TableProps {
  updates: (UpdateSsnM25Data & SampleSsnM25Data)[];
  onEdit: (data: UpdateSsnM25Data) => void;
  refetch: () => void;
}