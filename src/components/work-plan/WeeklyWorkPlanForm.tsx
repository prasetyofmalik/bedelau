import { useState } from "react";
import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useWorkPlans } from "./hooks/useWorkPlans";
import { useWorkPlanCategories } from "./hooks/useWorkPlanCategories";
import { Textarea } from "@/components/ui/textarea";
import { startOfWeek } from "date-fns";

interface WorkPlanFormData {
  items: {
    day_of_week: number;
    category: string;
    content: string;
  }[];
}

export const WeeklyWorkPlanForm = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const { toast } = useToast();
  const { createWorkPlan } = useWorkPlans();
  const { data: categories } = useWorkPlanCategories(1); // Default to UMUM team

  const { register, handleSubmit, reset } = useForm<WorkPlanFormData>({
    defaultValues: {
      items: Array(5)
        .fill({})
        .map((_, i) => ({
          day_of_week: i + 1,
          category: "",
          content: "",
        })),
    },
  });

  const onSubmit = async (data: WorkPlanFormData) => {
    if (!selectedDate) {
      toast({
        title: "Error",
        description: "Pilih tanggal terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    try {
      const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
      await createWorkPlan.mutateAsync({
        teamId: 1, // Default to UMUM team
        teamName: "UMUM",
        weekStart: weekStart.toISOString(),
        items: data.items.filter((item) => item.content.trim() !== ""),
      });

      toast({
        title: "Berhasil",
        description: "Rencana kerja berhasil disimpan",
      });

      reset();
      setSelectedDate(undefined);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan rencana kerja",
        variant: "destructive",
      });
    }
  };

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Label>Pilih Minggu</Label>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
        />
      </div>

      <div className="space-y-6">
        {days.map((day, index) => (
          <div key={day} className="space-y-4">
            <h3 className="font-medium">{day}</h3>
            <div className="grid gap-4">
              <Input
                {...register(`items.${index}.category`)}
                placeholder="Kategori"
                list="categories"
              />
              <datalist id="categories">
                {categories?.map((category) => (
                  <option key={category.id} value={category.name} />
                ))}
              </datalist>
              <Textarea
                {...register(`items.${index}.content`)}
                placeholder="Rencana kerja"
                rows={3}
              />
            </div>
          </div>
        ))}
      </div>

      <Button type="submit">Simpan Rencana Kerja</Button>
    </form>
  );
};
