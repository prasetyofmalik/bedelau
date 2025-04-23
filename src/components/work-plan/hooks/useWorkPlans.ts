import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { WorkPlan, WorkPlanItem } from "../types";
import { startOfWeek, endOfWeek } from "date-fns";

export const useWorkPlans = (teamId?: number, startDate?: Date) => {
  const queryClient = useQueryClient();

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
      query = query
        .gte("week_start", weekStart.toISOString())
        .lte("week_start", weekEnd.toISOString());
    }

    const { data, error } = await query.order("week_start", {
      ascending: false,
    });

    if (error) throw error;
    return data;
  };

  const query = useQuery({
    queryKey: ["work-plans", teamId, startDate?.toISOString()],
    queryFn: fetchWorkPlans,
  });

  const createWorkPlan = useMutation({
    mutationFn: async ({
      teamId,
      teamName,
      weekStart,
      items,
    }: {
      teamId: number;
      teamName: string;
      weekStart: string;
      items: Omit<
        WorkPlanItem,
        "id" | "work_plan_id" | "created_at" | "updated_at"
      >[];
    }) => {
      const { data: workPlan, error: workPlanError } = await supabase
        .from("work_plans")
        .insert({
          team_id: teamId,
          team_name: teamName,
          week_start: weekStart,
        })
        .select()
        .single();

      if (workPlanError) throw workPlanError;

      const { error: itemsError } = await supabase
        .from("work_plan_items")
        .insert(
          items.map((item) => ({
            ...item,
            work_plan_id: workPlan.id,
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
    data: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createWorkPlan,
  };
};
