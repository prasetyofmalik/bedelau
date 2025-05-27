import { DashboardSeruti25Section as DashboardContent } from "./Seruti25DashboardSection";
import { CacahSection } from "./CacahSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DashboardSeruti25Section() {
  return <DashboardContent />;
}

export function InputPplSeruti25Section() {
  return (
    <Tabs defaultValue="pencacahan" className="space-y-6">
      <TabsList className="inline-flex p-1 bg-muted/10 rounded-lg gap-2">
        <TabsTrigger
          value="pencacahan"
          className="rounded-md px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
        >
          Pencacahan
        </TabsTrigger>
      </TabsList>
      <TabsContent value="pencacahan">
        <CacahSection surveyType="seruti25" />
      </TabsContent>
    </Tabs>
  );
}
