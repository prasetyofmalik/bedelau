import { Card } from "@/components/ui/card";

interface PostCardProps {
  title: string;
  date: string;
  image: string;
}

export const PostCard = ({ title, date, image }: PostCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-video relative">
        <img src={image} alt={title} className="object-cover w-full h-full" />
      </div>
      <div className="p-4">
        <h3 className="font-medium mb-2">{title}</h3>
        <p className="text-xs text-secondary">{date}</p>
      </div>
    </Card>
  );
};