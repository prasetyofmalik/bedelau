import React from "react";
import WorkPlanSection from "@/components/work-plan/WorkPlanSection";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useTeamAccess } from "@/components/work-plan/hooks/useTeamAccess";

const WorkPlan: React.FC = () => {
  const { hasAccess, isLoading } = useTeamAccess(2); // Team ID 2 for social statistics

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!hasAccess) {
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
