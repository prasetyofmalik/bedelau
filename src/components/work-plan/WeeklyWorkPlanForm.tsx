import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useWorkPlans } from "./hooks/useWorkPlans";
import { useWorkPlanCategories } from "./hooks/useWorkPlanCategories";
import { WorkPlanFormData } from "./types";
import { startOfWeek, format, addDays } from "date-fns";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { id } from "date-fns/locale";
import { DayWorkPlanInput } from "./DayWorkPlanInput";
import { DayPicker } from "react-day-picker";

type DayProps = React.ComponentProps<typeof DayPicker>["modifiers"];

interface WeeklyWorkPlanFormProps {
  teamId: number;
  teamName: string;
}

export const WeeklyWorkPlanForm = ({
  teamId,
  teamName,
}: WeeklyWorkPlanFormProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { toast } = useToast();
  const { createWorkPlan } = useWorkPlans();
  const { data: categories } = useWorkPlanCategories(teamId);

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<WorkPlanFormData>({
    defaultValues: {
      dayPlans: {
        1: [], // Monday
        2: [], // Tuesday
        3: [], // Wednesday
        4: [], // Thursday
        5: [], // Friday
      },
    },
  });

  // State to track work plans for each day
  const [dayPlans, setDayPlans] = useState<{
    [key: number]: Array<{ category: string; content: string }>;
  }>({
    1: [], // Monday
    2: [], // Tuesday
    3: [], // Wednesday
    4: [], // Thursday
    5: [], // Friday
  });

  const getWeekDays = (date: Date) => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    return Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));
  };

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
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Pilih tanggal terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    try {
      const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });

      // Convert day plans to work plan items
      const workPlanItems: Array<{
        day_of_week: number;
        category: string;
        content: string;
      }> = [];

      Object.entries(dayPlans).forEach(([dayOfWeek, plans]) => {
        plans.forEach((plan) => {
          // Only add plans that have both category and content
          if (plan.category.trim() && plan.content.trim()) {
            workPlanItems.push({
              day_of_week: parseInt(dayOfWeek),
              category: plan.category,
              content: plan.content,
            });
          }
        });
      });

      if (workPlanItems.length === 0) {
        toast({
          title: "Error",
          description: "Isi minimal satu rencana kerja",
          variant: "destructive",
        });
        return;
      }

      await createWorkPlan.mutateAsync({
        teamId: teamId,
        teamName: teamName,
        weekStart: weekStart.toISOString(),
        items: workPlanItems,
      });

      toast({
        title: "Berhasil",
        description: "Rencana kerja berhasil disimpan",
      });

      // Reset form and state
      reset();
      setSelectedDate(undefined);
      setDayPlans({
        1: [], // Monday
        2: [], // Tuesday
        3: [], // Wednesday
        4: [], // Thursday
        5: [], // Friday
      });
    } catch (error) {
      console.error("Error submitting work plan:", error);
      toast({
        title: "Error",
        description: "Gagal menyimpan rencana kerja",
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
              modifiers={{
                selected: selectedDate
                  ? getWeekDays(selectedDate).map((date) => date)
                  : [],
              }}
              modifiersStyles={{
                selected: {
                  backgroundColor: "rgb(59 130 246)",
                  color: "white",
                },
              }}
              initialFocus
              className="rounded-md border p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-6">
        {days.map((day) => (
          <div key={day.name} className="space-y-4">
            <h3 className="font-medium">{day.name}</h3>
            <DayWorkPlanInput
              label={day.name}
              dayIndex={day.index}
              teamId={teamId}
              values={dayPlans[day.index]}
              onChange={(plans) => handleDayPlanChange(day.index, plans)}
            />
          </div>
        ))}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Menyimpan...
          </>
        ) : (
          "Simpan Rencana Kerja"
        )}
      </Button>
    </form>
  );
};
