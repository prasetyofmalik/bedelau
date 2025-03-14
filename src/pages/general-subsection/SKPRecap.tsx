import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import SKPSection from "../../components/general-subsection/SKPSection";

const SKPRecap: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Rekap SKP</h1>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <Tabs defaultValue="skp" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="skp">SKP</TabsTrigger>
            </TabsList>
            <TabsContent value="skp">
              <SKPSection />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default SKPRecap;
