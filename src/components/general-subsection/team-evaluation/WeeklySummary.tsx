import React from "react";
import { format, parseISO } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WeeklySummary as WeeklySummaryType } from "./types";
import { AwardIcon, AlertTriangleIcon, ArrowUpIcon } from "lucide-react";

interface WeeklySummaryProps {
  summaries: WeeklySummaryType[];
}

export function WeeklySummary({ summaries }: WeeklySummaryProps) {
  if (summaries.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <div>
          <p className="text-muted-foreground">No summaries found for this period.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {summaries.map((summary, index) => (
        <Card key={`${summary.team_id}_${summary.week_start}_${index}`}>
          <CardHeader>
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <CardTitle>{summary.team_name}</CardTitle>
                <CardDescription>
                  Week of {format(parseISO(summary.week_start), "PPP")} - {format(parseISO(summary.week_end), "PPP")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {summary.achievements.length > 0 && (
                <AccordionItem value="achievements">
                  <AccordionTrigger className="py-2">
                    <div className="flex items-center gap-2">
                      <AwardIcon className="h-5 w-5 text-green-500" />
                      <span>Achievements ({summary.achievements.length})</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 pl-2">
                      {summary.achievements.map((achievement, i) => (
                        <li key={i} className="text-sm border-l-2 border-green-500 pl-3 py-1">
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )}

              {summary.challenges.length > 0 && (
                <AccordionItem value="challenges">
                  <AccordionTrigger className="py-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangleIcon className="h-5 w-5 text-amber-500" />
                      <span>Challenges ({summary.challenges.length})</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 pl-2">
                      {summary.challenges.map((challenge, i) => (
                        <li key={i} className="text-sm border-l-2 border-amber-500 pl-3 py-1">
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )}

              {summary.improvements.length > 0 && (
                <AccordionItem value="improvements">
                  <AccordionTrigger className="py-2">
                    <div className="flex items-center gap-2">
                      <ArrowUpIcon className="h-5 w-5 text-blue-500" />
                      <span>Improvements ({summary.improvements.length})</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 pl-2">
                      {summary.improvements.map((improvement, i) => (
                        <li key={i} className="text-sm border-l-2 border-blue-500 pl-3 py-1">
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
