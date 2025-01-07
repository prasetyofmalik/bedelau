import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface MailStats {
  incomingCount: number;
  outgoingCount: number;
  skCount: number;
  totalCount: number;
}

export const useMailStats = () => {
  return useQuery({
    queryKey: ["mailStats"],
    queryFn: async (): Promise<MailStats> => {
      // Fetch counts from each table
      const [incomingResult, outgoingResult, skResult] = await Promise.all([
        supabase.from("incoming_mails").select("*", { count: "exact", head: true }),
        supabase.from("outgoing_mails").select("*", { count: "exact", head: true }),
        supabase.from("sk_documents").select("*", { count: "exact", head: true })
      ]);

      if (incomingResult.error) throw incomingResult.error;
      if (outgoingResult.error) throw outgoingResult.error;
      if (skResult.error) throw skResult.error;

      const incomingCount = incomingResult.count || 0;
      const outgoingCount = outgoingResult.count || 0;
      const skCount = skResult.count || 0;

      return {
        incomingCount,
        outgoingCount,
        skCount,
        totalCount: incomingCount + outgoingCount + skCount
      };
    }
  });
};