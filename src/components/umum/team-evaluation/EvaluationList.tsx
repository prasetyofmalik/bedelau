import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TeamEvaluation } from "./types";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/supabase";
import { useTeamEvaluations } from "./hooks/useTeamEvaluations";
import { EvaluationForm } from "./EvaluationForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EvaluationListProps {
  evaluations: TeamEvaluation[];
}

export function EvaluationList({ evaluations }: EvaluationListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState<TeamEvaluation | null>(null);
  const { deleteEvaluation } = useTeamEvaluations();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  React.useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setCurrentUserId(data.session.user.id);
      }
    };
    
    checkSession();
  }, []);

  const handleDelete = async () => {
    if (selectedEvaluation) {
      await deleteEvaluation.mutateAsync(selectedEvaluation.id);
      setDeleteDialogOpen(false);
      setSelectedEvaluation(null);
    }
  };

  const getCategoryBadge = (category: string) => {
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
    const bgColor = colorMap[firstChar] || 'bg-gray-500';
    
    return <Badge className={bgColor}>{category}</Badge>;
  };

  if (evaluations.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <div>
          <p className="text-muted-foreground">Tidak ada evaluasi yang ditemukan untuk periode ini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {evaluations.map((evaluation) => (
        <Card key={evaluation.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{evaluation.team_name}</CardTitle>
                <CardDescription>
                  {format(parseISO(evaluation.evaluation_date), "PPPP", { locale: id })}
                </CardDescription>
              </div>
              {currentUserId === evaluation.created_by && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedEvaluation(evaluation);
                        setEditDialogOpen(true);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => {
                        setSelectedEvaluation(evaluation);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-2">{getCategoryBadge(evaluation.category)}</div>
            <p className="text-sm mt-2 whitespace-pre-wrap">{evaluation.content}</p>
          </CardContent>
          <CardFooter className="pt-0 text-xs text-muted-foreground">
            Ditambahkan {format(parseISO(evaluation.created_at), "PPPP 'pada' h:mm a", { locale: id })}
          </CardFooter>
        </Card>
      ))}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus evaluasi secara permanen
              dan menghapusnya dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Evaluasi</DialogTitle>
          </DialogHeader>
          {selectedEvaluation && (
            <EvaluationForm 
              initialData={selectedEvaluation} 
              onSuccess={() => setEditDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
