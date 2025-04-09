export type TeamEvaluationCategory = 'achievement' | 'challenge' | 'improvement' | 'administration' | 'finance' | 'survey' | 'data-analysis' | 'production' | 'agriculture' | 'distribution' | 'retail' | 'analysis' | 'reporting' | 'processing' | 'network' | 'sectoral' | 'coordination' | 'accountability' | 'monitoring' | 'evaluation' | 'reform' | 'bureaucracy' | 'publication' | 'outreach';

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
  achievements: string[];
  challenges: string[];
  improvements: string[];
  [key: string]: any; // Allow for dynamic category fields
}
