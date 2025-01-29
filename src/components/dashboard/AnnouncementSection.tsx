import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { supabase } from "@/lib/supabase";

export function AnnouncementSection() {
  const [isCreating, setIsCreating] = useState(false);

  const { data: announcements } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between">
        <h2 className="text-2xl font-semibold mb-4 md:mb-0">Daftar Pengumuman</h2>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Pengumuman Baru
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {announcements?.map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            title={announcement.title}
            status={announcement.status}
            date={new Date(announcement.created_at).toLocaleDateString()}
            description={announcement.content}
          />
        ))}
      </div>
    </div>
  );
}