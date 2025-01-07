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

      if (searchQuery && searchFields.length > 0) {
        const searchConditions = searchFields.map(
          field => `${field}.ilike.%${searchQuery}%`
        );
        query = query.or(searchConditions.join(","));
      }

      const { data, error } = await query.order('date', { ascending: false });

      if (error) throw error;

      // For outgoing_mails and sk_documents, fetch employee names separately
      if (table === "outgoing_mails" || table === "sk_documents") {
        const employeeIds = data.map((item: any) => item.employee_id).filter(Boolean);
        
        if (employeeIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', employeeIds);

          // Create a map of employee_id to full_name
          const employeeMap = new Map(
            profiles?.map(profile => [profile.id, profile.full_name]) || []
          );

          // Add employee_name to each item
          return data.map((item: any) => ({
            ...item,
            employee_name: employeeMap.get(item.employee_id) || null,
          })) as T[];
        }
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