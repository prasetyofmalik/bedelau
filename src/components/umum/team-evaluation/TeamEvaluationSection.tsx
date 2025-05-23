import React, { useState } from "react";
import { format, parseISO, addDays, subDays, subWeeks, startOfWeek, endOfWeek, isSameDay, isWithinInterval } from "date-fns";
import { id } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, PlusCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useTeamEvaluations } from "./hooks/useTeamEvaluations";
import { useWeeklySummaries, getCurrentWeekDates } from "./hooks/useWeeklySummaries";
import { EvaluationForm } from "./EvaluationForm";
import { EvaluationList } from "./EvaluationList";
import WeeklySummary from "./WeeklySummary";
import { teams } from "@/components/monitoring/teamsData";
import { cn } from "@/lib/utils";

export default function TeamEvaluationSection() {
  const [addEvalDialogOpen, setAddEvalDialogOpen] = useState(false);
  const [filterTeamId, setFilterTeamId] = useState<number | undefined>(undefined);
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily");
  const [currentRange, setCurrentRange] = useState(getCurrentWeekDates());
  
  // Format dates for the API query
  const startDate = viewMode === "daily" ? currentRange.weekStart : 
    format(subWeeks(parseISO(currentRange.weekStart), 3), "yyyy-MM-dd");
  const endDate = currentRange.weekEnd;
  
  const { data: evaluations, isLoading } = useTeamEvaluations(filterTeamId, startDate, endDate);
  const weeklySummaries = useWeeklySummaries(evaluations);

  const handlePreviousWeek = () => {
    const newStart = subDays(parseISO(currentRange.weekStart), 7);
    const newEnd = subDays(parseISO(currentRange.weekEnd), 7);
    
    setCurrentRange({
      weekStart: format(newStart, "yyyy-MM-dd"),
      weekEnd: format(newEnd, "yyyy-MM-dd"),
      weekDates: currentRange.weekDates.map(wd => ({
        ...wd,
        date: format(subDays(parseISO(wd.date), 7), "yyyy-MM-dd"),
        dayName: format(subDays(parseISO(wd.date), 7), "EEE", { locale: id }),
        dayNumber: format(subDays(parseISO(wd.date), 7), "d"),
        isToday: format(subDays(parseISO(wd.date), 7), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"),
      })),
    });
    
    // When changing week, set active day to null to reset selection
    setActiveDay(null);
  };

  const handleNextWeek = () => {
    const newStart = addDays(parseISO(currentRange.weekStart), 7);
    const newEnd = addDays(parseISO(currentRange.weekEnd), 7);
    
    setCurrentRange({
      weekStart: format(newStart, "yyyy-MM-dd"),
      weekEnd: format(newEnd, "yyyy-MM-dd"),
      weekDates: currentRange.weekDates.map(wd => ({
        ...wd,
        date: format(addDays(parseISO(wd.date), 7), "yyyy-MM-dd"),
        dayName: format(addDays(parseISO(wd.date), 7), "EEE", { locale: id }),
        dayNumber: format(addDays(parseISO(wd.date), 7), "d"),
        isToday: format(addDays(parseISO(wd.date), 7), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"),
      })),
    });
    
    // When changing week, set active day to null to reset selection
    setActiveDay(null);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const newWeekStart = startOfWeek(date, { weekStartsOn: 1 });
      const newWeekEnd = endOfWeek(date, { weekStartsOn: 1 });
      
      const weekDates = [];
      for (let i = 0; i < 7; i++) {
        const currentDate = addDays(newWeekStart, i);
        weekDates.push({
          date: format(currentDate, 'yyyy-MM-dd'),
          dayName: format(currentDate, 'EEE', { locale: id }),
          dayNumber: format(currentDate, 'd'),
          isToday: format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'),
        });
      }
      
      setCurrentRange({
        weekStart: format(newWeekStart, 'yyyy-MM-dd'),
        weekEnd: format(newWeekEnd, 'yyyy-MM-dd'),
        weekDates,
      });
      
      // Set active day to the selected date
      setActiveDay(format(date, 'yyyy-MM-dd'));
    }
  };

  const getDailyEvaluations = (date: string) => {
    return evaluations.filter(e => e.evaluation_date === date);
  };

  const [activeDay, setActiveDay] = useState<string | null>(null);

  // Creating a date range for the selected week to use in Calendar's modifiers
  const weekRangeDates = activeDay ? {
    from: parseISO(currentRange.weekStart),
    to: parseISO(currentRange.weekEnd)
  } : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <Select
            value={filterTeamId ? filterTeamId.toString() : "all"}
            onValueChange={(value) => setFilterTeamId(value === "all" ? undefined : parseInt(value))}
          >
            <SelectTrigger className="bg-white w-full md:w-[200px]">
              <SelectValue placeholder="Pilih tim" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Semua Tim</SelectItem>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id.toString()}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Tabs
            value={viewMode}
            onValueChange={(value: "daily" | "weekly") => setViewMode(value)}
            className="w-full md:w-auto"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="daily">Tampilan Harian</TabsTrigger>
              <TabsTrigger value="weekly">Ringkasan Mingguan</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Dialog open={addEvalDialogOpen} onOpenChange={setAddEvalDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Tambah Evaluasi
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Tambah Evaluasi</DialogTitle>
            </DialogHeader>
            <EvaluationForm onSuccess={() => setAddEvalDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline font-medium">
            {format(parseISO(currentRange.weekStart), "d MMMM", { locale: id })} - {format(parseISO(currentRange.weekEnd), "d MMMM yyyy", { locale: id })}
          </span>
          <span className="sm:hidden font-medium">
            {format(parseISO(currentRange.weekStart), "d MMM", { locale: id })} - {format(parseISO(currentRange.weekEnd), "d MMM", { locale: id })}
          </span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white">
              <Calendar
                mode="single"
                selected={activeDay ? parseISO(activeDay) : undefined}
                onSelect={handleDateChange}
                initialFocus
                locale={id}
                modifiers={
                  weekRangeDates ? { range: weekRangeDates } : undefined
                }
                modifiersStyles={{
                  range: { backgroundColor: "rgba(10, 102, 194, 0.75)" }
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextWeek}
          disabled={
            parseISO(currentRange.weekEnd) >= 
            endOfWeek(new Date(), { weekStartsOn: 1 })
          }
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {viewMode === "daily" && (
        <div className="space-y-6">
          <div className="grid grid-cols-7 gap-2">
            {currentRange.weekDates.map((day) => (
              <Button
                key={day.date}
                variant="outline"
                className={cn(
                  "flex-col h-auto py-2",
                  day.isToday && "border-primary",
                  activeDay === day.date ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" : "",
                  day.date === format(new Date(), "yyyy-MM-dd") && "border-primary"
                )}
                onClick={() => setActiveDay(day.date)}
              >
                <span className="text-xs">{day.dayName}</span>
                <span className={cn("text-lg", day.isToday && "font-bold")}>
                  {day.dayNumber}
                </span>
                {getDailyEvaluations(day.date).length > 0 && (
                  <span className={cn("mt-1 h-1.5 w-1.5 rounded-full", 
                    activeDay === day.date ? "bg-primary-foreground" : "bg-primary")}></span>
                )}
              </Button>
            ))}
          </div>

          <div>
            {activeDay ? (
              <>
                <h3 className="text-lg font-medium mb-4">
                  Evaluasi untuk {format(parseISO(activeDay), "PPPP", { locale: id })}
                </h3>
                <EvaluationList evaluations={getDailyEvaluations(activeDay)} />
              </>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">Pilih tanggal untuk melihat evaluasi</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {viewMode === "weekly" && (
        <div className="space-y-6">
          <WeeklySummary summaries={weeklySummaries} />
        </div>
      )}
    </div>
  );
}
