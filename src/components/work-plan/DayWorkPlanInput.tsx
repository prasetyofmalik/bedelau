import React from "react";
import { Button } from "@/components/ui/button";
import { Trash, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CategorySelect } from "./CategorySelect";

interface DayPlan {
  category: string;
  content: string;
}

interface DayWorkPlanInputProps {
  label: string;
  dayIndex: number; // 0 for Monday
  teamId: number;
  values: DayPlan[];
  onChange: (dayPlans: DayPlan[]) => void;
}

export function DayWorkPlanInput({
  label,
  dayIndex,
  teamId,
  values,
  onChange,
}: DayWorkPlanInputProps) {
  const handleCategoryChange = (i: number, cat: string) => {
    const newArr = [...values];
    newArr[i].category = cat;
    onChange(newArr);
  };

  const handleContentChange = (i: number, content: string) => {
    const newArr = [...values];
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
    values.length > 0 ? values : [{ category: "", content: "" }];

  return (
    <div className="space-y-2">
      {displayValues.map((row, idx) => (
        <div key={idx} className="flex flex-col md:flex-row gap-2 items-start">
          <div className="flex-1">
            <CategorySelect
              value={row.category}
              onChange={(cat) => handleCategoryChange(idx, cat)}
              teamId={teamId}
            />
          </div>
          <div className="flex-1">
            <Input
              placeholder="Rencana kerja"
              value={row.content}
              onChange={(e) => handleContentChange(idx, e.target.value)}
            />
          </div>
          <div className="flex-none flex items-center gap-1">
            <Button
              size="icon"
              variant="outline"
              type="button"
              onClick={handleAdd}
              title="Tambah rencana"
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
  );
}
