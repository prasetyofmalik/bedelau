import { useMemo } from "react";
import { startOfWeek, endOfWeek, format, parseISO, addDays } from "date-fns";
import { id } from "date-fns/locale";
import { TeamEvaluation, WeeklySummary } from "../types";

export const useWeeklySummaries = (evaluations: TeamEvaluation[] = []) => {
  const weeklySummaries = useMemo(() => {
    const summariesMap = new Map<string, WeeklySummary>();

    evaluations.forEach((evaluation) => {
      const date = parseISO(evaluation.evaluation_date);
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
      
      const weekStartStr = format(weekStart, 'yyyy-MM-dd');
      const weekEndStr = format(weekEnd, 'yyyy-MM-dd');
      const key = `${evaluation.team_id}_${weekStartStr}`;

      if (!summariesMap.has(key)) {
        const baseSummary: WeeklySummary = {
          team_id: evaluation.team_id,
          team_name: evaluation.team_name,
          week_start: weekStartStr,
          week_end: weekEndStr
        };
        summariesMap.set(key, baseSummary);
      }

      const summary = summariesMap.get(key)!;
      
      // Handle the evaluation based on its category
      const { category, content } = evaluation;
      
      // Create array for category if it doesn't exist yet
      if (!summary[category]) {
        summary[category] = [];
      }
      
      // Add content to the category array
      summary[category].push(content);
    });

    return Array.from(summariesMap.values()).sort((a, b) => 
      b.week_start.localeCompare(a.week_start)
    );
  }, [evaluations]);

  return weeklySummaries;
};

export const getCurrentWeekDates = () => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = addDays(weekStart, i);
    weekDates.push({
      date: format(date, 'yyyy-MM-dd'),
      dayName: format(date, 'EEE', { locale: id }),
      dayNumber: format(date, 'd'),
      isToday: format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd'),
    });
  }
  
  return {
    weekStart: format(weekStart, 'yyyy-MM-dd'),
    weekEnd: format(weekEnd, 'yyyy-MM-dd'),
    weekDates,
  };
};
