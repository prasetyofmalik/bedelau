import React from "react";
import WorkPlanSection from "@/components/work-plan/WorkPlanSection";

const WorkPlan: React.FC = () => {
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
