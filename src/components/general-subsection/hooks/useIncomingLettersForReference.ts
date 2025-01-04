import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { IncomingMail } from "../types";

export const useIncomingLettersForReference = () => {
  return useQuery({
    queryKey: ["incoming-letters-for-reference"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("outgoing_mails")
        .select("number")
        .order("date", { ascending: false });

      if (error) throw error;
      return data as Pick<IncomingMail, "number">[];
    },
  });
};