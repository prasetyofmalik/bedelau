import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function SKFormFields({ form }: { form: any }) {
  // Set employee_id from session when component mounts
  useEffect(() => {
    const setEmployeeId = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        form.setValue("employee_id", session.user.id);
      }
    };
    setEmployeeId();
  }, []);

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
            <FormMessage />
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
              <Input type="month" {...field} />
            </FormControl>
            <FormMessage />
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
            <FormMessage />
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
              <Textarea placeholder="Masukkan uraian SK" {...field} />
            </FormControl>
            <FormMessage />
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
              <Input placeholder="Masukkan link Google Drive" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}