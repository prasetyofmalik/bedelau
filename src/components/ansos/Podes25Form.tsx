import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { UpdatePodes25Data } from "./types";

const statusOptions = [
  { value: "belum", label: "Belum Selesai" },
  { value: "sudah", label: "Sudah Selesai" },
];

interface Podes25FormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: UpdatePodes25Data | null;
}

export function Podes25DataForm({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: Podes25FormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedKecamatan, setSelectedKecamatan] = useState<string | null>(
    null
  );
  const [selectedDesa, setSelectedDesa] = useState<string | null>(null);

  const { data: samples = [] } = useQuery({
    queryKey: ["podes25_samples"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("podes25_samples")
        .select("kecamatan, desa_kelurahan, sample_code")
        .order("sample_code");

      if (error) throw error;
      return data;
    },
  });

  // Get unique kecamatan options
  const kecamatanOptions = Array.from(
    new Set(samples.map((sample) => sample.kecamatan))
  )
    .filter(Boolean)
    .map((kecamatan) => ({
      value: kecamatan,
      label: kecamatan,
    }));

  // Get desa options based on selected kecamatan
  const desaOptions = Array.from(
    new Set(
      samples
        .filter((sample) => sample.kecamatan === selectedKecamatan)
        .map((sample) => sample.desa_kelurahan)
    )
  )
    .filter(Boolean)
    .map((desa) => ({
      value: desa,
      label: desa,
    }));

  const form = useForm({
    defaultValues: {
      sample_code: initialData?.sample_code || "",
      status: initialData?.status || "belum",
    },
  });

  // Auto-populate sample_code when desa is selected
  useEffect(() => {
    if (selectedKecamatan && selectedDesa && !initialData) {
      const sample = samples.find(
        (s) =>
          s.kecamatan === selectedKecamatan && s.desa_kelurahan === selectedDesa
      );
      if (sample) {
        form.setValue("sample_code", sample.sample_code);
      }
    }
  }, [selectedKecamatan, selectedDesa, samples, form, initialData]);

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        sample_code: initialData.sample_code,
        status: initialData.status || "belum",
      });

      // Find and set initial kecamatan and desa
      const sample = samples.find(
        (s) => s.sample_code === initialData.sample_code
      );
      if (sample) {
        setSelectedKecamatan(sample.kecamatan);
        setSelectedDesa(sample.desa_kelurahan);
      }
    }
  }, [initialData, form, samples]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (initialData?.id) {
        const { error } = await supabase
          .from("podes25_updates")
          .update(data)
          .eq("id", initialData.id);

        if (error) throw error;
        toast.success("Data pemutakhiran berhasil diperbarui");
      } else {
        const { error } = await supabase.from("podes25_updates").insert([data]);

        if (error) throw error;
        toast.success("Data pemutakhiran berhasil ditambahkan");
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

  const handleDelete = async () => {
    if (!initialData?.id) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("podes25_updates")
        .delete()
        .eq("id", initialData.id);

      if (error) throw error;
      toast.success("Data pemutakhiran berhasil dihapus");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting update data:", error);
      toast.error("Gagal menghapus data pemutakhiran");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData?.id ? "Edit" : "Tambah"} Data Pemutakhiran PODES 2025
          </DialogTitle>
          <DialogDescription>
            Isi detail pemutakhiran data di bawah ini
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormItem>
              <FormLabel>Kecamatan</FormLabel>
              <Select
                isDisabled={!!initialData}
                options={kecamatanOptions}
                value={kecamatanOptions.find(
                  (option) => option.value === selectedKecamatan
                )}
                onChange={(option) => {
                  setSelectedKecamatan(option?.value || null);
                  setSelectedDesa(null); // Reset desa when kecamatan changes
                  form.setValue("sample_code", ""); // Reset sample code
                }}
                placeholder="Pilih Kecamatan..."
                isClearable
              />
            </FormItem>

            <FormItem>
              <FormLabel>Desa/Kelurahan</FormLabel>
              <Select
                isDisabled={!selectedKecamatan || !!initialData}
                options={desaOptions}
                value={desaOptions.find(
                  (option) => option.value === selectedDesa
                )}
                onChange={(option) => {
                  setSelectedDesa(option?.value || null);
                }}
                placeholder="Pilih Desa/Kelurahan..."
                isClearable
              />
            </FormItem>

            <FormField
              control={form.control}
              name="sample_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Desa/Kelurahan</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      readOnly
                      placeholder="Akan terisi otomatis setelah memilih desa"
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
                  <FormLabel>Status Pemutakhiran</FormLabel>
                  <UISelect
                    onValueChange={field.onChange}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Pilih status pemutakhiran" />
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
