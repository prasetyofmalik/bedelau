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
  // const navigate = useNavigate();

  // Fetch user session and profile
  // const { data: profile, isLoading } = useQuery({
  //   queryKey: ['profile'],
  //   queryFn: async () => {
  //     const { data: { session } } = await supabase.auth.getSession();
  //     if (!session) {
  //       navigate('/login');
  //       return null;
  //     }
      
  //     const { data: profile } = await supabase
  //       .from('profiles')
  //       .select('*')
  //       .eq('id', session.user.id)
  //       .single();
        
  //     if (profile?.role !== 'admin') {
  //       navigate('/');
  //       return null;
  //     }
      
  //     return profile;
  //   },
  // });

  // if (isLoading) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <Loader2 className="h-8 w-8 animate-spin" />
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* <DashboardWelcome profile={profile} /> */}
        <DashboardSearch />
        
        <Tabs defaultValue="announcements" className="mt-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="announcements">Pengumuman</TabsTrigger>
            <TabsTrigger value="employees">Pegawai</TabsTrigger>
            <TabsTrigger value="posts">Postingan</TabsTrigger>
          </TabsList>
          
          <TabsContent value="announcements">
            <AnnouncementSection />
          </TabsContent>
          
          <TabsContent value="employees">
            <EmployeeSection />
          </TabsContent>
          
          <TabsContent value="posts">
            <PostSection />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}