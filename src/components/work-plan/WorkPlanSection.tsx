import React from "react";
import { WeeklyWorkPlanForm } from "./WeeklyWorkPlanForm";
import { WeeklyWorkPlanRealizationForm } from "./WeeklyWorkPlanRealizationForm";
import { WorkPlanCalendar } from "./WorkPlanCalendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WorkPlanSectionProps {
  teamId: number;
  teamName: string;
}

const WorkPlanSection: React.FC<WorkPlanSectionProps> = ({
  teamId,
  teamName,
}) => {
  return (
    <Tabs defaultValue="calendar" className="space-y-6">
      <TabsList>
        <TabsTrigger value="calendar">Kalender</TabsTrigger>
        <TabsTrigger value="input">Input Rencana</TabsTrigger>
        <TabsTrigger value="realization">Input Realisasi</TabsTrigger>
      </TabsList>

      <TabsContent value="calendar">
        <WorkPlanCalendar teamId={teamId} />
      </TabsContent>

      <TabsContent value="input">
        <WeeklyWorkPlanForm teamId={teamId} teamName={teamName} />
      </TabsContent>

      <TabsContent value="realization">
        <WeeklyWorkPlanRealizationForm teamId={teamId} />
      </TabsContent>
    </Tabs>
  );
};

export default WorkPlanSection;
