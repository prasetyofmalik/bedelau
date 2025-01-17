import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PemutakhiranChart } from "./PemutakhiranChart";
import { PencacahanChart } from "./PencacahanChart";

export function DashboardSsnM25Section() {
  // Query to get all samples and their updates
  const { data: samples = [] } = useQuery({
    queryKey: ['ssn_m25_samples_dashboard'],
    queryFn: async () => {
      const { data: allSamples, error: samplesError } = await supabase
        .from('ssn_m25_samples')
        .select('*');

      if (samplesError) throw samplesError;

      const { data: updates, error: updatesError } = await supabase
        .from('ssn_m25_updates')
        .select('*');

      if (updatesError) throw updatesError;

      // Create a map of updates by sample_code
      const updatesMap = new Map();
      updates?.forEach(update => {
        if (!updatesMap.has(update.sample_code)) {
          updatesMap.set(update.sample_code, update);
        }
      });

      // Combine samples with their updates
      return allSamples.map(sample => ({
        ...sample,
        status: updatesMap.has(sample.sample_code) ? 'sudah' : 'belum',
      }));
    },
  });

  const { data: cacahs = [] } = useQuery({
    queryKey: ['ssn_m25_cacah_dashboard'],
    queryFn: async () => {
      const { data: allSamples, error: samplesError } = await supabase
        .from('ssn_m25_samples')
        .select('*');

      if (samplesError) throw samplesError;

      const { data: cacahData, error: cacahError } = await supabase
        .from('ssn_m25_cacah')
        .select('*');

      if (cacahError) throw cacahError;

      // Create an array to store all expected ruta entries (10 per NKS)
      const expectedRutaEntries = [];
      allSamples?.forEach(sample => {
        for (let i = 1; i <= 10; i++) {
          expectedRutaEntries.push({
            sample_code: sample.sample_code,
            no_ruta: i,
            status: 'belum'
          });
        }
      });

      // Create a map of existing cacah entries
      const cacahMap = new Map();
      cacahData?.forEach(cacah => {
        const key = `${cacah.sample_code}_${cacah.no_ruta}`;
        cacahMap.set(key, cacah);
      });

      // Map expected entries to actual status
      return expectedRutaEntries.map(entry => {
        const key = `${entry.sample_code}_${entry.no_ruta}`;
        const existingCacah = cacahMap.get(key);
        return {
          ...entry,
          status: existingCacah ? 'sudah' : 'belum'
        };
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <PemutakhiranChart data={samples} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <PencacahanChart data={cacahs} />
        </div>
      </div>
    </div>
  );
}