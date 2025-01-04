import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IncomingMailFormFields } from "./IncomingMailFormFields";
import { OutgoingMailFormFields } from "./OutgoingMailFormFields";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { IncomingMail, OutgoingMail } from "./types";

type MailFormType = "incoming" | "outgoing";

interface AddMailFormProps {
  type: MailFormType;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: IncomingMail | OutgoingMail;
}

export function AddMailForm({ type, isOpen, onClose, onSuccess, initialData }: AddMailFormProps) {
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
      is_reply_letter: false,
      reference: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const table = type === "incoming" ? "incoming_mails" : "outgoing_mails";
      
      if (initialData?.id) {
        const { error } = await supabase
          .from(table)
          .update(data)
          .eq('id', initialData.id);

        if (error) throw error;
        toast.success(`${type === "incoming" ? "Surat masuk" : "Surat keluar"} berhasil diperbarui`);
      } else {
        const { error } = await supabase
          .from(table)
          .insert([data]);

        if (error) throw error;
        toast.success(`${type === "incoming" ? "Surat masuk" : "Surat keluar"} berhasil ditambahkan`);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving mail:", error);
      toast.error(`Gagal ${initialData?.id ? "memperbarui" : "menambahkan"} surat`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData?.id ? "Edit" : "Tambah"} {type === "incoming" ? "Surat Masuk" : "Surat Keluar"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {type === "incoming" ? (
              <IncomingMailFormFields form={form} />
            ) : (
              <OutgoingMailFormFields form={form} />
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