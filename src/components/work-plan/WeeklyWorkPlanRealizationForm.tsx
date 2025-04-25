import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useWorkPlans } from "./hooks/useWorkPlans";
import { startOfWeek, format } from "date-fns";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { id } from "date-fns/locale";
import { DayWorkPlanRealizationInput } from "./DayWorkPlanRealizationInput";
import { supabase } from "@/lib/supabase";

export const WeeklyWorkPlanRealizationForm = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [existingWorkPlan, setExistingWorkPlan] = useState(null);
  const { toast } = useToast();
  const { data: workPlans } = useWorkPlans(undefined, selectedDate);

  const [dayPlans, setDayPlans] = useState<{
    [key: number]: Array<{ category: string; content: string }>;
  }>({
    1: [], // Monday
    2: [], // Tuesday
    3: [], // Wednesday
    4: [], // Thursday
    5: [], // Friday
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const handleDayPlanChange = (
    dayIndex: number,
    plans: Array<{ category: string; content: string }>
  ) => {
    setDayPlans((prev) => ({
      ...prev,
      [dayIndex]: plans,
    }));
  };

  const onSubmit = async () => {
    if (!selectedDate || !existingWorkPlan) {
      toast({
        title: "Error",
        description: "Pilih tanggal dan rencana kerja terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    try {
      // Insert realizations for all days
      const realizationPromises = Object.entries(dayPlans).flatMap(
        ([dayOfWeek, plans]) =>
          plans.map(async (plan) => {
            if (!plan.category || !plan.content) return null;

            // Important: Change to insert with day_of_week and category
            return supabase.from("work_plan_realizations").insert({
              work_plan_id: existingWorkPlan.id,
              day_of_week: parseInt(dayOfWeek),
              category: plan.category,
              realization_content: plan.content,
            });
          })
      );

      // Filter null promises and await all
      const results = await Promise.all(realizationPromises.filter(Boolean));

      // Check for errors
      const hasErrors = results.some((res) => res.error);

      if (hasErrors) {
        console.error("Error in one or more realization inserts:", results);
        throw new Error("Failed to save some realizations");
      }

      toast({
        title: "Berhasil",
        description: "Realisasi rencana kerja berhasil disimpan",
      });

      // Reset form
      reset();
      setSelectedDate(undefined);
      setDayPlans({
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
      });
      setExistingWorkPlan(null);
    } catch (error) {
      console.error("Error submitting work plan realization:", error);
      toast({
        title: "Error",
        description: "Gagal menyimpan realisasi rencana kerja",
        variant: "destructive",
      });
    }
  };

  React.useEffect(() => {
    if (selectedDate && workPlans && workPlans.length > 0) {
      const currentWeekWorkPlan = workPlans[0];
      setExistingWorkPlan(currentWeekWorkPlan);
    } else {
      setExistingWorkPlan(null);
    }
  }, [selectedDate, workPlans]);

  const days = [
    { name: "Senin", index: 1 },
    { name: "Selasa", index: 2 },
    { name: "Rabu", index: 3 },
    { name: "Kamis", index: 4 },
    { name: "Jumat", index: 5 },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Label>Pilih Minggu</Label>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, "dd MMMM yyyy", { locale: id })
              ) : (
                <span>Pilih minggu</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setIsCalendarOpen(false);
              }}
              initialFocus
              className="rounded-md border p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {selectedDate && (
        <div className="space-y-6">
          {days.map((day) => (
            <div key={day.name} className="space-y-4">
              <h3 className="font-medium">{day.name}</h3>
              <DayWorkPlanRealizationInput
                label={day.name}
                dayIndex={day.index}
                teamId={1}
                workPlanItems={
                  existingWorkPlan?.work_plan_items?.filter(
                    (item: { day_of_week: number; category: string }) =>
                      item.day_of_week === day.index
                  ) || []
                }
                values={dayPlans[day.index]}
                onChange={(plans) => handleDayPlanChange(day.index, plans)}
              />
            </div>
          ))}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Menyimpan...
          </>
        ) : (
          "Simpan Realisasi"
        )}
      </Button>
    </form>
  );
};
