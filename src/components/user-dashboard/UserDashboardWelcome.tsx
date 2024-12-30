import { Card } from "@/components/ui/card";
import { StatsCard } from "@/components/StatsCard";

interface UserDashboardWelcomeProps {
  profile: any;
}

export function UserDashboardWelcome({ profile }: UserDashboardWelcomeProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome, {profile?.full_name || 'User'}</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="My Posts"
          value={12}
          subStats={[
            { label: "Published", value: 10 },
            { label: "Draft", value: 2 },
          ]}
        />
        <StatsCard
          title="Announcements"
          value={5}
          subStats={[
            { label: "Unread", value: 2 },
            { label: "Total", value: 5 },
          ]}
        />
        <StatsCard
          title="Team Members"
          value={15}
        />
      </div>
    </div>
  );
}