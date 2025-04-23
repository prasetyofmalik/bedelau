import { useState } from "react";
import {
  addDays,
  format,
  startOfWeek,
  subWeeks,
  addWeeks,
  isSameWeek,
} from "date-fns";
import { id } from "date-fns/locale";
import { useWorkPlans } from "./hooks/useWorkPlans";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

export const WorkPlanCalendar = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const { data: workPlans, isLoading } = useWorkPlans(undefined, weekStart);

  const days = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeek((prev) =>
      direction === "prev" ? subWeeks(prev, 1) : addWeeks(prev, 1)
    );
  };

  // Group work plan items by category for better display
  const getGroupedWorkPlanItems = (dayDate: Date, workPlan: any) => {
    // Filter items for this day
    const dayItems = workPlan.work_plan_items.filter(
      (item: any) => item.day_of_week === dayDate.getDay()
    );

    // Group by category
    const groupedItems: Record<string, string[]> = {};
    dayItems.forEach((item: any) => {
      if (!groupedItems[item.category]) {
        groupedItems[item.category] = [];
      }
      groupedItems[item.category].push(item.content);
    });

    return groupedItems;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Filter work plans for the current week only
  const currentWeekPlans = workPlans.filter((plan: any) => {
    const planWeekStart = new Date(plan.week_start);
    return isSameWeek(planWeekStart, weekStart, { weekStartsOn: 1 });
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigateWeek("prev")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-medium">
          {format(weekStart, "d MMMM yyyy", { locale: id })}
        </h3>
        <Button variant="outline" onClick={() => navigateWeek("next")}>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {currentWeekPlans.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          Tidak ada rencana kerja untuk minggu ini
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {days.map((day) => (
            <div
              key={day.toISOString()}
              className="border rounded-lg p-4 space-y-2"
            >
              <h4 className="font-medium">
                {format(day, "EEEE", { locale: id })}
              </h4>
              <p className="text-sm text-gray-500">
                {format(day, "d MMM", { locale: id })}
              </p>
              <div className="space-y-3">
                {currentWeekPlans.map((plan: any) => {
                  const groupedItems = getGroupedWorkPlanItems(day, plan);
                  if (Object.keys(groupedItems).length === 0) return null;

                  return (
                    <div
                      key={plan.id}
                      className="text-sm bg-gray-50 p-2 rounded"
                    >
                      <p className="font-medium">{plan.team_name}</p>
                      {Object.entries(groupedItems).map(
                        ([category, contents]) => (
                          <div key={category} className="mt-2">
                            <span className="text-xs font-medium text-gray-700">
                              {category}:
                            </span>
                            <ul className="mt-1 list-disc pl-4 text-xs space-y-1">
                              {contents.map((content, idx) => (
                                <li key={idx}>{content}</li>
                              ))}
                            </ul>
                          </div>
                        )
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
