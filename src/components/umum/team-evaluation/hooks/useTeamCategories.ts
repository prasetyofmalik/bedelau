import { useCallback, useMemo, useState } from "react";
import { teams } from "@/components/monitoring/teamsData";
import { TeamEvaluationCategory } from "../types";
import { supabase } from "@/lib/supabase";

export const useTeamCategories = (teamId?: number) => {
  const [isLoading, setIsLoading] = useState(false);

  const getTeamCategories = useCallback(async (): Promise<TeamEvaluationCategory[]> => {
    if (!teamId) {
      return [];
    }

    setIsLoading(true);
    
    try {
      // First, check if categories exist in the team data
      const team = teams.find(t => t.id === teamId);
      
      if (!team) {
        return [];
      }

      // If the team has no categories yet, try to fetch them from the database
      if (team.categories.length === 0) {
        const { data } = await supabase
          .from('team_evaluations')
          .select('category')
          .eq('team_id', teamId)
          .order('created_at', { ascending: false });

        // Extract unique categories
        if (data && data.length > 0) {
          const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
          team.categories = uniqueCategories;
          return uniqueCategories;
        }
      }
      
      return team.categories;
    } catch (error) {
      console.error("Error fetching team categories:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  const data = useMemo(() => getTeamCategories(), [getTeamCategories]);

  return {
    data,
    isLoading,
    getTeamCategories
  };
};
