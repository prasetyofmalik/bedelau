import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { IncomingMail, OutgoingMail } from "../types";

export const useIncomingMails = (searchQuery: string = "") => {
  return useQuery({
    queryKey: ["incoming-mails", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("incoming_mails")
        .select("*")
        .order("date", { ascending: false });

      if (searchQuery) {
        query = query.or(
          `number.ilike.%${searchQuery}%,sender.ilike.%${searchQuery}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as IncomingMail[];
    },
  });
};

export const useOutgoingMails = (searchQuery: string = "") => {
  return useQuery({
    queryKey: ["outgoing-mails", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("outgoing_mails")
        .select("id,number,date,origin,description,reference,is_reply_letter")
        .order("date", { ascending: false });

      if (searchQuery) {
        query = query.or(
          `number.ilike.%${searchQuery}%,origin.ilike.%${searchQuery}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as OutgoingMail[];
    },
  });
};