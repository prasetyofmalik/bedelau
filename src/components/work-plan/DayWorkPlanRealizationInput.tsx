import React, { useState } from "react";
import { Input } from "@/components/ui/input";

interface WorkPlanItem {
  id: string;
  category: string;
  content: string;
}

interface DayWorkPlanRealizationInputProps {
  label: string;
  dayIndex: number;
  teamId: number;
  workPlanItems: WorkPlanItem[];
}

export function DayWorkPlanRealizationInput({
  label,
  dayIndex,
  teamId,
  workPlanItems,
}: DayWorkPlanRealizationInputProps) {
  const [realizationValues, setRealizationValues] = useState<{
    [key: string]: string;
  }>(
    workPlanItems.reduce(
      (acc, item) => ({ ...acc, [item.id]: "" }),
      {} as { [key: string]: string }
    )
  );

  const handleRealizationChange = (itemId: string, content: string) => {
    setRealizationValues((prev) => ({
      ...prev,
      [itemId]: content,
    }));
  };

  return (
    <div className="space-y-2">
      {workPlanItems.map((item) => (
        <div key={item.id} className="flex flex-col space-y-2">
          <div className="text-sm font-medium text-gray-700">
            {item.category}: {item.content}
          </div>
          <Input
            placeholder="Realisasi rencana kerja"
            value={realizationValues[item.id]}
            onChange={(e) => handleRealizationChange(item.id, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
