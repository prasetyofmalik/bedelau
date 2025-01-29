import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { UserDashboardWelcome } from "@/components/user-dashboard/UserDashboardWelcome";
import { UserDashboardSearch } from "@/components/user-dashboard/UserDashboardSearch";
import { UserAnnouncementViewer } from "@/components/user-dashboard/UserAnnouncementViewer";
import { UserEmployeeDirectory } from "@/components/user-dashboard/UserEmployeeDirectory";
import { UserPostManager } from "@/components/user-dashboard/UserPostManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

export default function UserDashboard() {
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .single();
      return data;
    },
  });

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  if (!profile) return null;

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
          <UserDashboardWelcome profile={profile} />
          <UserDashboardSearch />
          <Tabs defaultValue="employees" className="space-y-6 mt-6">
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
              <UserAnnouncementViewer />
            </TabsContent>

            <TabsContent value="employees" className="mt-6">
              <UserEmployeeDirectory />
            </TabsContent>

            <TabsContent value="posts" className="mt-6">
              <UserPostManager userId={session?.user?.id} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
