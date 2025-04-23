import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { WorkPlan, WorkPlanItem } from "../types";
import { startOfWeek, endOfWeek, format } from "date-fns";

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

      // Format dates to ISO strings for consistent comparison
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
      // Ensure items array has at least one valid entry
      if (!items.length) {
        throw new Error("No work plan items to save");
      }

      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error("User not authenticated");
      }

      // Format the weekStart to ensure consistency with date format in database
      const formattedWeekStart = new Date(weekStart);

      const { data: workPlan, error: workPlanError } = await supabase
        .from("work_plans")
        .insert({
          team_id: teamId,
          team_name: teamName,
          week_start: format(formattedWeekStart, "yyyy-MM-dd"),
          created_by: session.session.user.id,
        })
        .select()
        .single();

      if (workPlanError) {
        console.error("Error creating work plan:", workPlanError);
        throw workPlanError;
      }

      if (!workPlan?.id) {
        throw new Error("Failed to create work plan");
      }

      const { error: itemsError } = await supabase
        .from("work_plan_items")
        .insert(
          items.map((item) => ({
            ...item,
            work_plan_id: workPlan.id,
          }))
        );

      if (itemsError) {
        console.error("Error creating work plan items:", itemsError);
        throw itemsError;
      }

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
