export interface BaseSKP {
  id: string;
  employee_id: string;
  employee_name: string;
  period: string;
  created_at?: string;
  updated_at?: string;
}

export interface YearlySKP extends BaseSKP {
  skp_link: string;
}

export interface MonthlySKP extends BaseSKP {
  skp_link: string;
  ckp_link?: string;
}

export interface SKPFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: YearlySKP | MonthlySKP | null;
  type: "yearly" | "monthly";
}

export interface SKPTableProps {
  skps: (YearlySKP | MonthlySKP)[];
  onEdit: (data: YearlySKP | MonthlySKP) => void;
  refetch: () => void;
  type: "yearly" | "monthly";
}

// Define the type for fetching employee profiles
export interface EmployeeProfile {
  id: string;
  full_name: string;
  role: string;
}
