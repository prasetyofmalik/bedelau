import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { YearlySKP, MonthlySKP } from "../skp-types";

export function useSKPDocuments(type: "yearly" | "monthly", period?: string) {
  return useQuery({
    queryKey: ["skp_documents", type, period],
    queryFn: async () => {
      const tableName = type === "yearly" ? "skp_yearly" : "skp_monthly";

      let query = supabase.from(tableName).select("*");

      if (period) {
        query = query.eq("period", period);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;

      return data as (YearlySKP | MonthlySKP)[];
    },
  });
}
