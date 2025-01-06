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
  DialogDescription,
} from "@/components/ui/dialog";
import { IncomingMailFormFields } from "./IncomingMailFormFields";
import { OutgoingMailFormFields } from "./OutgoingMailFormFields";
import { SKFormFields } from "./SKFormFields";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { IncomingMail, OutgoingMail, SK, MailFormType } from "./types";

interface AddMailFormProps {
  type: MailFormType;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: IncomingMail | OutgoingMail | SK;
}

export function AddMailForm({ type, isOpen, onClose, onSuccess, initialData }: AddMailFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    defaultValues: 
      type === "incoming" ? {
        number: "",
        date: "",
        sender: "",
        classification: "",
        disposition: "",
        disposition_date: "",
      } : 
      type === "outgoing" ? {
        number: "",
        date: "",
        origin: "",
        description: "",
        is_reply_letter: false,
        reference: "",
      } : {
        number: "",
        date: "",
        month_year: "",
        description: "",
        link: "",
      }
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      let table;
      let cleanedData;
      
      switch(type) {
        case "incoming":
          table = "incoming_mails";
          cleanedData = {
            ...data,
            date: data.date || null,
            disposition_date: data.disposition_date || null
          };
          break;
        case "outgoing":
          table = "outgoing_mails";
          cleanedData = {
            ...data,
            date: data.date || null
          };
          break;
        case "sk":
          table = "sk_documents";
          cleanedData = {
            ...data,
            date: data.date || null
          };
          break;
        default:
          throw new Error("Invalid mail type");
      }
      
      if (initialData?.id) {
        const { error } = await supabase
          .from(table)
          .update(cleanedData)
          .eq('id', initialData.id);

        if (error) throw error;
        toast.success(`${type === "incoming" ? "Surat masuk" : type === "outgoing" ? "Surat keluar" : "SK"} berhasil diperbarui`);
      } else {
        const { error } = await supabase
          .from(table)
          .insert([cleanedData]);

        if (error) throw error;
        toast.success(`${type === "incoming" ? "Surat masuk" : type === "outgoing" ? "Surat keluar" : "SK"} berhasil ditambahkan`);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving mail:", error);
      toast.error(`Gagal ${initialData?.id ? "memperbarui" : "menambahkan"} ${type === "incoming" ? "surat masuk" : type === "outgoing" ? "surat keluar" : "SK"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData?.id ? "Edit" : "Tambah"} {
              type === "incoming" ? "Surat Masuk" : 
              type === "outgoing" ? "Surat Keluar" : 
              "SK"
            }
          </DialogTitle>
          <DialogDescription>
            {type === "incoming" ? "Isi detail surat masuk di bawah ini" :
             type === "outgoing" ? "Isi detail surat keluar di bawah ini" :
             "Isi detail SK di bawah ini"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {type === "incoming" ? (
              <IncomingMailFormFields form={form} />
            ) : type === "outgoing" ? (
              <OutgoingMailFormFields form={form} />
            ) : (
              <SKFormFields form={form} />
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