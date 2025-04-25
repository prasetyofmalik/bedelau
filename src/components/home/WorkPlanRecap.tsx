import { useState } from "react";
import {
  addDays,
  format,
  startOfWeek,
  subWeeks,
  addWeeks,
  parseISO,
  isSameDay,
} from "date-fns";
import { id } from "date-fns/locale";
import { useWorkPlansWithRealizations } from "@/components/work-plan/hooks/useWorkPlansWithRealizations";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  WorkPlanItem,
  WorkPlanRealization,
} from "@/components/work-plan/types";

export const WorkPlanRecap = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const { data: workPlans, isLoading } = useWorkPlansWithRealizations(
    undefined,
    weekStart
  );
  const [openTeams, setOpenTeams] = useState<Record<string, boolean>>({});

  const days = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeek((prev) =>
      direction === "prev" ? subWeeks(prev, 1) : addWeeks(prev, 1)
    );
  };

  // Toggle team collapsible state
  const toggleTeam = (teamId: string) => {
    setOpenTeams((prev) => ({
      ...prev,
      [teamId]: !prev[teamId],
    }));
  };

  // Filter work plans for EXACTLY the current week only
  const currentWeekPlans =
    workPlans && Array.isArray(workPlans)
      ? workPlans.filter((plan) => {
          if (!plan.week_start) return false;

          // Parse the ISO date string to a Date object
          const planWeekStart = parseISO(plan.week_start);

          // Use isSameDay to compare only the week start dates
          return isSameDay(planWeekStart, weekStart);
        })
      : [];

  const getWorkItemsForDay = (workPlan: any, day: Date) => {
    const dayOfWeek = day.getDay() || 7;
    const groupedByCategory: Record<
      string,
      {
        plans: Array<string>;
        realizations: Array<string>;
      }
    > = {};

    // First process work plan items
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

    // Then process realizations
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

  return (
    <Card className="mb-8">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center justify-between">
          <span>Rencana Kerja Mingguan</span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek("prev")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-base font-medium">
              {format(weekStart, "d MMMM yyyy", { locale: id })}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek("next")}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : currentWeekPlans.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
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
                    const items = getWorkItemsForDay(plan, day);
                    if (Object.keys(items).length === 0) return null;

                    return (
                      <Collapsible
                        key={plan.id}
                        className="text-sm bg-gray-100 p-2 rounded shadow-sm"
                        open={openTeams[plan.id]}
                        onOpenChange={() => {}}
                      >
                        <CollapsibleTrigger
                          onClick={() => toggleTeam(plan.id)}
                          className="flex justify-between items-center w-full cursor-pointer font-medium text-left"
                        >
                          <span className="font-medium">{plan.team_name}</span>
                          {openTeams[plan.id] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2 space-y-2">
                          {Object.entries(items).map(([category, content]) => (
                            <div key={category} className="mt-2">
                              <Badge
                                variant="outline"
                                className="mb-1 bg-gray-50"
                              >
                                {category}
                              </Badge>

                              {/* Show realizations if they exist */}
                              {content.realizations.length > 0 && (
                                <ul className="list-disc pl-5 space-y-1">
                                  {content.realizations.map(
                                    (realization, idx) => (
                                      <li
                                        key={`realization-${idx}`}
                                        className="text-xs text-primary"
                                      >
                                        {realization}
                                      </li>
                                    )
                                  )}
                                </ul>
                              )}

                              {content.plans.length > 0 &&
                                content.realizations.length === 0 && (
                                  <ul className="list-disc pl-5 space-y-1">
                                    {content.plans.map((plan, idx) => (
                                      <li
                                        key={`plan-${idx}`}
                                        className="text-xs text-gray-600"
                                      >
                                        {plan}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                            </div>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
