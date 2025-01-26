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
import { MutakhirFormProps } from "./types";

const statusOptions = [
  { value: "belum", label: "Belum Selesai" },
  { value: "sudah", label: "Sudah Selesai" },
];

export function MutakhirDataForm({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  surveyType,
}: MutakhirFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedKecamatan, setSelectedKecamatan] = useState<string | null>(
    null
  );
  const [selectedDesa, setSelectedDesa] = useState<string | null>(null);

  const { data: samples = [] } = useQuery({
    queryKey: [`${surveyType}_samples`],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(`${surveyType}_samples`)
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

  // Filter sample options based on selected kecamatan and desa
  const filteredSamples = samples.filter(
    (sample) =>
      (!selectedKecamatan || sample.kecamatan === selectedKecamatan) &&
      (!selectedDesa || sample.desa_kelurahan === selectedDesa)
  );

  const sampleOptions = filteredSamples.map((sample) => ({
    value: sample.sample_code,
    label: sample.sample_code,
  }));

  const form = useForm({
    defaultValues: {
      sample_code: initialData?.sample_code || "",
      status: initialData?.status || "belum",
      families_before: initialData?.families_before || 0,
      families_after: initialData?.families_after || 0,
      households_after: initialData?.households_after || 0,
    },
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        sample_code: initialData.sample_code,
        status: initialData.status || "belum",
        families_before: initialData.families_before || 0,
        families_after: initialData.families_after || 0,
        households_after: initialData.households_after || 0,
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
      const updateData = { ...data };

      if (initialData?.id) {
        const { error } = await supabase
          .from(`${surveyType}_updates`)
          .update(updateData)
          .eq("id", initialData.id);

        if (error) throw error;
        toast.success("Data pemutakhiran berhasil diperbarui");
      } else {
        const { error } = await supabase
          .from(`${surveyType}_updates`)
          .insert([updateData]);

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
        .from(`${surveyType}_updates`)
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
            {initialData?.id ? "Edit" : "Tambah"} Data Pemutakhiran
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
                  form.setValue("sample_code", ""); // Reset sample code
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
                  <FormLabel>Nomor Kode Sampel</FormLabel>
                  <FormControl>
                    <Controller
                      name="sample_code"
                      control={form.control}
                      render={({ field }) => (
                        <Select
                          isDisabled={!selectedDesa || !!initialData}
                          options={sampleOptions}
                          value={sampleOptions.find(
                            (option) => option.value === field.value
                          )}
                          onChange={(option) => field.onChange(option?.value)}
                          placeholder="Pilih NKS..."
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
              name="families_before"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Jumlah Keluarga Sebelum Pemutakhiran (Blok II)
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
              name="families_after"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Jumlah Keluarga Hasil pemutakhiran (Blok II)
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
              name="households_after"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Jumlah Rumah Tangga Hasil Pemutakhiran (Blok II)
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
                  <FormLabel>Sudah Selesai Dimutakhirkan</FormLabel>
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