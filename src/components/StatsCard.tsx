import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface StatsCardProps {
  title: string;
  value: number;
  subStats?: { label: string; value: number }[];
  redirectTo?: string;
}

export const StatsCard = ({ title, value, subStats, redirectTo }: StatsCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (redirectTo) {
      navigate(redirectTo);
    }
  };

  return (
    <Card 
      className={`p-6 hover:shadow-lg bg-gray-50 transition-shadow duration-200 ${redirectTo ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    >
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