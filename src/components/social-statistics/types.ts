export interface SampleData {
  id: string;
  sample_code: string;
  kecamatan: string;
  desa_kelurahan: string;
  households_before: number;
  pml: string;
  pcl: string;
  created_at?: string;
}

export interface UpdateData {
  id?: number;
  sample_code: string;
  families_before: number;
  families_after: number;
  households_after: number;
  created_at?: string;
  status?: 'not_started' | 'in_progress' | 'completed';
}

export interface UpdateDataFormProps {
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