import {
  DashboardSsnM25Section,
  InputPplSsnM25Section,
  InputPmlSsnM25Section,
} from "@/components/social-statistics/SsnM25Section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SsnM25() {
  return (
    <div className="container pt-4 px-2 md:px-8 max-w-full">
      <Tabs defaultValue="dashboardSsnM25" className="space-y-6">
        <TabsList className="w-full border-b border-gray-200 space-x-4 md:space-x-8 p-0 h-auto bg-transparent overflow-x-auto">
          <TabsTrigger
            value="dashboardSsnM25"
            className="px-3 md:px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent font-medium whitespace-nowrap"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="inputPplSsnM25"
            className="px-3 md:px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent font-medium whitespace-nowrap"
          >
            PPL Input
          </TabsTrigger>
          <TabsTrigger
            value="inputPmlSsnM25"
            className="px-3 md:px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent font-medium whitespace-nowrap"
          >
            PML Input
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dashboardSsnM25">
          <DashboardSsnM25Section />
        </TabsContent>
        <TabsContent value="inputPplSsnM25">
          <InputPplSsnM25Section />
        </TabsContent>
        <TabsContent value="inputPmlSsnM25">
          <InputPmlSsnM25Section />
        </TabsContent>
      </Tabs>
    </div>
  );
}