import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { SKP } from "../skp-types";

export function useSKPDocuments(type: string, period?: string) {
  return useQuery({
    queryKey: ["skp_documents", type, period],
    queryFn: async () => {
      let query = supabase
        .from("skp_documents")
        .select("*")
        .eq("skp_type", type);

      if (period) {
        query = query.eq("period", period);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;

      return data as SKP[];
    },
  });
}
