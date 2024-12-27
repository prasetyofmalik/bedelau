import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type AnnouncementStatus = "critical" | "high" | "medium" | "low" | "general";

interface AnnouncementCardProps {
  title: string;
  status: AnnouncementStatus;
  date: string;
  description: string;
}

export const AnnouncementCard = ({ title, status, date, description }: AnnouncementCardProps) => {
  const getBgColor = (status: AnnouncementStatus) => {
    switch (status) {
      case "critical":
        return "bg-red-50";
      case "high":
        return "bg-orange-50";
      case "medium":
        return "bg-yellow-50";
      case "low":
        return "bg-blue-50";
      case "general":
        return "bg-gray-50";
      default:
        return "bg-white";
    }
  };

  const getBadgeVariant = (status: AnnouncementStatus): "destructive" | "secondary" | "default" | "outline" => {
    switch (status) {
      case "critical":
        return "destructive";
      case "high":
        return "destructive";
      case "medium":
        return "destructive";
      case "low":
        return "default";
      case "general":
        return "outline";
      default:
        return "default";
    }
  };

  const getBadgeStyles = (status: AnnouncementStatus): string => {
    switch (status) {
      case "critical":
        return "bg-red-500 hover:bg-red-600 text-white";
      case "high":
        return "bg-orange-500 hover:bg-orange-600 text-white";
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
      case "low":
        return "";
      case "general":
        return "";
      default:
        return "";
    }
  };

  const getStatusIcon = (status: AnnouncementStatus) => {
    switch (status) {
      case "critical":
        return "🔴";
      case "high":
        return "🟠";
      case "medium":
        return "🟡";
      case "low":
        return "🔵";
      case "general":
        return "⚪";
      default:
        return "";
    }
  };

  return (
    <Card className={`p-6 hover:shadow-lg transition-shadow duration-200 ${getBgColor(status)} cursor-pointer`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">{getStatusIcon(status)}</span>
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        <Badge 
          variant={getBadgeVariant(status)} 
          className={`capitalize ${getBadgeStyles(status)}`}
        >
          {status}
        </Badge>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed mb-3">{description}</p>
      <p className="text-xs text-secondary">{date}</p>
    </Card>
  );
};