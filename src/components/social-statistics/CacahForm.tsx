import { useState, useEffect } from "react";
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

const r203Options = [
  { value: 1, label: "Terisi Lengkap" },
  { value: 2, label: "Terisi tidak lengkap" },
  {
    value: 3,
    label:
      "Tidak ada ART/responden yang memberikan informasi sampai akhir masa pencacahan",
  },
  { value: 4, label: "Menolak" },
  { value: 5, label: "Ruta pindah" },
];

const statusOptions = [
  { value: "belum", label: "Belum Selesai" },
  { value: "sudah", label: "Sudah Selesai" },
];

export function CacahDataForm({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: CacahSsnM25DataFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      status: initialData?.status || "belum",
      r203_msbp: initialData?.r203_msbp || 0,
      r203_kp: initialData?.r203_kp || 0,
    },
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        sample_code: initialData?.sample_code,
        no_ruta: initialData.no_ruta || 0,
        status: initialData.status || "belum",
        r203_msbp: initialData?.r203_msbp || 0,
        r203_kp: initialData?.r203_kp || 0,
      });
    }
  }, [initialData, form]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const cacahData = {
        ...data,
        r203_msbp: Number(data.r203_msbp),
        r203_kp: Number(data.r203_kp),
      };

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
      console.error("Error saving cacah data:", error);
      toast.error(
        `Gagal ${
          initialData?.id ? "memperbarui" : "menambahkan"
        } data pencacahan`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("ssn_m25_cacah")
        .delete()
        .eq("id", initialData.id);

      if (error) throw error;
      toast.success("Data pencacahan berhasil dihapus");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting cacah data:", error);
      toast.error("Gagal menghapus data pencacahan");
    } finally {
      setIsDeleting(false);
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
                  <FormLabel>Nomor Urut Sampel Rumah Tangga</FormLabel>
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
                  <Select
                    onValueChange={field.onChange}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Pilih hasil pencacahan MSBP" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      {r203Options.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value.toString()}
                        >
                          {option.label}
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
              name="r203_kp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hasil Pencacahan Rumah Tangga (R203) KP</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Pilih hasil pencacahan KP" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      {r203Options.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value.toString()}
                        >
                          {option.label}
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sudah Selesai Dicacah</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Pilih status pencacahan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
                      {statusOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value.toString()}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

<div className="flex justify-between items-center">
              {initialData?.id && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Menghapus..." : "Hapus"}
                </Button>
              )}
              <div className="flex gap-2 ml-auto">
                <Button type="button" variant="outline" onClick={onClose}>
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
