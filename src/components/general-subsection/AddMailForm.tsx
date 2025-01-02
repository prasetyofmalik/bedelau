import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IncomingMail, OutgoingMail, LETTER_TYPES } from "./types";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

type MailFormType = "incoming" | "outgoing";

interface AddMailFormProps {
  type: MailFormType;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddMailForm({ type, isOpen, onClose, onSuccess }: AddMailFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    defaultValues: type === "incoming" ? {
      number: "",
      date: "",
      sender: "",
      classification: "",
      disposition: "",
      disposition_date: "",
    } : {
      number: "",
      date: "",
      origin: "",
      description: "",
      status: "",
      reference: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from(type === "incoming" ? "incoming_mails" : "outgoing_mails")
        .insert([data]);

      if (error) throw error;

      toast.success(`${type === "incoming" ? "Surat masuk" : "Surat keluar"} berhasil ditambahkan`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding mail:", error);
      toast.error("Gagal menambahkan surat");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Tambah {type === "incoming" ? "Surat Masuk" : "Surat Keluar"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            {type === "incoming" ? (
              <>
                <FormField
                  control={form.control}
                  name="sender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pengirim</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama pengirim" {...field} />
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
                          {Object.entries(LETTER_TYPES).map(([key, { label }]) => (
                            <SelectItem key={key} value={key}>
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
                  name="disposition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disposisi</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan disposisi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="disposition_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Disposisi</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asal Tim</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan asal tim" {...field} />
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
                      <FormControl>
                        <Input placeholder="Masukkan status" {...field} />
                      </FormControl>
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
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}