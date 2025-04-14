export type TeamEvaluationCategory = string;

export interface TeamEvaluation {
  id: string;
  team_id: number;
  team_name: string;
  evaluation_date: string;
  category: TeamEvaluationCategory;
  content: string;
  created_by: string;
  created_at: string;
}

export interface WeeklySummary {
  team_id: number;
  team_name: string;
  week_start: string;
  week_end: string;
  [key: string]: any; // Allow for dynamic category fields
}
