import React from "react";
import WorkPlanSection from "@/components/work-plan/WorkPlanSection";

interface WorkPlanProps {
  teamId: number;
  teamName: string;
}

const WorkPlan: React.FC<WorkPlanProps> = ({ teamId, teamName }) => {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Rencana Kerja - {teamName}
        </h1>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <WorkPlanSection teamId={teamId} teamName={teamName} />
        </div>
      </main>
    </div>
  );
};

export default WorkPlan;
