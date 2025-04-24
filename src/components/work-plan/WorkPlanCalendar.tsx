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

export const WorkPlanCalendar = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const { data: workPlans, isLoading } = useWorkPlansWithRealizations(
    undefined,
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

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  // Group work plan items and realizations by category
  const groupByCategory = (items: any[]) => {
    const grouped: Record<string, any[]> = {};
    items.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  };

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
              {getDailyWorkPlans(format(day, "yyyy-MM-dd")).length > 0 && (
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

                const plans = workPlan.work_plan_items.filter(
                  (item) => item.day_of_week === dayOfWeek
                );
                const realizations = workPlan.work_plan_realizations.filter(
                  (item) =>
                    item.work_plan_item_id &&
                    plans.some((plan) => plan.id === item.work_plan_item_id)
                );

                const groupedPlans = groupByCategory(plans);

                return (
                  <div key={workPlan.id} className="space-y-4">
                    {Object.entries(groupedPlans).map(([category, items]) => (
                      <div
                        key={category}
                        className="bg-gray-50 p-4 rounded-lg space-y-3"
                      >
                        <h4 className="font-medium text-sm">{category}</h4>
                        {items.map((item) => (
                          <div key={item.id} className="space-y-2">
                            <div className="text-sm">
                              <Badge variant="secondary" className="mb-1">
                                Rencana
                              </Badge>
                              <p>{item.content}</p>
                            </div>
                            {realizations
                              .filter((r) => r.work_plan_item_id === item.id)
                              .map((realization) => (
                                <div
                                  key={realization.id}
                                  className="text-sm pl-4 border-l-2 border-primary"
                                >
                                  <Badge variant="outline" className="mb-1">
                                    Realisasi
                                  </Badge>
                                  <p>{realization.realization_content}</p>
                                </div>
                              ))}
                          </div>
                        ))}
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
