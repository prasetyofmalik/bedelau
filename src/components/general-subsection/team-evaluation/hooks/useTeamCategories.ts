import { useCallback, useMemo } from "react";
import { teams } from "@/components/monitoring/teamsData";
import { TeamEvaluationCategory } from "../types";

export const useTeamCategories = (teamId?: number) => {
  const getTeamCategories = useCallback((): TeamEvaluationCategory[] => {
    if (!teamId) {
      return ["achievement", "challenge", "improvement"];
    }

    const team = teams.find(t => t.id === teamId);
    if (!team || !team.categories || team.categories.length === 0) {
      return ["achievement", "challenge", "improvement"];
    }

    return team.categories;
  }, [teamId]);

  const data = useMemo(() => getTeamCategories(), [getTeamCategories]);

  return {
    data,
    isLoading: false,
  };
};
