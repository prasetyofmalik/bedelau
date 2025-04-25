import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useTeamAccess = (teamId?: number) => {
  const { data: isTeamLeader } = useQuery({
    queryKey: ["team-leader", teamId],
    queryFn: async () => {
      if (!teamId) return false;

      const { data: teamLeader } = await supabase
        .from("team_leaders")
        .select()
        .eq("team_id", teamId)
        .single();

      return !!teamLeader;
    },
  });

  const { data: isHeadOffice } = useQuery({
    queryKey: ["head-office"],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .single();

      return profile?.role === "head_office";
    },
  });

  return {
    hasAccess: isTeamLeader || isHeadOffice,
    isLoading: isTeamLeader === undefined || isHeadOffice === undefined,
  };
};
