import { useWorkPlans } from "./hooks/useWorkPlans";
import { useWorkPlanCategories } from "./hooks/useWorkPlanCategories";
import { WeeklyWorkPlanForm } from "./WeeklyWorkPlanForm";
import { WorkPlanCalendar } from "./WorkPlanCalendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const WorkPlanSection = () => {
  return (
    <Tabs defaultValue="calendar" className="space-y-6">
      <TabsList>
        <TabsTrigger value="calendar">Kalender</TabsTrigger>
        <TabsTrigger value="input">Input Rencana</TabsTrigger>
      </TabsList>

      <TabsContent value="calendar">
        <WorkPlanCalendar />
      </TabsContent>

      <TabsContent value="input">
        <WeeklyWorkPlanForm />
      </TabsContent>
    </Tabs>
  );
};

export default WorkPlanSection;
