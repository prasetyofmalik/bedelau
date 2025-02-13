import { AnnouncementCard } from "@/components/AnnouncementCard";
import { useAnnouncements } from "@/hooks/useStatsSection";
export function AnnouncementsSection() {
  const { data: announcements, isLoading } = useAnnouncements(5);
  if (isLoading) {
    return <div>Loading announcements...</div>;
  }
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-2">Pengumuman</h2>
        <p className="text-secondary mb-8">
          Tetap terinformasi dengan pengumuman dan pembaruan terbaru
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {announcements?.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              title={announcement.title}
              status={announcement.status}
              date={announcement.created_at}
              description={announcement.content}
            />
          ))}
        </div>
      </div>
    </section>
  );
}