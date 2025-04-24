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

  const toggleTeam = (teamId: string) => {
    setOpenTeams((prev) => ({
      ...prev,
      [teamId]: !prev[teamId],
    }));
  };

  const getWorkItemsForDay = (dayDate: Date, workPlan: any) => {
    const dayOfWeek = dayDate.getDay() || 7;
    const planItems = workPlan.work_plan_items.filter(
      (item: any) => item.day_of_week === dayOfWeek
    );

    const planItemIds = planItems.map((item: any) => item.id);
    const realizationItems = workPlan.work_plan_realizations.filter(
      (item: any) => planItemIds.includes(item.work_plan_item_id)
    );

    // Group by category
    const groupedItems: Record<
      string,
      { plan: string; realization?: string }[]
    > = {};

    planItems.forEach((item: any) => {
      if (!groupedItems[item.category]) {
        groupedItems[item.category] = [];
      }

      const realization = realizationItems.find(
        (r: any) => r.work_plan_item_id === item.id
      );

      groupedItems[item.category].push({
        plan: item.content,
        realization: realization?.realization_content,
      });
    });

    return groupedItems;
  };

  const currentWeekPlans =
    workPlans?.filter((plan: any) => {
      if (!plan.week_start) return false;
      const planWeekStart = parseISO(plan.week_start);
      return isSameDay(planWeekStart, weekStart);
    }) || [];

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
                    const items = getWorkItemsForDay(day, plan);
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
                          {Object.entries(items).map(([category, contents]) => (
                            <div key={category} className="mt-2">
                              <Badge
                                variant="outline"
                                className="mb-1 bg-gray-50"
                              >
                                {category}
                              </Badge>
                              <ul className="list-none space-y-2">
                                {contents.map((content, idx) => (
                                  <li key={idx} className="text-xs">
                                    {content.realization ? (
                                      <div className="text-primary">
                                        {content.realization}
                                      </div>
                                    ) : (
                                      <div className="text-gray-600">
                                        {content.plan}
                                      </div>
                                    )}
                                  </li>
                                ))}
                              </ul>
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
