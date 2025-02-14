import { StatsCard } from "@/components/StatsCard";
import { useEmployeeStats, useAnnouncementsStats } from "@/hooks/useStatsSection";

interface UserDashboardWelcomeProps {
  profile: any;
}

export function UserDashboardWelcome({ profile }: UserDashboardWelcomeProps) {
  const { data: employeeStats } = useEmployeeStats();
  const { data: announcementStats } = useAnnouncementsStats();
  
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
          value={ announcementStats?.total || 0 }
          subStats={[
            { label: "Belum dibaca", value: announcementStats?.unread || 0 },
          ]}
        />
        <StatsCard
          title="Jumlah Pegawai"
          value={ employeeStats?.total || 0 }
          subStats={[
            { label: "Pria", value: employeeStats?.male || 0 },
            { label: "Wanita", value: employeeStats?.female || 0 },
          ]}
        />
      </div>
    </div>
  );
}