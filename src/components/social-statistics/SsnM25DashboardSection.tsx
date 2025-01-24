import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PemutakhiranChart } from "./PemutakhiranChart";
import { PencacahanChart } from "./PencacahanChart";
import { PemeriksaanChart } from "./PemeriksaanChart";
import { PplMonitoringTable } from "./SsnM25PplMonitoringTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DashboardSsnM25Section() {
  // Query to get all samples and their updates
  const { data: samples = [] } = useQuery({
    queryKey: ["ssn_m25_samples_dashboard"],
    queryFn: async () => {
      const { data: allSamples, error: samplesError } = await supabase
        .from("ssn_m25_samples")
        .select("*");

      if (samplesError) throw samplesError;

      const { data: updates, error: updatesError } = await supabase
        .from("ssn_m25_updates")
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
      return allSamples.map((sample) => ({
        ...sample,
        status: updatesMap.has(sample.sample_code) ? "sudah" : "belum",
      }));
    },
  });

  const { data: cacahs = [] } = useQuery({
    queryKey: ["ssn_m25_cacah_dashboard"],
    queryFn: async () => {
      const { data: allSamples, error: samplesError } = await supabase
        .from("ssn_m25_samples")
        .select("*");

      if (samplesError) throw samplesError;

      const { data: cacahData, error: cacahError } = await supabase
        .from("ssn_m25_cacah")
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

  const { data: periksas = [] } = useQuery({
    queryKey: ["ssn_m25_periksa_dashboard"],
    queryFn: async () => {
      const { data: allSamples, error: samplesError } = await supabase
        .from("ssn_m25_samples")
        .select("*");

      if (samplesError) throw samplesError;

      const { data: periksaData, error: periksaError } = await supabase
        .from("ssn_m25_periksa")
        .select("*");

      if (periksaError) throw periksaError;

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

      // Create a map of existing periksa entries
      const periksaMap = new Map();
      periksaData?.forEach((periksa) => {
        const key = `${periksa.sample_code}_${periksa.no_ruta}`;
        periksaMap.set(key, periksa);
      });

      // Map expected entries to actual status
      return expectedRutaEntries.map((entry) => {
        const key = `${entry.sample_code}_${entry.no_ruta}`;
        const existingPeriksa = periksaMap.get(key);
        return {
          ...entry,
          status: existingPeriksa ? "sudah" : "belum",
        };
      });
    },
  });

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-6">Progress Overview</h3>
        <div className="grid gap-6 md:grid-cols-3">
          <PemutakhiranChart data={samples} />
          <PencacahanChart data={cacahs} />
          <PemeriksaanChart data={periksas} />
        </div>
      </div>

      <div className="bg-white mt-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold px-6">Progress Harian</h3>
        <Tabs defaultValue="pemutakhiran" className="w-full">
          <TabsList className="w-full inline-flex p-1 bg-muted/10 gap-2 rounded-t-lg border-b">
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
          <div className="p-6">
            <TabsContent value="pemutakhiran">
              <PplMonitoringTable type="pemutakhiran" />
            </TabsContent>
            <TabsContent value="pencacahan">
              <PplMonitoringTable type="pencacahan" />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
