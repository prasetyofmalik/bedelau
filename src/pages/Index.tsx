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
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
              Mulai Sekarang
            </Button>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="Total Employees"
              value={240}
              subStats={[
                { label: "Male", value: 110 },
                { label: "Female", value: 130 },
              ]}
            />
            <StatsCard
              title="Total Projects"
              value={204}
              subStats={[
                { label: "Active", value: 24 },
                { label: "Archived", value: 180 },
              ]}
            />
            <StatsCard
              title="Work Teams"
              value={15}
            />
          </div>
        </section>

        {/* Announcements Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Announcements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnnouncementCard
                title="System Maintenance"
                status="urgent"
                date="3 mo ago"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore."
              />
              <AnnouncementCard
                title="New Feature Release"
                status="warning"
                date="20 min ago"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore."
              />
            </div>
          </div>
        </section>

        {/* Latest Posts Section */}
        <section className="py-12 container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Latest Posts</h2>
            <Input
              type="search"
              placeholder="Search posts..."
              className="max-w-xs"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PostCard
              title="Post 1 Headline"
              date="Fri, Dec 15 2023"
              image="https://picsum.photos/800/600"
            />
            <PostCard
              title="Post 2 Headline"
              date="Fri, Dec 20 2024"
              image="https://picsum.photos/800/600"
            />
            <PostCard
              title="Post 3 Headline"
              date="Fri, Dec 25 2024"
              image="https://picsum.photos/800/600"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;