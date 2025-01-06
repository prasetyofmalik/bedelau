import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface SKFormFieldsProps {
  form: UseFormReturn<any>;
}

export function SKFormFields({ form }: SKFormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nomor SK</FormLabel>
            <FormControl>
              <Input placeholder="Masukkan nomor SK" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="month_year"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bulan/Tahun</FormLabel>
            <FormControl>
              <Input placeholder="YYYY-MM" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tanggal SK</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Uraian</FormLabel>
            <FormControl>
              <Input placeholder="Masukkan uraian SK" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="link"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Link Dokumen</FormLabel>
            <FormControl>
              <Input placeholder="Masukkan link dokumen" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
}