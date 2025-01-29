import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { DashboardWelcome } from "@/components/dashboard/DashboardWelcome";
import { DashboardSearch } from "@/components/dashboard/DashboardSearch";
import { AnnouncementSection } from "@/components/dashboard/AnnouncementSection";
import { EmployeeSection } from "@/components/dashboard/EmployeeSection";
import { PostSection } from "@/components/dashboard/PostSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Fetch user session and profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return null;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profile?.role !== "admin") {
        navigate("/");
        return null;
      }

      return profile;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="w-full py-5 overflow-x-auto">
        <div className="container px-3">
          <DashboardWelcome profile={profile} />
          <DashboardSearch />

          <Tabs defaultValue="employees" className="space-y-6 mt-8">
            <div className="overflow-x-auto">
              <TabsList className="w-full border-b border-gray-200 space-x-4 sm:space-x-8 p-0 h-auto bg-transparent">
                <TabsTrigger
                  value="announcements"
                  className="px-3 sm:px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent font-medium whitespace-nowrap"
                >
                  Pengumuman
                </TabsTrigger>
                <TabsTrigger
                  value="employees"
                  className="px-3 sm:px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent font-medium whitespace-nowrap"
                >
                  Pegawai
                </TabsTrigger>
                <TabsTrigger
                  value="posts"
                  className="px-3 sm:px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none rounded-none bg-transparent font-medium whitespace-nowrap"
                >
                  Postingan
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="announcements" className="mt-6">
              <AnnouncementSection />
            </TabsContent>

            <TabsContent value="employees" className="mt-6">
              <EmployeeSection />
            </TabsContent>

            <TabsContent value="posts" className="mt-6">
              <PostSection />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}