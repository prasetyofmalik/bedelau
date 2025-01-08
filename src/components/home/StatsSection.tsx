import { StatsCard } from "@/components/StatsCard";
import { useMailStats } from "@/hooks/useMailStats";

export const StatsSection = () => {
  const { data: stats, isLoading } = useMailStats();

  if (isLoading) {
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
          value={240}
          subStats={[
            { label: "Pria", value: 110 },
            { label: "Wanita", value: 130 },
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
