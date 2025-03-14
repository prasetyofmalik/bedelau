export interface SKP {
    id: string;
    employee_id: string;
    employee_name: string;
    period: string;
    target: number;
    achievement: number;
    score: number;
    notes?: string;
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
  