import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { IncomingMail, OutgoingMail, SK } from "../types";

interface UseMailsOptions {
  table: "incoming_mails" | "outgoing_mails" | "sk_documents";
  searchQuery?: string;
  searchFields?: string[];
}

export function useMails<T extends IncomingMail | OutgoingMail | SK>({ 
  table, 
  searchQuery = "", 
  searchFields = [] 
}: UseMailsOptions) {
  return useQuery({
    queryKey: [table, searchQuery],
    queryFn: async () => {
      let query = supabase.from(table).select('*');

      // Only join with profiles for outgoing_mails and sk_documents
      if (table === "outgoing_mails" || table === "sk_documents") {
        query = supabase
          .from(table)
          .select(`
            *,
            profiles:employee_id (
              full_name
            )
          `);
      }

      if (searchQuery && searchFields.length > 0) {
        const searchConditions = searchFields.map(
          field => `${field}.ilike.%${searchQuery}%`
        );
        query = query.or(searchConditions.join(","));
      }

      const { data, error } = await query.order('date', { ascending: false });

      if (error) throw error;

      // Transform the data to include employee_name for outgoing_mails and sk_documents
      if (table === "outgoing_mails" || table === "sk_documents") {
        return data.map((item: any) => ({
          ...item,
          employee_name: item.profiles?.full_name,
        })) as T[];
      }

      return data as T[];
    },
  });
}

export const useIncomingMails = (searchQuery: string = "") => {
  return useMails<IncomingMail>({
    table: "incoming_mails",
    searchQuery,
    searchFields: ["number", "sender"],
  });
};

export const useOutgoingMails = (searchQuery: string = "") => {
  return useMails<OutgoingMail>({
    table: "outgoing_mails",
    searchQuery,
    searchFields: ["number", "origin", "description"],
  });
};