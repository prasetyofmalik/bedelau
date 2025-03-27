import React, { useState } from "react";
import { format, parseISO, addDays, subDays, subWeeks, startOfWeek, endOfWeek } from "date-fns";
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
import { WeeklySummary } from "./WeeklySummary";
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
        isToday: format(subDays(parseISO(wd.date), 7), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"),
      })),
    });
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
        isToday: format(addDays(parseISO(wd.date), 7), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"),
      })),
    });
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
          dayName: format(currentDate, 'EEE'),
          dayNumber: format(currentDate, 'd'),
          isToday: format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'),
        });
      }
      
      setCurrentRange({
        weekStart: format(newWeekStart, 'yyyy-MM-dd'),
        weekEnd: format(newWeekEnd, 'yyyy-MM-dd'),
        weekDates,
      });
    }
  };

  const getDailyEvaluations = (date: string) => {
    return evaluations.filter(e => e.evaluation_date === date);
  };

  const [activeDay, setActiveDay] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <Select
            value={filterTeamId ? filterTeamId.toString() : "all"}
            onValueChange={(value) => setFilterTeamId(value === "all" ? undefined : parseInt(value))}
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id.toString()}>
                  {team.text}
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
              <TabsTrigger value="daily">Daily View</TabsTrigger>
              <TabsTrigger value="weekly">Weekly Summary</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Dialog open={addEvalDialogOpen} onOpenChange={setAddEvalDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Evaluation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Evaluation</DialogTitle>
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
            {format(parseISO(currentRange.weekStart), "MMMM d")} - {format(parseISO(currentRange.weekEnd), "MMMM d, yyyy")}
          </span>
          <span className="sm:hidden font-medium">
            {format(parseISO(currentRange.weekStart), "MMM d")} - {format(parseISO(currentRange.weekEnd), "MMM d")}
          </span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={parseISO(currentRange.weekStart)}
                onSelect={handleDateChange}
                initialFocus
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
                  activeDay === day.date && "bg-muted",
                  day.date === format(new Date(), "yyyy-MM-dd") && "border-primary"
                )}
                onClick={() => setActiveDay(day.date)}
              >
                <span className="text-xs">{day.dayName}</span>
                <span className={cn("text-lg", day.isToday && "text-primary font-bold")}>
                  {day.dayNumber}
                </span>
                {getDailyEvaluations(day.date).length > 0 && (
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                )}
              </Button>
            ))}
          </div>

          <div>
            {activeDay ? (
              <>
                <h3 className="text-lg font-medium mb-4">
                  Evaluations for {format(parseISO(activeDay), "PPPP")}
                </h3>
                <EvaluationList evaluations={getDailyEvaluations(activeDay)} />
              </>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">Select a day to view evaluations</p>
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
