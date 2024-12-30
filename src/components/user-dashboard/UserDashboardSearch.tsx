import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function UserDashboardSearch() {
  return (
    <div className="relative mt-8">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search announcements, team members, or your posts..."
        className="pl-10"
        aria-label="Search dashboard content"
      />
    </div>
  );
}