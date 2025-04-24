import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { startOfWeek, format } from "date-fns";

export const useWorkPlansWithRealizations = (
  teamId?: number,
  startDate?: Date
) => {
  return useQuery({
    queryKey: [
      "work-plans-with-realizations",
      teamId,
      startDate?.toISOString(),
    ],
    queryFn: async () => {
      let query = supabase.from("work_plans").select(`
        *,
        work_plan_items (*),
        work_plan_realizations (*)
      `);

      if (teamId) {
        query = query.eq("team_id", teamId);
      }

      if (startDate) {
        const weekStart = startOfWeek(startDate, { weekStartsOn: 1 });
        const formattedWeekStart = format(weekStart, "yyyy-MM-dd");
        query = query.eq("week_start", formattedWeekStart);
      }

      const { data, error } = await query.order("week_start", {
        ascending: false,
      });

      if (error) throw error;
      return data || [];
    },
  });
};
