import { StatsCard } from "@/components/StatsCard";
import { useEmployeeStats, useAnnouncementsStats } from "@/hooks/useStatsSection";

interface DashboardWelcomeProps {
  profile: any;
}

export function DashboardWelcome({ profile }: DashboardWelcomeProps) {
  const { data: employeeStats } = useEmployeeStats();
  const { data: announcementStats } = useAnnouncementsStats();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Halo lagi, {profile?.full_name || 'Admin'}!</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Pengumuman"
          value={ announcementStats?.total || 0 }
          subStats={[
            { label: "Minggu ini", value: announcementStats?.thisWeek || 0 },
            { label: "Bulan ini", value: announcementStats?.thisMonth || 0 },
          ]}
        />
        <StatsCard
          title="Pegawai"
          value={ employeeStats?.total || 0 }
          subStats={[
            { label: "Pria", value: employeeStats?.male || 0 },
            { label: "Wanita", value: employeeStats?.female || 0 },
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