import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IncomingMailSection,
  OutgoingMailSection,
} from "@/components/general-subsection/mails-recap/MailSection";
import { SKSection } from "@/components/general-subsection/mails-recap/SKSection";

export default function MailsRecap() {
  return (
    <div className="container pt-4 px-2 md:px-8 max-w-full">
      <Tabs defaultValue="incoming" className="space-y-6 mt-6">
        <TabsList className="w-full border-b border-gray-200 space-x-8 p-0 h-auto bg-transparent">
          <TabsTrigger
            value="incoming"
            className="px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent font-medium"
          >
            Surat Masuk
          </TabsTrigger>
          <TabsTrigger
            value="outgoing"
            className="px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent font-medium"
          >
            Surat Keluar
          </TabsTrigger>
          <TabsTrigger
            value="sk"
            className="px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent font-medium"
          >
            SK
          </TabsTrigger>
        </TabsList>
        <TabsContent value="incoming" className="mt-6">
          <IncomingMailSection />
        </TabsContent>
        <TabsContent value="outgoing" className="mt-6">
          <OutgoingMailSection />
        </TabsContent>
        <TabsContent value="sk" className="mt-6">
          <SKSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
