import { useQuery } from "@tanstack/react-query";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { supabase } from "@/lib/supabase";

export function UserAnnouncementViewer() {
  const { data: announcements } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Latest Announcements</h2>
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