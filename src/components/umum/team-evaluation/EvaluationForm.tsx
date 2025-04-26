import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
import { TeamEvaluation } from "./types";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useTeamEvaluations } from "./hooks/useTeamEvaluations";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { teams } from "@/components/monitoring/teamsData";

type FormValues = {
  team_id: string;
  category: string;
  content: string;
  evaluation_date: Date;
  new_category?: string;
};

interface EvaluationFormProps {
  onSuccess?: () => void;
  initialData?: TeamEvaluation;
}

export function EvaluationForm({ onSuccess, initialData }: EvaluationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string>(initialData?.team_id.toString() || "");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [teamCategories, setTeamCategories] = useState<string[]>([]);
  const { addEvaluation, updateEvaluation } = useTeamEvaluations();
  
  const form = useForm<FormValues>({
    defaultValues: initialData
      ? {
          team_id: initialData.team_id.toString(),
          category: initialData.category,
          content: initialData.content,
          evaluation_date: new Date(initialData.evaluation_date),
          new_category: "",
        }
      : {
          team_id: "",
          category: "",
          content: "",
          evaluation_date: new Date(),
          new_category: "",
        },
  });

  // Load team categories whenever the team changes
  useEffect(() => {
    const loadTeamCategories = async () => {
      const teamIdValue = form.watch("team_id");
      if (!teamIdValue) return;
      
      setSelectedTeamId(teamIdValue);
      const teamId = parseInt(teamIdValue);
      
      // Find the selected team
      const team = teams.find(t => t.id === teamId);
      if (!team) return;
      
      // If the team has no categories yet, fetch them from the database
      if (team.categories.length === 0) {
        try {
          const { data } = await supabase
            .from('team_evaluations')
            .select('category')
            .eq('team_id', teamId)
            .order('created_at', { ascending: false });
          
          if (data && data.length > 0) {
            const uniqueCategories = Array.from(new Set(data.map(item => item.category)));
            team.categories = uniqueCategories;
            setTeamCategories(uniqueCategories);
          } else {
            setTeamCategories([]);
          }
        } catch (error) {
          console.error("Error fetching team categories:", error);
          setTeamCategories([]);
        }
      } else {
        setTeamCategories(team.categories);
      }
      
      // Reset category when team changes
      form.setValue("category", "");
      setShowNewCategoryInput(false);
    };
    
    loadTeamCategories();
  }, [form.watch("team_id")]);

  // Handle adding a new category
  const handleAddNewCategory = () => {
    const newCategory = form.watch("new_category");
    if (!newCategory) return;
    
    const teamIdValue = form.watch("team_id");
    if (!teamIdValue) return;
    
    const teamId = parseInt(teamIdValue);
    const team = teams.find(t => t.id === teamId);
    
    if (team) {
      if (!team.categories.includes(newCategory)) {
        team.categories.push(newCategory);
        setTeamCategories([...team.categories]);
      }
      
      form.setValue("category", newCategory);
      form.setValue("new_category", "");
      setShowNewCategoryInput(false);
    }
  };

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true);
      
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("Anda harus login untuk mengirim evaluasi");
        return;
      }

      const userId = sessionData.session.user.id;
      const selectedTeam = teams.find(team => team.id === parseInt(values.team_id));
      
      if (!selectedTeam) {
        toast.error("Tim yang dipilih tidak ditemukan");
        return;
      }
      
      // Handle new category if provided
      let categoryToUse = values.category;
      if (showNewCategoryInput && values.new_category) {
        categoryToUse = values.new_category;
        
        // Add to team categories if not exists
        if (!selectedTeam.categories.includes(categoryToUse)) {
          selectedTeam.categories.push(categoryToUse);
        }
      }

      const evaluationData = {
        team_id: parseInt(values.team_id),
        team_name: selectedTeam.name,
        category: categoryToUse,
        content: values.content,
        evaluation_date: format(values.evaluation_date, 'yyyy-MM-dd'),
        created_by: userId,
      };

      if (initialData) {
        await updateEvaluation.mutateAsync({
          id: initialData.id,
          ...evaluationData,
        });
        toast.success("Evaluasi berhasil diperbarui");
      } else {
        await addEvaluation.mutateAsync(evaluationData);
        toast.success("Evaluasi berhasil ditambahkan");
        form.reset({
          team_id: values.team_id,
          category: "",
          content: "",
          evaluation_date: values.evaluation_date,
          new_category: "",
        });
        setShowNewCategoryInput(false);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting evaluation:", error);
      toast.error("Gagal mengirim evaluasi. Silakan coba lagi.");
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
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Pilih tim" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id.toString()}>
                      {team.name}
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
                        format(field.value, "PPPP", { locale: id })
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("2023-01-01")
                    }
                    initialFocus
                    locale={id}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {!showNewCategoryInput ? (
          <>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori</FormLabel>
                  <div className="flex gap-2">
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={selectedTeamId === ""}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white flex-1">
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-white">
                        {teamCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowNewCategoryInput(true)}
                      disabled={selectedTeamId === ""}
                    >
                      <PlusCircle className="h-4 w-4 mr-1" /> Kategori Baru
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ) : (
          <>
            <FormField
              control={form.control}
              name="new_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori Baru</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="Masukkan nama kategori baru"
                        className="bg-white flex-1"
                        {...field}
                      />
                    </FormControl>
                    <Button 
                      type="button" 
                      onClick={handleAddNewCategory}
                      disabled={!field.value}
                    >
                      Tambah
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowNewCategoryInput(false)}
                    >
                      Batal
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

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

        <Button type="submit" disabled={isSubmitting || (!form.watch("category") && !form.watch("new_category") && !showNewCategoryInput)}>
          {isSubmitting ? "Mengirim..." : initialData ? "Perbarui Evaluasi" : "Tambah Evaluasi"}
        </Button>
      </form>
    </Form>
  );
}
