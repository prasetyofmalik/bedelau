import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { TEAM_OPTIONS } from "./types";
import { useIncomingLettersForReference } from "./hooks/useIncomingLettersForReference";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function OutgoingMailFormFields({ form }: { form: any }) {
  const { data: referenceLetters = [] } = useIncomingLettersForReference();

  // Reset reference field when is_reply_letter changes to false
  useEffect(() => {
    const isReplyLetter = form.watch("is_reply_letter");
    if (!isReplyLetter) {
      form.setValue("reference", null);
      form.setValue("destination", "");
    }
  }, [form.watch("is_reply_letter")]);

  // Set destination from sender when reference changes
  useEffect(() => {
    const reference = form.watch("reference");
    if (reference) {
      const referencedLetter = referenceLetters.find(letter => letter.number === reference);
      if (referencedLetter) {
        form.setValue("destination", referencedLetter.sender);
      }
    }
  }, [form.watch("reference"), referenceLetters]);

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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Pilih sumber tim" />
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
            <FormLabel>Uraian</FormLabel>
            <FormControl>
              <Textarea placeholder="Masukkan uraian surat" {...field} />
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
              <FormLabel>
                Surat Balasan
              </FormLabel>
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
    </>
  );
}