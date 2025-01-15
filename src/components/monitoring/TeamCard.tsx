import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TeamCardProps {
  name: string;
  icon: LucideIcon;
  color: string;
  image: string;
}

export function TeamCard({ name, icon: Icon, color, image }: TeamCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (name === "Subbagian Umum") {
      navigate("/monitoring/general-subsection");
    }
    else if (name === "Fungsi Statistik Sosial") {
      navigate("/monitoring/social-statistics");
    }
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2">
          <Icon className={`h-6 w-6 ${color}`} />
          <span>{name}</span>
        </CardTitle>
      </CardHeader>
      {/* <CardContent> */}
        {/* <div className="h-32 flex items-center justify-center bg-gray-50 rounded-md">
          <img src={img} alt={name} className="h-20 object-contain" />
        </div> */}
        <div className="aspect-video relative">
          <img src={image} alt={name} className="object-cover w-full h-full" />
        </div>
      {/* </CardContent> */}
    </Card>
  );
}
