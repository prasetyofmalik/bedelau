import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { IncomingMail } from "../types";

export const useIncomingLettersForReference = () => {
  return useQuery({
    queryKey: ["incoming-letters-for-reference"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("incoming_mails")
        .select("id, number")
        .order("date", { ascending: false });

      if (error) throw error;
      return data as Pick<IncomingMail, "id" | "number">[];
    },
  });
};