import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { IncomingMail, LETTER_TYPES } from "../types";

export const useIncomingLettersForReference = () => {
  return useQuery({
    queryKey: ["incoming-letters-for-reference"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("incoming_mails")
        .select("*")
        .is("reply_date", null)
        .order("date", { ascending: false });

      if (error) throw error;

      // Filter for letters that require replies
      return (data as IncomingMail[]).filter(
        (mail) => LETTER_TYPES[mail.classification].requiresReply
      );
    },
  });
};