import React, { useState } from "react";
import { format, parseISO } from "date-fns";
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
    switch (category) {
      case "achievement":
        return <Badge className="bg-green-500">Achievement</Badge>;
      case "challenge":
        return <Badge className="bg-amber-500">Challenge</Badge>;
      case "improvement":
        return <Badge className="bg-blue-500">Improvement</Badge>;
      default:
        return <Badge>{category}</Badge>;
    }
  };

  if (evaluations.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <div>
          <p className="text-muted-foreground">No evaluations found for this period.</p>
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
                  {format(parseISO(evaluation.evaluation_date), "PPP")}
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
                      Delete
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
            Added {format(parseISO(evaluation.created_at), "PPP 'at' h:mm a")}
          </CardFooter>
        </Card>
      ))}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              evaluation and remove it from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Evaluation</DialogTitle>
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
