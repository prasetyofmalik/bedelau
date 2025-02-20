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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogOut, User, Monitor, Menu, MessagesSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: profile } = useQuery({
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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Berhasil keluar",
        description: "Mengarahkan ke beranda...",
      });
      navigate("/");
      window.location.reload();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal keluar. Tolong coba lagi.",
      });
    }
  };

  const navigateToRole = () => {
    if (profile?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/user");
    }
  };

  const NavigationLinks = () => (
    <>
      <Button variant="ghost" asChild>
        <Link to="/monitoring" className="flex items-center gap-2">
          <Monitor className="h-4 w-4" />
          Monitoring
        </Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link to="https://webapps.bps.go.id/siakkab/ai-bps-siak/" className="flex items-center gap-2">
          <MessagesSquare className="h-4 w-4" />
          Dara AI
        </Link>
      </Button>
    </>
  );

  return (
    <header
      className={
        "border-b bg-white bg-opacity-90 backdrop-blur-md sticky top-0 z-50"
      }
    >
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/">
              <img
                src="/img/bedelau-logo.png"
                alt="Bedelau Logo"
                className="h-8 w-auto"
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <NavigationLinks />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-4">
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>
                        <Link to="/">
                          <img
                            src="/img/bedelau-logo.png"
                            alt="Bedelau Logo"
                            className="h-8 w-auto"
                          />
                        </Link>
                      </SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 mt-4">
                      <NavigationLinks />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white">
                    <DropdownMenuItem onClick={navigateToRole}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Keluar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="default" asChild>
                  <Link to="/login">Masuk</Link>
                </Button>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};
