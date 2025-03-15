import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { SKPFormProps } from "./skp-types";
import { useEmployees } from "./hooks/useEmployees";

export function SKPForm({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: SKPFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: employees = [], isLoading: isLoadingEmployees } =
    useEmployees();

  const form = useForm({
    defaultValues: {
      employee_id: initialData?.employee_id || "",
      employee_name: initialData?.employee_name || "",
      skp_type: initialData?.skp_type || "yearly",
      period: initialData?.period || "penetapan",
      document_link: initialData?.document_link || "",
    },
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        employee_id: initialData.employee_id,
        employee_name: initialData.employee_name,
        skp_type: initialData.skp_type,
        period: initialData.period,
        document_link: initialData.document_link,
      });
    } else {
      form.reset({
        employee_id: "",
        employee_name: "",
        skp_type: "yearly",
        period: "penetapan",
        document_link: "",
      });
    }
  }, [initialData, form]);

  const skpType = form.watch("skp_type");

  // Employee options for Select component
  const employeeOptions = employees.map((employee) => ({
    value: employee.id,
    label: employee.full_name,
  }));

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // For current user, get their ID
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      const skpData = {
        employee_id: userId,
        employee_name: data.employee_name,
        skp_type: data.skp_type,
        period: data.period,
        document_link: data.document_link,
      };

      if (initialData?.id) {
        const { error } = await supabase
          .from("skp_documents")
          .update(skpData)
          .eq("id", initialData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("skp_documents")
          .insert([skpData]);

        if (error) throw error;
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving SKP document:", error);
      toast.error(
        `Gagal ${initialData?.id ? "memperbarui" : "menambahkan"} dokumen SKP`
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
        .from("skp_documents")
        .delete()
        .eq("id", initialData.id);

      if (error) throw error;
      toast.success("Dokumen SKP berhasil dihapus");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error deleting SKP document:", error);
      toast.error("Gagal menghapus dokumen SKP");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle employee selection
  const handleEmployeeChange = (selectedOption: any) => {
    form.setValue("employee_id", selectedOption?.value || "");
    form.setValue("employee_name", selectedOption?.label || "");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData?.id ? "Edit" : "Tambah"} Dokumen SKP
          </DialogTitle>
          <DialogDescription>
            Isi detail dokumen SKP di bawah ini
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="employee_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Pegawai</FormLabel>
                  <FormControl>
                    <Select
                      isLoading={isLoadingEmployees}
                      options={employeeOptions}
                      value={employeeOptions.find(
                        (option) => option.label === field.value
                      )}
                      onChange={handleEmployeeChange}
                      placeholder="Pilih Pegawai..."
                      isClearable
                      isSearchable
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="skp_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe SKP</FormLabel>
                  <UISelect
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Reset period when type changes
                      form.setValue(
                        "period",
                        value === "yearly" ? "penetapan" : "01"
                      );
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe SKP" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="yearly">Tahunan</SelectItem>
                      <SelectItem value="monthly">Bulanan</SelectItem>
                    </SelectContent>
                  </UISelect>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Periode</FormLabel>
                  <UISelect onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih periode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {skpType === "yearly" ? (
                        <>
                          <SelectItem value="penetapan">Penetapan</SelectItem>
                          <SelectItem value="penilaian">Penilaian</SelectItem>
                          <SelectItem value="evaluasi">Evaluasi</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="01">Januari</SelectItem>
                          <SelectItem value="02">Februari</SelectItem>
                          <SelectItem value="03">Maret</SelectItem>
                          <SelectItem value="04">April</SelectItem>
                          <SelectItem value="05">Mei</SelectItem>
                          <SelectItem value="06">Juni</SelectItem>
                          <SelectItem value="07">Juli</SelectItem>
                          <SelectItem value="08">Agustus</SelectItem>
                          <SelectItem value="09">September</SelectItem>
                          <SelectItem value="10">Oktober</SelectItem>
                          <SelectItem value="11">November</SelectItem>
                          <SelectItem value="12">Desember</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </UISelect>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="document_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link Dokumen Google Drive</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://drive.google.com/..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between items-center pt-2">
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
                  {isSubmitting
                    ? "Menyimpan..."
                    : initialData?.id
                    ? "Update"
                    : "Simpan"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
