import { WeeklyWorkPlanForm } from "./WeeklyWorkPlanForm";
import { WeeklyWorkPlanRealizationForm } from "./WeeklyWorkPlanRealizationForm";
import { WorkPlanCalendar } from "./WorkPlanCalendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const WorkPlanSection = () => {
  return (
    <Tabs defaultValue="calendar" className="space-y-6">
      <TabsList>
        <TabsTrigger value="calendar">Kalender</TabsTrigger>
        <TabsTrigger value="input">Input Rencana</TabsTrigger>
        <TabsTrigger value="realization">Input Realisasi</TabsTrigger>
      </TabsList>

      <TabsContent value="calendar">
        <WorkPlanCalendar />
      </TabsContent>

      <TabsContent value="input">
        <WeeklyWorkPlanForm />
      </TabsContent>

      <TabsContent value="realization">
        <WeeklyWorkPlanRealizationForm />
      </TabsContent>
    </Tabs>
  );
};

export default WorkPlanSection;
