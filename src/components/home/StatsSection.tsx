import { StatsCard } from "@/components/StatsCard";
import { useMailStats } from "@/hooks/useMailStats";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const StatsSection = () => {
  const { data: stats, isLoading: isMailStatsLoading } = useMailStats();
  
  const { data: employeeStats, isLoading: isEmployeeStatsLoading } = useQuery({
    queryKey: ['employeeStats'],
    queryFn: async () => {
      const { data: employees } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'employee');

      const totalEmployees = employees?.length || 0;
      const maleEmployees = employees?.filter(emp => emp.gender === 'l').length || 0;
      const femaleEmployees = employees?.filter(emp => emp.gender === 'p').length || 0;

      return {
        total: totalEmployees,
        male: maleEmployees,
        female: femaleEmployees
      };
    }
  });

  if (isMailStatsLoading || isEmployeeStatsLoading) {
    return (
      <section className="py-12 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard title="Loading..." value={0} />
          <StatsCard title="Loading..." value={0} />
          <StatsCard title="Loading..." value={0} />
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Jumlah Pegawai"
          value={employeeStats?.total || 0}
          subStats={[
            { label: "Pria", value: employeeStats?.male || 0 },
            { label: "Wanita", value: employeeStats?.female || 0 },
          ]}
        />
        <StatsCard
          title="Jumlah Tim Kerja"
          value={7}
          redirectTo="/monitoring"
        />
        <StatsCard
          title="Jumlah Surat"
          value={stats?.totalCount || 0}
          subStats={[
            { label: "Surat Masuk", value: stats?.incomingCount || 0 },
            { label: "Surat Keluar", value: stats?.outgoingCount || 0 },
            { label: "Surat Keputusan", value: stats?.skCount || 0 },
          ]}
          redirectTo="/monitoring/general-subsection"
        />
      </div>
    </section>
  );
};