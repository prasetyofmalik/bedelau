import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface QAFCardProps {
  title: string;
  icon: LucideIcon;
  color: string;
  description: string;
  url: string;
}

export function QAFCard({
  title,
  icon: Icon,
  color,
  description,
  url,
}: QAFCardProps) {
  const handleClick = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Card
      className="hover:shadow-lg transition-all cursor-pointer group h-48 flex flex-col items-center justify-center p-6 bg-opacity-10 hover:bg-opacity-20"
      style={{ backgroundColor: color }}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center space-y-4">
        <Icon
          className={`h-12 w-12 ${color} group-hover:scale-110 transition-transform`}
        />
        <h3 className="text-lg font-semibold text-center">{title}</h3>
        <p className="text-sm text-gray-600 text-center line-clamp-2">
          {description}
        </p>
      </div>
    </Card>
  );
}
