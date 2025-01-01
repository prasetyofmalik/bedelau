import { StatsCard } from "@/components/StatsCard";

interface DashboardWelcomeProps {
  profile: any;
}

export function DashboardWelcome({ profile }: DashboardWelcomeProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Halo lagi, {profile?.full_name || 'Admin'}!</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Pengumuman"
          value={24}
          subStats={[
            { label: "Minggu ini", value: 5 },
            { label: "Bulan ini", value: 12 },
          ]}
        />
        <StatsCard
          title="Pegawai"
          value={150}
          subStats={[
            { label: "Pria", value: 142 },
            { label: "Wanita", value: 8 },
          ]}
        />
        <StatsCard
          title="Postingan"
          value={67}
          subStats={[
            { label: "Terpublikasi", value: 58 },
            { label: "Terarsip", value: 9 },
          ]}
        />
      </div>
    </div>
  );
}