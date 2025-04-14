import React from "react";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { WeeklySummary as WeeklySummaryType } from "./types";

const getCategoryDisplayName = (category: string) => {
  // Simply return the category name with first letter capitalized
  return category.charAt(0).toUpperCase() + category.slice(1);
};

const getCategoryBadgeColor = (category: string) => {
  // Generate a consistent color based on the first character of the category
  const colorMap: Record<string, string> = {
    'a': 'bg-purple-500', 'b': 'bg-indigo-500', 'c': 'bg-blue-500',
    'd': 'bg-sky-500', 'e': 'bg-cyan-500', 'f': 'bg-teal-500',
    'g': 'bg-emerald-500', 'h': 'bg-green-500', 'i': 'bg-lime-500',
    'j': 'bg-yellow-500', 'k': 'bg-amber-500', 'l': 'bg-orange-500',
    'm': 'bg-red-500', 'n': 'bg-rose-500', 'o': 'bg-pink-500',
    'p': 'bg-fuchsia-500', 'q': 'bg-violet-500', 'r': 'bg-purple-500',
    's': 'bg-indigo-500', 't': 'bg-blue-500', 'u': 'bg-sky-500',
    'v': 'bg-cyan-500', 'w': 'bg-teal-500', 'x': 'bg-emerald-500',
    'y': 'bg-green-500', 'z': 'bg-lime-500',
  };
  
  const firstChar = category.charAt(0).toLowerCase();
  return colorMap[firstChar] || 'bg-gray-500';
};

interface WeeklySummaryProps {
  summaries: WeeklySummaryType[];
}

export default function WeeklySummary({ summaries }: WeeklySummaryProps) {
  if (summaries.length === 0) {
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground">Tidak ada ringkasan mingguan yang tersedia.</p>
      </div>
    );
  }

  const renderCategorySections = (summary: WeeklySummaryType) => {
    const sections = [];
    
    // Get all keys from the summary object
    const allKeys = Object.keys(summary);
    
    // Filter only the categories with content (arrays with items)
    const categoryKeys = allKeys.filter(key => 
      Array.isArray(summary[key]) && 
      summary[key].length > 0 && 
      !['team_id', 'team_name', 'week_start', 'week_end'].includes(key)
    );
    
    for (const category of categoryKeys) {
      const items = summary[category];
      if (items && items.length > 0) {
        sections.push(
          <div key={category} className="mb-4">
            <h4 className="flex items-center text-sm font-medium mb-2">
              <Badge className={getCategoryBadgeColor(category)}>
                {getCategoryDisplayName(category)}
              </Badge>
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              {items.map((item: string, index: number) => (
                <li key={index} className="text-sm">{item}</li>
              ))}
            </ul>
          </div>
        );
      }
    }
    
    return sections;
  };

  return (
    <Accordion type="single" collapsible className="space-y-4">
      {summaries.map((summary, index) => (
        <AccordionItem 
          key={`${summary.team_id}_${summary.week_start}_${index}`} 
          value={`${summary.team_id}_${summary.week_start}_${index}`}
          className="border rounded-lg overflow-hidden"
        >
          <AccordionTrigger className="px-6 py-4 bg-white hover:bg-gray-50 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center w-full text-left">
              <div className="font-medium">{summary.team_name}</div>
              <div className="text-sm text-muted-foreground sm:ml-auto">
                {format(parseISO(summary.week_start), "d MMMM", { locale: id })} - {format(parseISO(summary.week_end), "d MMMM yyyy", { locale: id })}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            {renderCategorySections(summary)}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
