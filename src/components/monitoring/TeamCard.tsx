import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { teams } from "./teamsData";

interface TeamCardProps {
  name: string;
  icon: LucideIcon;
  color: string;
  text: string;
}

export function TeamCard({ name, icon: Icon, color, text }: TeamCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    const team = teams.find((team) => team.name.toLowerCase() === name.toLowerCase());
    if (team) {
      navigate(`/monitoring/${team.name.toLowerCase()}`);
    }
  };

  return (
    <Card
      className="hover:shadow-lg transition-all cursor-pointer group h-48 flex flex-col items-center justify-center p-6 bg-opacity-10 hover:bg-opacity-20"
      style={{ backgroundColor: color }}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center space-y-4">
        <Icon className={`h-12 w-12 ${color} group-hover:scale-110 transition-transform`} />
        <h3 className="text-lg font-semibold text-center">{name}</h3>
        <p className="text-sm text-gray-600 text-center">
          {text}
        </p>
      </div>
    </Card>
  );
}