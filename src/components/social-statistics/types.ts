export interface UpdateData {
  id?: number;
  sample_code: string;
  families_before: number;
  families_after: number;
  households_after: number;
  created_at?: string;
}

export interface UpdateDataFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: UpdateData;
}