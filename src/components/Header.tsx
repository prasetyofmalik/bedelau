import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Users, Monitor, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
      title: "Berhasil keluar",
      description: "Mengarahkan ke beranda...",
      });
      navigate('/');
      window.location.reload();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal keluar. Tolong coba lagi.",
      });
    }
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/">
              <img src="/img/sams-logo.png" alt="SAMS Logo" className="h-8 w-auto" />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {session && profile?.role === 'admin' && (
              <>
                {/* <Button variant="ghost" asChild>
                  <Link to="/admin/personnel" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Kepegawaian
                  </Link>
                </Button> */}
                <Button variant="ghost" asChild>
                  <Link to="/monitoring" className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    Monitoring
                  </Link>
                </Button>
              </>
            )}
            {session && (
              <></>
              // <Button variant="ghost" asChild>
              //   <Link to="/notifications" className="flex items-center gap-2">
              //     <Bell className="h-4 w-4" />
              //     Notifikasi
              //   </Link>
              // </Button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white">
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Keluar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button variant="default" asChild>
                <Link to="/login">Masuk</Link>
              </Button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};