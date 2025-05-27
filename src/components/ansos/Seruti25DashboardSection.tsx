import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PencacahanChart } from "./PencacahanChart";
import { PplMonitoringTable } from "./PplMonitoringTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DashboardSeruti25() {
  const { data: cacahs = [] } = useQuery({
    queryKey: ["seruti25_cacah_dashboard"],
    queryFn: async () => {
      const { data: allSamples, error: samplesError } = await supabase
        .from("seruti25_samples")
        .select("*");

      if (samplesError) throw samplesError;

      const { data: cacahData, error: cacahError } = await supabase
        .from("seruti25_cacah")
        .select("*");

      if (cacahError) throw cacahError;

      // Create an array to store all expected ruta entries (10 per NKS)
      const expectedRutaEntries = [];
      allSamples?.forEach((sample) => {
        for (let i = 1; i <= 10; i++) {
          expectedRutaEntries.push({
            sample_code: sample.sample_code,
            no_ruta: i,
            status: "belum",
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
        return {
          ...entry,
          status: existingCacah ? "sudah" : "belum",
        };
      });
    },
  });

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm pt-6">
        <h3 className="text-xl font-semibold px-6 pb-3">Progress Input</h3>
        <div className="grid md:grid-cols-1">
          <PencacahanChart data={cacahs} surveyType="seruti25" />
        </div>
      </div>

      <div className="bg-white mt-6 rounded-lg shadow-sm py-6">
        <h3 className="text-xl font-semibold px-6 pb-3">Progress Harian</h3>
        <Tabs defaultValue="pencacahan" className="w-full">
          <TabsList className="w-full inline-flex p-1 bg-muted/10 gap-2 rounded-t-lg border-b">
            <TabsTrigger
              value="pencacahan"
              className="rounded-md px-6 py-2 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              Pencacahan
            </TabsTrigger>
          </TabsList>
          <div className="p-6">
            <TabsContent value="pencacahan">
              <PplMonitoringTable type="pencacahan" surveyType="seruti25" />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
