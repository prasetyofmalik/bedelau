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
    queryKey: ['ssn_m25_samples_dashboard'],
    queryFn: async () => {
      const { data: allSamples, error: samplesError } = await supabase
        .from('ssn_m25_samples')
        .select('*');

      if (samplesError) throw samplesError;

      const { data: cacahs, error: cacahsError } = await supabase
        .from('ssn_m25_cacah')
        .select('*');

      if (cacahsError) throw cacahsError;

      // Create a map of cacahs by sample_code
      const cacahsMap = new Map();
      cacahs?.forEach(cacah => {
        if (!cacahsMap.has(cacah.sample_code)) {
          cacahsMap.set(cacah.sample_code, cacah);
        }
      });

      // Combine samples with their cacahs
      return allSamples.map(sample => ({
        ...sample,
        status: cacahsMap.has(sample.sample_code) ? 'sudah' : 'belum',
      }));
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