import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface TeamCardProps {
  name: string;
  icon: LucideIcon;
  color: string;
}

export function TeamCard({ name, icon: Icon, color }: TeamCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2">
          <Icon className={`h-6 w-6 ${color}`} />
          <span>{name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-32 flex items-center justify-center bg-gray-50 rounded-md">
          <img
            src={`/lovable-uploads/e43505cc-bbaa-4c02-82b3-0fdd365688fb.png`}
            alt={name}
            className="h-24 w-24 object-contain"
          />
        </div>
      </CardContent>
    </Card>
  );
}