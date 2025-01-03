import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STATUS_OPTIONS, TEAM_OPTIONS } from "./types";

export function OutgoingMailFormFields({ form }: { form: any }) {
  return (
    <>
      <FormField
        control={form.control}
        name="number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nomor Surat</FormLabel>
            <FormControl>
              <Input placeholder="Masukkan nomor surat" {...field} />
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
            <FormLabel>Tanggal</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="origin"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Asal Tim</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Pilih asal tim" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white">
                {TEAM_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
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
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Deskripsi</FormLabel>
            <FormControl>
              <Textarea placeholder="Masukkan deskripsi surat" {...field} />
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
            <FormLabel>Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white">
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
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
        name="reference"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Referensi</FormLabel>
            <FormControl>
              <Input placeholder="Masukkan referensi" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}