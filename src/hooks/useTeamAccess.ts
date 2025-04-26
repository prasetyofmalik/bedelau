import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useTeamAccess = (teamId?: number) => {
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  const { data: isTeamLeader, isLoading } = useQuery({
    queryKey: ["team-access", session?.user?.id, teamId],
    queryFn: async () => {
      if (!session?.user?.id || !teamId) return false;

      // Check if user is head office
      const { data: profileData } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profileData?.role === "head_office") return true;

      // Check if user is a team leader for this team
      const { data: teamLeaderData } = await supabase
        .from("team_leaders")
        .select()
        .eq("employee_id", session.user.id)
        .eq("team_id", teamId)
        .single();

      return !!teamLeaderData;
    },
    enabled: !!session?.user?.id && !!teamId,
  });

  return {
    hasAccess: isTeamLeader || false,
    isLoading,
  };
};
