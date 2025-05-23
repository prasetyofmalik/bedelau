import { useState } from "react";
import {
  addDays,
  format,
  startOfWeek,
  subWeeks,
  addWeeks,
  isSameDay,
  parseISO,
} from "date-fns";
import { id } from "date-fns/locale";
import { useWorkPlansWithRealizations } from "./hooks/useWorkPlansWithRealizations";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { WorkPlanItem, WorkPlanRealization } from "./types";

interface WorkPlanCalendarProps {
  teamId: number;
}

export const WorkPlanCalendar = ({ teamId }: WorkPlanCalendarProps) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const { data: workPlans, isLoading } = useWorkPlansWithRealizations(
    teamId,
    weekStart
  );

  const days = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeek((prev) =>
      direction === "prev" ? subWeeks(prev, 1) : addWeeks(prev, 1)
    );
    setActiveDay(null);
  };

  const getDailyWorkPlans = (date: string) => {
    return (
      workPlans?.filter((plan) => {
        const planWeekStart = parseISO(plan.week_start);
        return isSameDay(planWeekStart, parseISO(weekStart.toISOString()));
      }) || []
    );
  };

  // Reorganized to properly group by category while keeping all items
  const getWorkItemsForDay = (workPlan: any, dayOfWeek: number) => {
    // Create structure with categories as keys
    const groupedByCategory: Record<
      string,
      { plans: Array<string>; realizations: Array<string> }
    > = {};

    // Group plans by category
    workPlan.work_plan_items
      ?.filter((item: WorkPlanItem) => item.day_of_week === dayOfWeek)
      .forEach((item: WorkPlanItem) => {
        if (!groupedByCategory[item.category]) {
          groupedByCategory[item.category] = {
            plans: [],
            realizations: [],
          };
        }
        groupedByCategory[item.category].plans.push(item.content);
      });

    // Add realizations to the same categories
    workPlan.work_plan_realizations
      ?.filter((item: WorkPlanRealization) => item.day_of_week === dayOfWeek)
      .forEach((item: WorkPlanRealization) => {
        if (!groupedByCategory[item.category]) {
          groupedByCategory[item.category] = {
            plans: [],
            realizations: [],
          };
        }
        groupedByCategory[item.category].realizations.push(
          item.realization_content
        );
      });

    return groupedByCategory;
  };

  // Helper function to check if a day has any work plan items
  const dayHasWorkPlanItems = (day: Date) => {
    const dayOfWeek = day.getDay() || 7; // Convert 0 (Sunday) to 7 to match our day_of_week values
    const dailyWorkPlans = getDailyWorkPlans(format(day, "yyyy-MM-dd"));

    // Check if any work plan has items for this day
    return dailyWorkPlans.some((workPlan) => {
      const items = getWorkItemsForDay(workPlan, dayOfWeek);
      return Object.keys(items).length > 0;
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigateWeek("prev")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-medium">
          {format(weekStart, "d MMMM yyyy", { locale: id })}
        </h3>
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigateWeek("next")}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-5 gap-2">
          {days.map((day) => (
            <Button
              key={day.toISOString()}
              variant="outline"
              className={cn(
                "flex-col h-auto py-2",
                format(day, "yyyy-MM-dd") ===
                  format(new Date(), "yyyy-MM-dd") && "border-primary",
                activeDay === format(day, "yyyy-MM-dd")
                  ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                  : ""
              )}
              onClick={() => setActiveDay(format(day, "yyyy-MM-dd"))}
            >
              <span className="text-xs">
                {format(day, "EEE", { locale: id })}
              </span>
              <span
                className={cn(
                  "text-lg",
                  format(day, "yyyy-MM-dd") ===
                    format(new Date(), "yyyy-MM-dd") && "font-bold"
                )}
              >
                {format(day, "d")}
              </span>
              {dayHasWorkPlanItems(day) && (
                <span
                  className={cn(
                    "mt-1 h-1.5 w-1.5 rounded-full",
                    activeDay === format(day, "yyyy-MM-dd")
                      ? "bg-primary-foreground"
                      : "bg-primary"
                  )}
                ></span>
              )}
            </Button>
          ))}
        </div>

        <div>
          {activeDay ? (
            <>
              <h3 className="text-lg font-medium mb-4">
                Rencana & Realisasi Kerja{" "}
                {format(parseISO(activeDay), "PPPP", { locale: id })}
              </h3>
              {getDailyWorkPlans(activeDay).map((workPlan) => {
                const dayOfWeek = parseISO(activeDay).getDay() || 7;
                const items = getWorkItemsForDay(workPlan, dayOfWeek);

                return (
                  <div key={workPlan.id} className="space-y-4">
                    {Object.entries(items).map(([category, content]) => (
                      <div
                        key={category}
                        className="bg-gray-50 p-4 rounded-lg space-y-3"
                      >
                        <h4 className="font-medium text-sm">{category}</h4>

                        {content.plans.length > 0 && (
                          <div className="text-sm">
                            <Badge variant="secondary" className="mb-1">
                              Rencana
                            </Badge>
                            <ul className="list-disc pl-5 space-y-1">
                              {content.plans.map((plan, idx) => (
                                <li key={`plan-${idx}`}>{plan}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {content.realizations.length > 0 && (
                          <div className="text-sm pl-4 border-l-2 border-primary">
                            <Badge variant="outline" className="mb-1">
                              Realisasi
                            </Badge>
                            <ul className="list-disc pl-5 space-y-1">
                              {content.realizations.map((realization, idx) => (
                                <li key={`realization-${idx}`}>
                                  {realization}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  Pilih tanggal untuk melihat rencana kerja
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
