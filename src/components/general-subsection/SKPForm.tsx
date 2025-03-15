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
      folder_link: initialData?.folder_link || "",
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
        folder_link: initialData.folder_link || "",
      });
    } else {
      form.reset({
        employee_id: "",
        employee_name: "",
        skp_type: "yearly",
        period: "penetapan",
        document_link: "",
        folder_link: "",
      });
    }
  }, [initialData, form]);

  const skpType = form.watch("skp_type");
  const period = form.watch("period");

  // Generate default folder link based on type and period
  useEffect(() => {
    if (
      !form.getValues("folder_link") ||
      form.getValues("folder_link") === ""
    ) {
      const folderLink = generateFolderLink(skpType, period);
      form.setValue("folder_link", folderLink);
    }
  }, [skpType, period, form]);

  const generateFolderLink = (type: string, period: string): string => {
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

      const skpData = {
        employee_id: userId,
        employee_name: data.employee_name,
        skp_type: data.skp_type,
        period: data.period,
        document_link: data.document_link,
        folder_link: data.folder_link,
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
                      // Update folder link when type changes
                      const newFolderLink = generateFolderLink(
                        value,
                        value === "yearly" ? "penetapan" : "01"
                      );
                      form.setValue("folder_link", newFolderLink);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Pilih tipe SKP" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
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
                  <UISelect
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Update folder link when period changes
                      const newFolderLink = generateFolderLink(skpType, value);
                      form.setValue("folder_link", newFolderLink);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Pilih periode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white">
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
              name="folder_link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link Folder SKP</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://drive.google.com/drive/folders/..."
                    />
                  </FormControl>
                  <FormDescription>
                    Gunakan folder ini untuk menyimpan dokumen SKP Anda secara
                    terstruktur
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="document_link"
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
