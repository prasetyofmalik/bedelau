import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AnnouncementCardProps {
  title: string;
  status: "urgent" | "warning";
  date: string;
  description: string;
}

export const AnnouncementCard = ({ title, status, date, description }: AnnouncementCardProps) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-medium">{title}</h3>
        <Badge variant={status === "urgent" ? "destructive" : "warning"}>{status}</Badge>
      </div>
      <p className="text-sm text-secondary mb-2">{description}</p>
      <p className="text-xs text-secondary">{date}</p>
    </Card>
  );
};