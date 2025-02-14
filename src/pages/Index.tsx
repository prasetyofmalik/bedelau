import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StatsSection } from "@/components/home/StatsSection";
import { AnnouncementsSection } from "@/components/home/AnnouncementsSection";
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
        <section className="relative text-white py-20 h-[85vh] md:h-[50vh] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-center b-0 z-1"
            style={{
              backgroundImage: "url('/img/bedelau-hero.png')",
              filter: "saturate(2)",
              opacity: 0.8,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-300 to-yellow-500 opacity-85" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ textShadow: "2px 2px 4px rgba(98, 98, 99, 0.4)" }}>
              Beranda Elektronik dan Administrasi Umum
            </h1>
            <h1 className="text-3xl md:text-4xl font-bold mb-6" style={{ textShadow: "2px 2px 4px rgba(98, 98, 99, 0.4)" }}>
              BPS Kabupaten Siak
            </h1>
            <p className="text-xl mb-8" style={{ textShadow: "2px 2px 4px rgba(98, 98, 99, 0.5)" }}>
              Bantu efisiensi, notifikasi dan administrasi terintegrasi.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="bg-primary hover:bg-blue-500"
              onClick={() => (window.location.href = "/login")}
            >
              Mulai Sekarang
            </Button>
          </div>
        </section>

        {/* Stats Section */}
        <StatsSection />

        {/* Announcements Section */}
        <AnnouncementsSection />

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
