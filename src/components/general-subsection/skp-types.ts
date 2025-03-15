export interface SKP {
  id: string;
  employee_id: string;
  employee_name: string;
  skp_type: 'monthly' | 'yearly';
  period: string;
  document_link: string;
  created_at?: string;
  updated_at?: string;
}

export interface SKPFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: SKP | null;
}

export interface SKPTableProps {
  skps: SKP[];
  onEdit: (data: SKP) => void;
  refetch: () => void;
}

// Define the type for fetching employee profiles
export interface EmployeeProfile {
  id: string;
  full_name: string;
  role: string;
}
