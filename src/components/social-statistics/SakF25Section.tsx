import { DashboardSakF25Section as DashboardContent } from "./SakF25DashboardSection";
import { MutakhirSection } from "./SakF25MutakhirSection";
// import { CacahSection } from "./CacahSection";
// import { PeriksaSection } from "./PeriksaSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DashboardSakF25Section() {
  return <DashboardContent />;
}

export function InputPplSakF25Section() {
  return (
    <Tabs defaultValue="pemutakhiran" className="space-y-6">
      <TabsList className="inline-flex p-1 bg-muted/10 rounded-lg gap-2">
        <TabsTrigger
          value="pemutakhiran"
          className="rounded-md px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
        >
          Pemutakhiran
        </TabsTrigger>
        {/* <TabsTrigger
          value="pencacahan"
          className="rounded-md px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
        >
          Pencacahan
        </TabsTrigger> */}
      </TabsList>
      <TabsContent value="pemutakhiran">
        <MutakhirSection />
      </TabsContent>
      {/* <TabsContent value="pencacahan">
        <CacahSection />
      </TabsContent> */}
    </Tabs>
  );
}

// export function InputPmlSsnM25Section() {
//   return (
//     <Tabs defaultValue="pemeriksaan" className="space-y-6">
//       <TabsList className="inline-flex p-1 bg-muted/10 rounded-lg gap-2">
//         <TabsTrigger
//           value="pemeriksaan"
//           className="rounded-md px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
//         >
//           Pemeriksaan
//         </TabsTrigger>
//       </TabsList>
//       <TabsContent value="pemeriksaan">
//         <PeriksaSection />
//       </TabsContent>
//     </Tabs>
//   );
// }
