import {
  DashboardPodes25Section,
  InputPplPodes25Section,
} from "@/components/ansos/Podes25Section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Podes25() {
  return (
    <div className="container pt-4 px-2 md:px-8 max-w-full">
      <Tabs defaultValue="dashboardPodes25" className="space-y-6">
        <TabsList className="w-full border-b border-gray-200 space-x-4 md:space-x-8 p-0 h-auto bg-transparent overflow-x-auto">
          <TabsTrigger
            value="dashboardPodes25"
            className="px-3 md:px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent font-medium whitespace-nowrap"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="inputPplPodes25"
            className="px-3 md:px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent font-medium whitespace-nowrap"
          >
            PPL Input
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dashboardPodes25">
          <DashboardPodes25Section />
        </TabsContent>
        <TabsContent value="inputPplPodes25">
          <InputPplPodes25Section />
        </TabsContent>
      </Tabs>
    </div>
  );
}
