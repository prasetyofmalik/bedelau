import { DashboardPodes25Section as DashboardContent } from "./Podes25DashboardSection";
import { MutakhirSection } from "./MutakhirSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DashboardPodes25Section() {
  return <DashboardContent />;
}

export function InputPplPodes25Section() {
  return (
    <Tabs defaultValue="pemutakhiran" className="space-y-6">
      <TabsList className="inline-flex p-1 bg-muted/10 rounded-lg gap-2">
        <TabsTrigger
          value="pemutakhiran"
          className="rounded-md px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
        >
          Pemutakhiran
        </TabsTrigger>
      </TabsList>
      <TabsContent value="pemutakhiran">
        <MutakhirSection surveyType="podes25" />
      </TabsContent>
    </Tabs>
  );
}