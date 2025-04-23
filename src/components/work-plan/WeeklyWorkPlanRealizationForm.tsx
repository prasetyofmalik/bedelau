import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useWorkPlans } from "./hooks/useWorkPlans";
import { startOfWeek, format, addDays } from "date-fns";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { id } from "date-fns/locale";
import { DayWorkPlanRealizationInput } from "./DayWorkPlanRealizationInput";

export const WeeklyWorkPlanRealizationForm = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [existingWorkPlan, setExistingWorkPlan] = useState(null);
  const { toast } = useToast();
  const { data: workPlans } = useWorkPlans(undefined, selectedDate);

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  useEffect(() => {
    if (selectedDate && workPlans && workPlans.length > 0) {
      // Filter work plans for the selected week
      const currentWeekWorkPlan = workPlans[0];
      setExistingWorkPlan(currentWeekWorkPlan);
    } else {
      setExistingWorkPlan(null);
    }
  }, [selectedDate, workPlans]);

  const onSubmit = async (data) => {
    // Implement work plan realization submission logic
    try {
      // TODO: Implement realization submission
      toast({
        title: "Berhasil",
        description: "Realisasi rencana kerja berhasil disimpan",
      });
    } catch (error) {
      console.error("Error submitting work plan realization:", error);
      toast({
        title: "Error",
        description: "Gagal menyimpan realisasi rencana kerja",
        variant: "destructive",
      });
    }
  };

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

      {existingWorkPlan && (
        <div className="space-y-6">
          {days.map((day) => (
            <div key={day.name} className="space-y-4">
              <h3 className="font-medium">{day.name}</h3>
              <DayWorkPlanRealizationInput
                label={day.name}
                dayIndex={day.index}
                teamId={1}
                workPlanItems={existingWorkPlan.work_plan_items.filter(
                  (item) => item.day_of_week === day.index
                )}
              />
            </div>
          ))}
        </div>
      )}

      <Button type="submit" disabled={isSubmitting || !existingWorkPlan}>
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
