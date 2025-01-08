import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LETTER_CLASSIFICATIONS, DELIVERY_METHODS } from "./OutgoingMailTable";

export function OutgoingMailFormFields({ form }: { form: any }) {
  return (
    <div className="space-y-4">
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
            <FormLabel>Sumber</FormLabel>
            <FormControl>
              <Input placeholder="Masukkan sumber surat" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="destination"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tujuan</FormLabel>
            <FormControl>
              <Input placeholder="Masukkan tujuan surat" {...field} />
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
              <Input placeholder="Masukkan uraian surat" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="classification"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Klasifikasi</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih klasifikasi surat" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.entries(LETTER_CLASSIFICATIONS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
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
        name="delivery_method"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Metode Pengiriman</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih metode pengiriman" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.entries(DELIVERY_METHODS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
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
        name="is_reply_letter"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel>Surat Balasan</FormLabel>
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
              <Input placeholder="Masukkan referensi surat" {...field} />
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
            <FormLabel>Link File</FormLabel>
            <FormControl>
              <Input placeholder="Masukkan link file surat" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}