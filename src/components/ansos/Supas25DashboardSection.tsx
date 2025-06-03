import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PemutakhiranChart } from "./PemutakhiranChart";
import { PencacahanChart } from "./PencacahanChart";
import { PplMonitoringTable } from "./PplMonitoringTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DashboardSupas25Section() {
  // Query to get all samples and their updates
  const { data: samples = [] } = useQuery({
    queryKey: ["supas25_samples_dashboard"],
    queryFn: async () => {
      const { data: allSamples, error: samplesError } = await supabase
        .from("supas25_samples")
        .select("*");

      if (samplesError) throw samplesError;

      const { data: updates, error: updatesError } = await supabase
        .from("supas25_updates")
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

  const { data: cacahs = [] } = useQuery({
    queryKey: ["supas25_cacah_dashboard"],
    queryFn: async () => {
      const { data: allSamples, error: samplesError } = await supabase
        .from("supas25_samples")
        .select("*");

      if (samplesError) throw samplesError;

      const { data: cacahData, error: cacahError } = await supabase
        .from("supas25_cacah")
        .select("*");

      if (cacahError) throw cacahError;

      // Create an array to store all expected ruta entries (10 per NKS)
      const expectedRutaEntries = [];
      allSamples?.forEach((sample) => {
        for (let i = 1; i <= 10; i++) {
          expectedRutaEntries.push({
            sample_code: sample.sample_code,
            no_ruta: i,
            status: null, // Initialize with null for "Belum Input"
          });
        }
      });

      // Create a map of existing cacah entries
      const cacahMap = new Map();
      cacahData?.forEach((cacah) => {
        const key = `${cacah.sample_code}_${cacah.no_ruta}`;
        cacahMap.set(key, cacah);
      });

      // Map expected entries to actual status
      return expectedRutaEntries.map((entry) => {
        const key = `${entry.sample_code}_${entry.no_ruta}`;
        const existingCacah = cacahMap.get(key);
        if (!existingCacah) return entry; // Keep as "Belum Input" (null)
        return {
          ...entry,
          status: existingCacah.status || 'belum', // If exists but no status = "Belum Selesai",
        };
      });
    },
  });

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm py-6">
        <h3 className="text-xl font-semibold px-6 pb-3">Progress Input</h3>
        <div className="grid md:grid-cols-3">
          <PemutakhiranChart data={samples} surveyType={"supas25"} />
          <PencacahanChart data={cacahs} surveyType={"supas25"} />
        </div>
      </div>

      <div className="bg-white mt-6 rounded-lg shadow-sm pt-6">
        <h3 className="text-xl font-semibold px-6 pb-3">Progress Harian</h3>
        <Tabs defaultValue="pencacahan" className="w-full">
          <TabsList className="w-full inline-flex p-1 bg-muted/10 gap-2 rounded-t-lg border-b">
            <TabsTrigger
              value="pemutakhiran"
              className="rounded-md px-2 md:px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              Pemutakhiran
            </TabsTrigger>
            <TabsTrigger
              value="pencacahan"
              className="rounded-md px-2 md:px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              Pencacahan
            </TabsTrigger>
          </TabsList>
          <div className="p-6">
            <TabsContent value="pemutakhiran">
              <PplMonitoringTable type="pemutakhiran" surveyType="supas25" />
            </TabsContent>
            <TabsContent value="pencacahan">
              <PplMonitoringTable type="pencacahan" surveyType="supas25" />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
