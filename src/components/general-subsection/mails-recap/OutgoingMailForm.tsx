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
import {
  LETTER_CLASSIFICATIONS,
  DELIVERY_METHODS,
  TEAM_OPTIONS,
} from "./types";
import { useIncomingLettersForReference } from "./hooks/useIncomingLettersForReference";
import { useEffect } from "react";

export function OutgoingMailFormFields({ form }: { form: any }) {
  const { data: referenceLetters = [] } = useIncomingLettersForReference();
  // Reset reference field when is_reply_letter changes to false
  useEffect(() => {
    const isReplyLetter = form.watch("is_reply_letter");
    if (!isReplyLetter) {
      form.setValue("reference", null);
    }
  }, [form.watch("is_reply_letter")]);

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
            <FormLabel>Pengirim</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Pilih tim pengirim" />
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
        name="destination"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tujuan</FormLabel>
            <FormControl>
              <Input placeholder="Masukkan alamat pengiriman surat" {...field} />
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
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Pilih klasifikasi surat" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white">
                {Object.entries(LETTER_CLASSIFICATIONS).map(
                  ([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  )
                )}
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
            <FormLabel>Uraian</FormLabel>
            <FormControl>
              <Input placeholder="Masukkan sumber surat" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="delivery_method"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Keterangan</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Pilih metode pengiriman" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white">
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
            <div className="space-y-1 leading-none">
              <FormLabel>Surat Balasan</FormLabel>
            </div>
          </FormItem>
        )}
      />

      {form.watch("is_reply_letter") && (
        <FormField
          control={form.control}
          name="reference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Referensi</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Pilih surat referensi" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                  {referenceLetters.map((letter) => (
                    <SelectItem key={letter.number} value={letter.number}>
                      {letter.number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
