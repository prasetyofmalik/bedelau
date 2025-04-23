import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useEmployeeStats() {
  return useQuery({
    queryKey: ["employeeStats"],
    queryFn: async () => {
      const { data: employees } = await supabase
        .from("profiles")
        .select("*")
        .in('role', ['head_office', 'employee'])
      const totalEmployees = employees?.length || 0;
      const maleEmployees =
        employees?.filter((emp) => emp.gender === "l").length || 0;
      const femaleEmployees =
        employees?.filter((emp) => emp.gender === "p").length || 0;
      return {
        total: totalEmployees,
        male: maleEmployees,
        female: femaleEmployees,
      };
    },
  });
}

export function useAnnouncements(limit?: number) {
  return useQuery({
    queryKey: ["announcements", limit],
    queryFn: async () => {
      let query = supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });
      if (limit) {
        query = query.limit(limit);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useAnnouncementsStats() {
  return useQuery({
    queryKey: ["announcementsStats"],
    queryFn: async () => {
      const { data: announcements } = await supabase
        .from("announcements")
        .select("status, created_at");
      const total = announcements?.length || 0;
      const thisWeek =
        announcements?.filter((a) => {
          const date = new Date(a.created_at);
          const now = new Date();
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          return date >= weekAgo;
        }).length || 0;
      const thisMonth =
        announcements?.filter((a) => {
          const date = new Date(a.created_at);
          const now = new Date();
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
          return date >= monthAgo;
        }).length || 0;
      const unread =
        announcements?.filter(
          (a) => a.status === "critical" || a.status === "high"
        ).length || 0;
      return {
        total,
        thisWeek,
        thisMonth,
        unread,
      };
    },
  });
}
