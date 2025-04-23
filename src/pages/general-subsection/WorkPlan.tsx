import React, { useEffect, useState } from "react";
import WorkPlanSection from "@/components/work-plan/WorkPlanSection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const WorkPlan: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // Check if current user is a team leader or head office
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
  });

  useEffect(() => {
    const checkUserRole = async () => {
      if (!session?.user?.id) return;

      // Check if user is head office
      const { data: profileData } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profileData?.role === "head_office") {
        setIsAuthorized(true);
        return;
      }

      // Check if user is a team leader
      const { data: teamLeaderData } = await supabase
        .from("team_leaders")
        .select()
        .eq("employee_id", session.user.id);

      if (teamLeaderData && teamLeaderData.length > 0) {
        setIsAuthorized(true);
        return;
      }

      setIsAuthorized(false);
    };

    checkUserRole();
  }, [session?.user?.id]);

  if (isAuthorized === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (isAuthorized === false) {
    return <Navigate to="/monitoring" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Rencana Kerja</h1>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <WorkPlanSection />
        </div>
      </main>
    </div>
  );
};

export default WorkPlan;
