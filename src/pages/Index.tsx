import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StatsCard } from "@/components/StatsCard";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-blue-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Sistem Aplikasi Manajemen Siak (SAMS)
            </h1>
            <p className="text-xl mb-8 text-gray-100">
              Mengelola workflow dan manajemen kantor secara efisien
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-100"
              onClick={() => window.location.href = '/login'}
            >
              Mulai Sekarang
            </Button>
          </div>
        </section>

        {/* Announcements Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-2">Pengumuman</h2>
            <p className="text-secondary mb-8">Tetap terinformasi dengan pengumuman dan pembaruan terbaru</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnnouncementCard
                title="Warning: System Emergency Maintenance"
                status="critical"
                date="10 min ago"
                description="Emergency system maintenance required. All services will be unavailable for approximately 30 minutes starting at 15:00 UTC."
              />
              <AnnouncementCard
                title="Important Meeting Schedule Changes"
                status="high"
                date="1 hour ago"
                description="The quarterly review meeting has been rescheduled to next Monday. All department heads must attend."
              />
              <AnnouncementCard
                title="Updated Company Policies"
                status="medium"
                date="2 days ago"
                description="New workplace policies have been implemented. Please review the updated documentation in the company portal."
              />
              <AnnouncementCard
                title="Company Social Event Next Week"
                status="low"
                date="3 days ago"
                description="Join us for the annual company picnic next Saturday at Central Park. Family members are welcome!"
              />
              <AnnouncementCard
                title="New Office Equipment Arrival"
                status="general"
                date="1 week ago"
                description="New printers have been installed on each floor. Please check your email for usage guidelines."
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="Jumlah Pegawai"
              value={240}
              subStats={[
                { label: "Pria", value: 110 },
                { label: "Wanita", value: 130 },
              ]}
            />
            <StatsCard
              title="Jumlah Proyek"
              value={204}
              subStats={[
                { label: "Aktif", value: 24 },
                { label: "Terarsip", value: 180 },
              ]}
            />
            <StatsCard
              title="Tim Kerja"
              value={15}
            />
          </div>
        </section>

        {/* Latest Posts Section */}
        <section className="py-12 container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Postingan Terbaru</h2>
            <Input
              type="search"
              placeholder="Cari postingan..."
              className="max-w-xs"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PostCard
              title="Post 1 Headline"
              date="Jum, 13 Des 2023"
              image="https://picsum.photos/800/600"
            />
            <PostCard
              title="Post 2 Headline"
              date="Jum, 20 Des 2024"
              image="https://random-image-pepebigotes.vercel.app/api/random-image"
            />
            <PostCard
              title="Post 3 Headline"
              date="Jum, 27 Des 2024"
              image="https://loremflickr.com/800/600"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
