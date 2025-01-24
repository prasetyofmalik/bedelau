import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StatsSection } from "@/components/home/StatsSection";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

const Index = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const posts = [
    {
      title: "Post 1 Headline",
      date: "Jum, 13 Des 2023",
      image: "https://picsum.photos/800/600",
    },
    {
      title: "Post 2 Headline",
      date: "Jum, 20 Des 2024",
      image: "https://random-image-pepebigotes.vercel.app/api/random-image",
    },
    {
      title: "Post 3 Headline",
      date: "Jum, 27 Des 2024",
      image: "https://picsum.photos/seed/picsum/800/600/?blur",
    },
    {
      title: "Post 4 Headline",
      date: "Jum, 13 Des 2023",
      image: "https://picsum.photos/800/600",
    },
    {
      title: "Post 5 Headline",
      date: "Jum, 20 Des 2024",
      image: "https://random-image-pepebigotes.vercel.app/api/random-image",
    },
    {
      title: "Post 6 Headline",
      date: "Jum, 27 Des 2024",
      image: "https://picsum.photos/seed/picsum/800/600/?blur",
    },
    {
      title: "Post 7 Headline",
      date: "Jum, 13 Des 2023",
      image: "https://picsum.photos/800/600",
    },
    {
      title: "Post 8 Headline",
      date: "Jum, 20 Des 2024",
      image: "https://random-image-pepebigotes.vercel.app/api/random-image",
    },
    {
      title: "Post 9 Headline",
      date: "Jum, 27 Des 2024",
      image: "https://picsum.photos/seed/picsum/800/600/?blur",
    },
    {
      title: "Post 10 Headline",
      date: "Jum, 13 Des 2023",
      image: "https://picsum.photos/800/600",
    },
    {
      title: "Post 11 Headline",
      date: "Jum, 20 Des 2024",
      image: "https://random-image-pepebigotes.vercel.app/api/random-image",
    },
  ];

  // Calculate pagination
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-blue-800 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Beranda Elektronik dan Administrasi Umum
            </h1>
            <h1 className="text-4xl md:text-4xl font-bold mb-6">
              BPS Kabupaten Siak
            </h1>
            <p className="text-xl mb-8 text-gray-100">
              Bantu efisiensi, notifikasi, dan administrasi terintegrasi.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-100"
              onClick={() => (window.location.href = "/login")}
            >
              Mulai Sekarang
            </Button>
          </div>
        </section>

        {/* Stats Section */}
        <StatsSection />

        {/* Announcements Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-2">Pengumuman</h2>
            <p className="text-secondary mb-8">
              Tetap terinformasi dengan pengumuman dan pembaruan terbaru
            </p>
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

        {/* Latest Posts Section */}
        <section className="py-12 container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
            <h2 className="text-2xl font-bold mb-4 md:mb-0">
              Postingan Terbaru
            </h2>
            <Input
              type="search"
              placeholder="Cari postingan..."
              className="w-full md:w-1/2 lg:w-1/3"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentPosts.map((post, index) => (
              <PostCard
                key={index}
                title={post.title}
                date={post.date}
                image={post.image}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      onClick={() => setCurrentPage(index + 1)}
                      isActive={currentPage === index + 1}
                      className="cursor-pointer"
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
