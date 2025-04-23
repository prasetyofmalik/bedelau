import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { WorkPlan, WorkPlanItem } from "../types";
import { startOfWeek, endOfWeek, format, isSameWeek } from "date-fns";

export const useWorkPlans = (teamId?: number, startDate?: Date) => {
  const fetchWorkPlans = async () => {
    let query = supabase.from("work_plans").select(`
      *,
      work_plan_items (*)
    `);

    if (teamId) {
      query = query.eq("team_id", teamId);
    }

    if (startDate) {
      const weekStart = startOfWeek(startDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(startDate, { weekStartsOn: 1 });

      const formattedWeekStart = format(weekStart, "yyyy-MM-dd");
      const formattedWeekEnd = format(weekEnd, "yyyy-MM-dd");

      query = query
        .gte("week_start", formattedWeekStart)
        .lte("week_start", formattedWeekEnd);
    }

    const { data, error } = await query.order("week_start", {
      ascending: false,
    });

    if (error) throw error;
    return data || [];
  };

  return useQuery({
    queryKey: ["work-plans", teamId, startDate?.toISOString()],
    queryFn: fetchWorkPlans,
  });
};
