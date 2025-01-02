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

const UserDashboard = () => {
  const navigate = useNavigate();

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user?.id)
        .single();
      return data;
    },
  });

  useEffect(() => {
    if (!session) {
      navigate('/login');
    }
  }, [session, navigate]);

  // if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <UserDashboardWelcome profile={profile} />
        <UserDashboardSearch />
        <div className="grid gap-6 mt-8">
          <UserAnnouncementViewer />
          <UserEmployeeDirectory />
          <UserPostManager userId={session?.user?.id} />
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;