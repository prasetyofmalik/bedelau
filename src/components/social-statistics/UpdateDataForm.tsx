import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { UpdateDataFormProps } from "./types";

export function UpdateDataForm({ isOpen, onClose, onSuccess, initialData }: UpdateDataFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    defaultValues: {
      sample_code: initialData?.sample_code || "",
      families_before: initialData?.families_before || 0,
      families_after: initialData?.families_after || 0,
      households_after: initialData?.households_after || 0,
    }
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const status = data.families_after > 0 ? 'completed' : 'not_started';
      const updateData = { ...data, status };

      if (initialData?.id) {
        const { error } = await supabase
          .from('ssn_m25_updates')
          .update(updateData)
          .eq('id', initialData.id);

        if (error) throw error;
        toast.success("Data pemutakhiran berhasil diperbarui");
      } else {
        const { error } = await supabase
          .from('ssn_m25_updates')
          .insert([updateData]);

        if (error) throw error;
        toast.success("Data pemutakhiran berhasil ditambahkan");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving update data:", error);
      toast.error(`Gagal ${initialData?.id ? "memperbarui" : "menambahkan"} data pemutakhiran`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData?.id ? "Edit" : "Tambah"} Data Pemutakhiran
          </DialogTitle>
          <DialogDescription>
            Isi detail pemutakhiran data di bawah ini
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="families_before"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Keluarga Sebelum Pemutakhiran (Blok II)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Masukkan jumlah keluarga sebelum pemutakhiran"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="families_after"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Keluarga Hasil pemutakhiran (Blok II)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Masukkan jumlah keluarga hasil pemutakhiran"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="households_after"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Rumah Tangga Hasil Pemutakhiran (Blok II)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Masukkan jumlah rumah tangga hasil pemutakhiran"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}