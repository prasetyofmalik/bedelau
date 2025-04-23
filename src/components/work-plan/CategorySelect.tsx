import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useWorkPlanCategories } from "./hooks/useWorkPlanCategories";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface CategorySelectProps {
  value: string;
  onChange: (val: string) => void;
  teamId: number;
}

export function CategorySelect({
  value,
  onChange,
  teamId,
}: CategorySelectProps) {
  const { data: categories, createCategory } = useWorkPlanCategories(teamId);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<string>("");

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const cat = await createCategory.mutateAsync({
        teamId,
        name: newCategory.trim(),
      });

      toast({ title: "Kategori ditambahkan" });
      setOpen(false);
      setNewCategory("");
      onChange(cat.name);
    } catch (e) {
      console.error("Error adding category:", e);
      toast({ title: "Gagal menambah kategori", variant: "destructive" });
    }
  };

  return (
    <div>
      <Select
        value={value}
        onValueChange={(newValue) => {
          if (newValue === "__add__") {
            setOpen(true);
          } else {
            onChange(newValue);
          }
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Pilih kategori" />
        </SelectTrigger>
        <SelectContent>
          {categories?.map((cat) => (
            <SelectItem key={cat.id} value={cat.name}>
              {cat.name}
            </SelectItem>
          ))}
          <SelectItem value="__add__">
            <span className="flex items-center">
              <Plus className="h-4 w-4 mr-2" /> Tambah Kategori Baru
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Kategori</DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            placeholder="Nama kategori baru"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && handleAddCategory()}
          />
          <DialogFooter>
            <Button onClick={handleAddCategory}>Tambah</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
