export interface WorkPlan {
  id: string;
  team_id: number;
  team_name: string;
  week_start: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface WorkPlanItem {
  id: string;
  work_plan_id: string;
  day_of_week: number;
  category: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface WorkPlanCategory {
  id: string;
  team_id: number;
  name: string;
  created_at: string;
}
