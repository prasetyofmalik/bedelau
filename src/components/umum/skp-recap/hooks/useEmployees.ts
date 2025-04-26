import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { EmployeeProfile } from "../types";

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, role")
        .eq("role", "employee")
        .order("full_name", { ascending: true });

      if (error) throw error;

      return data as EmployeeProfile[];
    },
  });
}
