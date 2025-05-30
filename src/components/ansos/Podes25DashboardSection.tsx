import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PemutakhiranChart } from "./PemutakhiranChart";
// import { PencacahanChart } from "./PencacahanChart";
// import { PemeriksaanChart } from "./PemeriksaanChart";
import { PplMonitoringTable } from "./PplMonitoringTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DashboardPodes25Section() {
  // Query to get all samples and their updates
  const { data: samples = [] } = useQuery({
    queryKey: ["podes25_samples_dashboard"],
    queryFn: async () => {
      const { data: allSamples, error: samplesError } = await supabase
        .from("podes25_samples")
        .select("*");

      if (samplesError) throw samplesError;

      const { data: updates, error: updatesError } = await supabase
        .from("podes25_updates")
        .select("*");

      if (updatesError) throw updatesError;

      // Create a map of updates by sample_code
      const updatesMap = new Map();
      updates?.forEach((update) => {
        if (!updatesMap.has(update.sample_code)) {
          updatesMap.set(update.sample_code, update);
        }
      });

      // Combine samples with their updates
      return allSamples.map((sample) => {
        const update = updatesMap.get(sample.sample_code);
        if (!update) return { ...sample }; // No update record = "Belum Input"
        return {
          ...sample,
          status: update.status || 'belum', // If has update but no status = "Belum Selesai"
        };
      });
    },
  });

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm pt-6">
        <h3 className="text-xl font-semibold px-6 pb-3">Progress Input</h3>
        <div className="grid md:grid-cols-3">
          <PemutakhiranChart data={samples} surveyType={"podes25"} />
          {/* <PencacahanChart data={cacahs} />
          <PemeriksaanChart data={periksas} /> */}
        </div>
      </div>

      <div className="bg-white mt-6 rounded-lg shadow-sm py-6">
        <h3 className="text-xl font-semibold px-6 pb-3">Progress Harian</h3>
        <Tabs defaultValue="pemutakhiran" className="w-full">
          <TabsList className="w-full inline-flex p-1 bg-muted/10 gap-2 rounded-t-lg border-b">
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
          <div className="p-6">
            <TabsContent value="pemutakhiran">
              <PplMonitoringTable type="pemutakhiran" surveyType="podes25" />
            </TabsContent>
            {/* <TabsContent value="pencacahan">
              <PplMonitoringTable type="pencacahan" />
            </TabsContent> */}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
