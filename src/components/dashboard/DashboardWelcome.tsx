import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/StatsCard";

interface DashboardWelcomeProps {
  profile: any;
}

export function DashboardWelcome({ profile }: DashboardWelcomeProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name || 'Admin'}</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Employees"
          value={150}
          subStats={[
            { label: "Active", value: 142 },
            { label: "On Leave", value: 8 },
          ]}
        />
        <StatsCard
          title="Announcements"
          value={24}
          subStats={[
            { label: "This Week", value: 5 },
            { label: "This Month", value: 12 },
          ]}
        />
        <StatsCard
          title="Posts"
          value={67}
          subStats={[
            { label: "Published", value: 58 },
            { label: "Draft", value: 9 },
          ]}
        />
      </div>
    </div>
  );
}