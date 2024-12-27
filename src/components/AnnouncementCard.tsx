import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AnnouncementCardProps {
  title: string;
  status: "urgent" | "warning";
  date: string;
  description: string;
}

export const AnnouncementCard = ({ title, status, date, description }: AnnouncementCardProps) => {
  const getBgColor = (status: "urgent" | "warning") => {
    return status === "urgent" ? "bg-red-50" : "bg-amber-50";
  };

  const getBadgeVariant = (status: "urgent" | "warning") => {
    return status === "urgent" ? "destructive" : "secondary";
  };

  return (
    <Card className={`p-6 hover:shadow-lg transition-shadow duration-200 ${getBgColor(status)}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <Badge variant={getBadgeVariant(status)} className="capitalize">
          {status}
        </Badge>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed mb-3">{description}</p>
      <p className="text-xs text-secondary">{date}</p>
    </Card>
  );
};