import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { WorkPlanCategory } from "../types";

export const useWorkPlanCategories = (teamId?: number) => {
  const queryClient = useQueryClient();

  const fetchCategories = async () => {
    let query = supabase.from("work_plan_categories").select("*").order("name");

    if (teamId) {
      query = query.eq("team_id", teamId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as WorkPlanCategory[];
  };

  const query = useQuery({
    queryKey: ["work-plan-categories", teamId],
    queryFn: fetchCategories,
  });

  const createCategory = useMutation({
    mutationFn: async ({ teamId, name }: { teamId: number; name: string }) => {
      const { data, error } = await supabase
        .from("work_plan_categories")
        .insert({ team_id: teamId, name })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-plan-categories"] });
    },
  });

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createCategory,
  };
};
