import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TeamEvaluation, TeamEvaluationCategory } from "./types";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useTeamEvaluations } from "./hooks/useTeamEvaluations";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { teams } from "@/components/monitoring/teamsData";

type FormValues = {
  team_id: string;
  category: TeamEvaluationCategory;
  content: string;
  evaluation_date: Date;
};

interface EvaluationFormProps {
  onSuccess?: () => void;
  initialData?: TeamEvaluation;
}

export function EvaluationForm({ onSuccess, initialData }: EvaluationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addEvaluation, updateEvaluation } = useTeamEvaluations();
  
  const form = useForm<FormValues>({
    defaultValues: initialData
      ? {
          team_id: initialData.team_id.toString(),
          category: initialData.category,
          content: initialData.content,
          evaluation_date: new Date(initialData.evaluation_date),
        }
      : {
          team_id: "",
          category: "achievement",
          content: "",
          evaluation_date: new Date(),
        },
  });

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true);
      
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("You must be logged in to submit evaluations");
        return;
      }

      const userId = sessionData.session.user.id;
      const selectedTeam = teams.find(team => team.id === parseInt(values.team_id));
      
      if (!selectedTeam) {
        toast.error("Selected team not found");
        return;
      }

      const evaluationData = {
        team_id: parseInt(values.team_id),
        team_name: selectedTeam.text,
        category: values.category,
        content: values.content,
        evaluation_date: format(values.evaluation_date, 'yyyy-MM-dd'),
        created_by: userId,
      };

      if (initialData) {
        await updateEvaluation.mutateAsync({
          id: initialData.id,
          ...evaluationData,
        });
        toast.success("Evaluation updated successfully");
      } else {
        await addEvaluation.mutateAsync(evaluationData);
        toast.success("Evaluation added successfully");
        form.reset({
          team_id: values.team_id,
          category: "achievement",
          content: "",
          evaluation_date: values.evaluation_date,
        });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      toast.error("Failed to submit evaluation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="team_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tim</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tim" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id.toString()}>
                      {team.text}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="evaluation_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tanggal</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("2023-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="achievement">Pencapaian</SelectItem>
                  <SelectItem value="challenge">Tantangan</SelectItem>
                  <SelectItem value="improvement">Perbaikan untuk Kedepannya</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konten</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Masukkan catatan evaluasi anda di sini..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Mengirim..." : initialData ? "Perbarui Evaluasi" : "Tambah Evaluasi"}
        </Button>
      </form>
    </Form>
  );
}
