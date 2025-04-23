import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { WorkPlan, WorkPlanItem } from "../types";
import { startOfWeek, endOfWeek, format, isSameWeek } from "date-fns";

interface CreateWorkPlanInput {
  teamId: number;
  teamName: string;
  weekStart: string;
  items: Array<{
    day_of_week: number;
    category: string;
    content: string;
  }>;
}

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

  const queryClient = useQueryClient();

  const createWorkPlanMutation = useMutation({
    mutationFn: async (input: CreateWorkPlanInput) => {
      const { data: workPlan, error: workPlanError } = await supabase
        .from("work_plans")
        .insert({
          team_id: input.teamId,
          team_name: input.teamName,
          week_start: input.weekStart,
        })
        .select()
        .single();

      if (workPlanError) throw workPlanError;

      const { error: itemsError } = await supabase
        .from("work_plan_items")
        .insert(
          input.items.map((item) => ({
            work_plan_id: workPlan.id,
            day_of_week: item.day_of_week,
            category: item.category,
            content: item.content,
          }))
        );

      if (itemsError) throw itemsError;
      return workPlan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-plans"] });
    },
  });

  return {
    ...useQuery({
      queryKey: ["work-plans", teamId, startDate?.toISOString()],
      queryFn: fetchWorkPlans,
    }),
    createWorkPlan: createWorkPlanMutation,
  };
};
