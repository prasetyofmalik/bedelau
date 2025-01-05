import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { IncomingMail, LETTER_TYPES } from "../types";

export const useIncomingLettersForReference = () => {
  return useQuery({
    queryKey: ["incoming-letters-for-reference"],
    queryFn: async () => {
      // Get letter types that require replies
      const letterTypesRequiringReply = Object.entries(LETTER_TYPES)
        .filter(([_, value]) => value.requiresReply)
        .map(([key]) => key);

      const { data, error } = await supabase
        .from("incoming_mails")
        .select("number,sender")
        .in("classification", letterTypesRequiringReply)
        .order("date", { ascending: false });

      if (error) throw error;
      return data as Pick<IncomingMail, "number" | "sender">[];
    },
  });
};