import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Plus } from "lucide-react";
import { CategorySelect } from "./CategorySelect";

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
  values: Array<{ category: string; content: string }>;
  onChange: (plans: Array<{ category: string; content: string }>) => void;
}

export function DayWorkPlanRealizationInput({
  label,
  dayIndex,
  teamId,
  workPlanItems,
  values,
  onChange,
}: DayWorkPlanRealizationInputProps) {
  const handleCategoryChange = (i: number, cat: string) => {
    const newArr = values.map((item) => ({ ...item }));
    if (!newArr[i]) {
      newArr[i] = { category: "", content: "" };
    }
    newArr[i].category = cat;
    onChange(newArr);
  };

  const handleContentChange = (i: number, content: string) => {
    const newArr = values.map((item) => ({ ...item }));
    if (!newArr[i]) {
      newArr[i] = { category: "", content: "" };
    }
    newArr[i].content = content;
    onChange(newArr);
  };

  const handleAdd = () => {
    onChange([...values, { category: "", content: "" }]);
  };

  const handleDelete = (i: number) => {
    onChange(values.filter((_, idx) => i !== idx));
  };

  // Display at least one row even if no values
  const displayValues =
    values && values.length > 0 ? values : [{ category: "", content: "" }];

  // Show original plan items above the realization input
  return (
    <div className="space-y-4">
      {workPlanItems.length > 0 && (
        <div className="space-y-2 p-4 bg-gray-50 rounded-md">
          <h4 className="font-medium text-sm text-gray-600">Rencana Awal:</h4>
          {workPlanItems.map((item, idx) => (
            <div key={idx} className="text-sm text-gray-600">
              <span className="font-medium">{item.category}:</span>{" "}
              {item.content}
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {displayValues.map((row, idx) => (
          <div
            key={idx}
            className="flex flex-col md:flex-row gap-2 items-start"
          >
            <div className="flex-1">
              <CategorySelect
                value={row.category || ""}
                onChange={(cat) => handleCategoryChange(idx, cat)}
                teamId={teamId}
              />
            </div>
            <div className="flex-1">
              <Input
                placeholder="Realisasi rencana kerja"
                value={row.content || ""}
                onChange={(e) => handleContentChange(idx, e.target.value)}
              />
            </div>
            <div className="flex-none flex items-center gap-1">
              <Button
                size="icon"
                variant="outline"
                type="button"
                onClick={handleAdd}
                title="Tambah realisasi"
                className="shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
              {displayValues.length > 1 && (
                <Button
                  size="icon"
                  variant="ghost"
                  type="button"
                  onClick={() => handleDelete(idx)}
                  title="Hapus"
                  className="shrink-0"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
