import { Card } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number;
  subStats?: { label: string; value: number }[];
}

export const StatsCard = ({ title, value, subStats }: StatsCardProps) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      <h3 className="text-secondary text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
      {subStats && (
        <div className="mt-4 space-y-2">
          {subStats.map((stat) => (
            <div key={stat.label} className="flex justify-between items-center">
              <span className="text-sm text-secondary">{stat.label}</span>
              <span className="text-sm font-medium">{stat.value}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};