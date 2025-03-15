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
  FormDescription,
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
import { SKPFormProps, YearlySKP, MonthlySKP } from "./skp-types";
import { useEmployees } from "./hooks/useEmployees";
import { ExternalLink, Folder } from "lucide-react";

export function SKPForm({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  type,
}: SKPFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: employees = [], isLoading: isLoadingEmployees } =
    useEmployees();

  const form = useForm({
    defaultValues: {
      employee_id: initialData?.employee_id || "",
      employee_name: initialData?.employee_name || "",
      period: initialData?.period || (type === "yearly" ? "penetapan" : "01"),
      skp_link: (initialData as any)?.skp_link || "",
      ckp_link:
        type === "monthly" ? (initialData as MonthlySKP)?.ckp_link || "" : "",
    },
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      form.reset({
        employee_id: initialData.employee_id,
        employee_name: initialData.employee_name,
        period: initialData.period,
        skp_link: (initialData as any).skp_link || "",
        ckp_link:
          type === "monthly" ? (initialData as MonthlySKP)?.ckp_link || "" : "",
      });
    } else {
      form.reset({
        employee_id: "",
        employee_name: "",
        period: type === "yearly" ? "penetapan" : "01",
        skp_link: "",
        ckp_link: "",
      });
    }
  }, [initialData, form, type]);

  const period = form.watch("period");

  const generateFolderLink = (
    type: "yearly" | "monthly",
    period: string
  ): string => {
    const baseLink = "https://drive.google.com/drive/folders/";

    if (type === "yearly") {
      const periodLinks: Record<string, string> = {
        penetapan: "1-mho2qgn1d0O7TEDzhO_6nk1r0BdaqZa",
        penilaian: "1Nn4yhH7dzZfuSRZC3RI2BYKC_nngL7B9",
        evaluasi: "1S5r73B6X5AaQGvmJkdQlS6IeR7DDZKcD",
      };
      return `${baseLink}${periodLinks[period] || period}`;
    } else {
      const monthLinks: Record<string, string> = {
        "01": "17MDMvWEqjNSuKfFf7Slp77bWfi_k4OX7",
        "02": "1lfL_22cRzXzVBkSZ86RaBwGxUr3EAQqx",
        "03": "1e1nuUtHqtnKgxUiS7w96QUs6hRfRsULf",
        "04": "1W2gjwrw2bWvgwUS1FRzZuLB8_ppwTmlB",
        "05": "1NonwxNHBu8Vt_xA8e8fsmLKV8P20MkmG",
        "06": "1bIKyj7sBbRRg1FXf8WCtIGltAyJc7LMI",
        "07": "1hd08kxogHcJqoheUtW-bBsIRIaA3tTgu",
        "08": "1Ry-NvemBAgRvgbWafdZyp4JH6c_k4aYV",
        "09": "1w2TQlvfHyRmb3bwiwC6FRvkgpvpQi9w0",
        "10": "1iwJ_q-laTbLAvbz_tf_f6Eb0B0op86i8",
        "11": "1L7e87ohaaQb6rnj_YMO8m0EBbGHanoCY",
        "12": "1VCmhndPixoKj56K9Atv_ZtrOYgbyeFO5",
      };
      return `${baseLink}${monthLinks[period] || period}`;
    }
  };

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

      // Only save required fields to Supabase
      const tableName = type === "yearly" ? "skp_yearly" : "skp_monthly";

      const skpData: any = {
        employee_id: userId,
        employee_name: data.employee_name,
        period: data.period,
        skp_link: data.skp_link,
      };

      // Add ckp_link only for monthly SKP
      if (type === "monthly") {
        skpData.ckp_link = data.ckp_link;
      }

      if (initialData?.id) {
        const { error } = await supabase
          .from(tableName)
          .update(skpData)
          .eq("id", initialData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from(tableName).insert([skpData]);

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
      const tableName = type === "yearly" ? "skp_yearly" : "skp_monthly";

      const { error } = await supabase
        .from(tableName)
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

  const folderLink = generateFolderLink(type, period);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData?.id ? "Edit" : "Tambah"} Dokumen SKP{" "}
            {type === "yearly" ? "Tahunan" : "Bulanan"}
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
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Periode</FormLabel>
                  <Select
                    options={
                      type === "yearly"
                        ? [
                            { value: "penetapan", label: "Penetapan" },
                            { value: "penilaian", label: "Penilaian" },
                            { value: "evaluasi", label: "Evaluasi" },
                          ]
                        : [
                            { value: "01", label: "Januari" },
                            { value: "02", label: "Februari" },
                            { value: "03", label: "Maret" },
                            { value: "04", label: "April" },
                            { value: "05", label: "Mei" },
                            { value: "06", label: "Juni" },
                            { value: "07", label: "Juli" },
                            { value: "08", label: "Agustus" },
                            { value: "09", label: "September" },
                            { value: "10", label: "Oktober" },
                            { value: "11", label: "November" },
                            { value: "12", label: "Desember" },
                          ]
                    }
                    value={
                      type === "yearly"
                        ? [
                            { value: "penetapan", label: "Penetapan" },
                            { value: "penilaian", label: "Penilaian" },
                            { value: "evaluasi", label: "Evaluasi" },
                          ].find((option) => option.value === field.value)
                        : [
                            { value: "01", label: "Januari" },
                            { value: "02", label: "Februari" },
                            { value: "03", label: "Maret" },
                            { value: "04", label: "April" },
                            { value: "05", label: "Mei" },
                            { value: "06", label: "Juni" },
                            { value: "07", label: "Juli" },
                            { value: "08", label: "Agustus" },
                            { value: "09", label: "September" },
                            { value: "10", label: "Oktober" },
                            { value: "11", label: "November" },
                            { value: "12", label: "Desember" },
                          ].find((option) => option.value === field.value)
                    }
                    onChange={(selectedOption) => {
                      field.onChange(selectedOption?.value);
                    }}
                    placeholder="Pilih periode..."
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>
                Folder {type === "yearly" ? "SKP" : "SKP/CKP"}
              </FormLabel>
              <div className="flex items-center space-x-2">
                <a
                  href={folderLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 bg-gray-100 rounded-md text-blue-600 hover:text-blue-800 border border-gray-300"
                >
                  <Folder className="mr-2 h-4 w-4" />
                  Buka Folder Google Drive
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
              <FormDescription>
                Gunakan folder ini untuk menyimpan dokumen SKP
                {type === "monthly" ? " dan CKP" : ""} Anda secara terstruktur
              </FormDescription>
            </FormItem>

            <FormField
              control={form.control}
              name="skp_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link Dokumen SKP</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://drive.google.com/..."
                    />
                  </FormControl>
                  <FormDescription>
                    Link ke dokumen SKP yang telah Anda upload ke Google Drive
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {type === "monthly" && (
              <FormField
                control={form.control}
                name="ckp_link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link Dokumen CKP</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://drive.google.com/..."
                      />
                    </FormControl>
                    <FormDescription>
                      Link ke dokumen CKP yang telah Anda upload ke Google Drive
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
