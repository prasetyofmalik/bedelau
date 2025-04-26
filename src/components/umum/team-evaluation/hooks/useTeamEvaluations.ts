import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { TeamEvaluation, TeamEvaluationCategory } from "../types";

export const useTeamEvaluations = (teamId?: number, startDate?: string, endDate?: string) => {
  const queryClient = useQueryClient();

  // Query function to fetch team evaluations
  const fetchTeamEvaluations = useCallback(async () => {
    let query = supabase
      .from("team_evaluations")
      .select("*")
      .order("evaluation_date", { ascending: false });

    if (teamId) {
      query = query.eq("team_id", teamId);
    }

    if (startDate && endDate) {
      query = query
        .gte("evaluation_date", startDate)
        .lte("evaluation_date", endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching team evaluations:", error);
      throw error;
    }

    return data as TeamEvaluation[];
  }, [teamId, startDate, endDate]);

  // Query to get team evaluations
  const query = useQuery({
    queryKey: ["team-evaluations", teamId, startDate, endDate],
    queryFn: fetchTeamEvaluations,
  });

  // Mutation to add a new team evaluation
  const addEvaluation = useMutation({
    mutationFn: async (newEvaluation: Omit<TeamEvaluation, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("team_evaluations")
        .insert(newEvaluation)
        .select()
        .single();

      if (error) {
        console.error("Error adding team evaluation:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-evaluations"] });
    },
  });

  // Mutation to update an existing team evaluation
  const updateEvaluation = useMutation({
    mutationFn: async ({ id, ...evaluation }: Partial<TeamEvaluation> & { id: string }) => {
      const { data, error } = await supabase
        .from("team_evaluations")
        .update(evaluation)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating team evaluation:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-evaluations"] });
    },
  });

  // Mutation to delete a team evaluation
  const deleteEvaluation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("team_evaluations")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting team evaluation:", error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-evaluations"] });
    },
  });

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    addEvaluation,
    updateEvaluation,
    deleteEvaluation,
  };
};
