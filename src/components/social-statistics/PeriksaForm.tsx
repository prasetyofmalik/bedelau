import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";
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
  Select as UISelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { PeriksaSsnM25DataFormProps } from "./types";

const statusOptions = [
  { value: "belum", label: "Belum Selesai" },
  { value: "sudah", label: "Sudah Selesai" },
];

export function PeriksaDataForm({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: PeriksaSsnM25DataFormProps) {
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

  // Convert samples to react-select format
  const sampleOptions = samples.map((sample) => ({
    value: sample.sample_code,
    label: sample.sample_code,
  }));

  const form = useForm({
    defaultValues: {
      sample_code: initialData?.sample_code || "",
      no_ruta: initialData?.no_ruta || 0,
      status: initialData?.status || "belum",
      iv3_2_16: initialData?.iv3_2_16 || 0,
      iv3_3_8: initialData?.iv3_3_8 || 0,
      r304_kp: initialData?.r304_kp || 0,
      r305_kp: initialData?.r305_kp || 0,
    },
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        sample_code: initialData.sample_code,
        no_ruta: initialData?.no_ruta || 0,
        status: initialData?.status || "belum",
        iv3_2_16: initialData?.iv3_2_16 || 0,
        iv3_3_8: initialData?.iv3_3_8 || 0,
        r304_kp: initialData?.r304_kp || 0,
        r305_kp: initialData?.r305_kp || 0,
      });
    }
  }, [initialData, form]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const periksaData = {
        ...data,
      };

      if (initialData?.id) {
        const { error } = await supabase
          .from("ssn_m25_periksa")
          .update(periksaData)
          .eq("id", initialData.id);

        if (error) throw error;
        toast.success("Data pemeriksaan berhasil diperbarui");
      } else {
        const { error } = await supabase
          .from("ssn_m25_periksa")
          .insert([periksaData]);

        if (error) throw error;
        toast.success("Data pemeriksaan berhasil ditambahkan");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving periksa data:", error);
      toast.error(
        `Gagal ${
          initialData?.id ? "memperbarui" : "menambahkan"
        } data pemeriksaan`
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
        .from("ssn_m25_periksa")
        .delete()
        .eq("id", initialData.id);

      if (error) throw error;
      toast.success("Data pemeriksaan berhasil dihapus");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting periksa data:", error);
      toast.error("Gagal menghapus data pemeriksaan");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData?.id ? "Edit" : "Tambah"} Data Pemeriksaan
          </DialogTitle>
          <DialogDescription>
            Isi detail pemeriksaan lapangan di bawah ini
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="sample_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Kode Sampel</FormLabel>
                  <FormControl>
                    <Controller
                      name="sample_code"
                      control={form.control}
                      render={({ field }) => (
                        <Select
                          isDisabled={!!initialData}
                          options={sampleOptions}
                          value={sampleOptions.find(
                            (option) => option.value === field.value
                          )}
                          onChange={(option) => field.onChange(option?.value)}
                          placeholder="Pilih atau ketik NKS..."
                          className="react-select-container"
                          classNamePrefix="react-select"
                          isClearable
                          isSearchable
                        />
                      )}
                    />
                  </FormControl>
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
                        const value =
                          e.target.value === "" ? null : Number(e.target.value);
                        if (value === null || value >= 0) {
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
              name="iv3_2_16"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Rata-Rata Pengeluaran Makanan Sebulan (Rp) (BIV.3.2. R16
                    Kolom 5)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? null : Number(e.target.value);
                        if (value === null || value >= 0) {
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
              name="iv3_3_8"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Rata-Rata Pengeluaran Bukan Makanan Sebulan (Rp) (BIV.3.3.
                    R8 Kolom 3)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? null : Number(e.target.value);
                        if (value === null || value >= 0) {
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
              name="r304_kp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Komoditas Makanan (R304 KP)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? null : Number(e.target.value);
                        if (value === null || value >= 0) {
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
              name="r305_kp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Jumlah Komoditas Bukan Makanan (R305 KP)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? null : Number(e.target.value);
                        if (value === null || value >= 0) {
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sudah Selesai Diperiksa</FormLabel>
                  <UISelect
                    onValueChange={field.onChange}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Pilih status pemeriksaan" />
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
                  </UISelect>
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
