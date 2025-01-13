import { StatsCard } from "@/components/StatsCard";

interface UserDashboardWelcomeProps {
  profile: any;
}

export function UserDashboardWelcome({ profile }: UserDashboardWelcomeProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Halo, {profile?.full_name || 'User'}!</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Postingan Saya"
          value={12}
          subStats={[
            { label: "Terpublikasi", value: 10 },
            { label: "Draf", value: 2 },
          ]}
        />
        <StatsCard
          title="Pengumuman"
          value={5}
          subStats={[
            { label: "Belum dibaca", value: 2 },
          ]}
        />
        <StatsCard
          title="Jumlah Pegawai"
          value={15}
        />
      </div>
    </div>
  );
}