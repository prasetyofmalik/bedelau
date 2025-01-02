import { useState } from "react";
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IncomingMailSection } from "@/components/general-subsection/IncomingMailSection";
import { OutgoingMailSection } from "@/components/general-subsection/OutgoingMailSection";

export default function GeneralSubsection() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="container py-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Subbagian Umum</h1>
        </div>

        <Tabs defaultValue="incoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="incoming">Surat Masuk</TabsTrigger>
            <TabsTrigger value="outgoing">Surat Keluar</TabsTrigger>
          </TabsList>
          <TabsContent value="incoming">
            <IncomingMailSection />
          </TabsContent>
          <TabsContent value="outgoing">
            <OutgoingMailSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}