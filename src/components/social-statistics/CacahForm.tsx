import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { CacahSsnM25DataFormProps } from "./types";

export function CacahDataForm({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: CacahSsnM25DataFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: samples = [] } = useQuery({
    queryKey: ["ssn_m25_samples"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ssn_m25_samples")
        .select("sample_code")
        .order("sample_code");

      if (error) throw error;
      return data;
    },
  });

  const form = useForm({
    defaultValues: {
      sample_code: initialData?.sample_code || "",
      no_ruta: initialData?.no_ruta || 0,
      r203_msbp: initialData?.r203_msbp || 0,
      r203_kp: initialData?.r203_kp || 0,
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const status = data.no_ruta === 10 ? "sudah" : data.no_ruta > 0 ? "progress" : "belum";
      const cacahData = { ...data, status };

      if (initialData?.id) {
        const { error } = await supabase
          .from("ssn_m25_cacah")
          .update(cacahData)
          .eq("id", initialData.id);

        if (error) throw error;
        toast.success("Data pencacahan berhasil diperbarui");
      } else {
        const { error } = await supabase
          .from("ssn_m25_cacah")
          .insert([cacahData]);

        if (error) throw error;
        toast.success("Data pencacahan berhasil ditambahkan");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving update data:", error);
      toast.error(
        `Gagal ${
          initialData?.id ? "memperbarui" : "menambahkan"
        } data pemutakhiran`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData?.id ? "Edit" : "Tambah"} Data Pencacahan
          </DialogTitle>
          <DialogDescription>
            Isi detail pencacahan lapangan di bawah ini
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="sample_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NKS</FormLabel>
                  <Select
                    disabled={!!initialData}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Pilih Nomor Kode Sampel" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      {samples.map((sample) => (
                        <SelectItem
                          key={sample.sample_code}
                          value={sample.sample_code}
                        >
                          {sample.sample_code}
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
              name="no_ruta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nomor Urut Sampel Rumah Tangga
                  </FormLabel>
                    <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 1 && value <= 10) {
                        field.onChange(value);
                      }
                      }}
                      min="1"
                      max="10"
                    />
                    </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="r203_msbp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                  Hasil Pencacahan Rumah Tangga (R203) MSBP
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value >= 0) {
                          field.onChange(value);
                        }
                      }}
                      min="0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="r203_kp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                  Hasil Pencacahan Rumah Tangga (R203) KP
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value >= 0) {
                          field.onChange(value);
                        }
                      }}
                      min="0"
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
