import { DashboardSupas25Section as DashboardContent } from "./Supas25DashboardSection";
import { MutakhirSection } from "./MutakhirSection";
import { CacahSection } from "./CacahSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DashboardSupas25Section() {
  return <DashboardContent />;
}

export function InputPplSupas25Section() {
  return (
    <Tabs defaultValue="pencacahan" className="space-y-6">
      <TabsList className="inline-flex p-1 bg-muted/10 rounded-lg gap-2">
        <TabsTrigger
          value="pemutakhiran"
          className="rounded-md px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
        >
          Pemutakhiran
        </TabsTrigger>
        <TabsTrigger
          value="pencacahan"
          className="rounded-md px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
        >
          Pencacahan
        </TabsTrigger>
      </TabsList>
      <TabsContent value="pemutakhiran">
        <MutakhirSection surveyType="supas25" />
      </TabsContent>
      <TabsContent value="pencacahan">
        <CacahSection surveyType="supas25" />
      </TabsContent>
    </Tabs>
  );
}