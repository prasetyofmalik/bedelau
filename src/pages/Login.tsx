import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { LoginForm } from "@/components/auth/LoginForm";
import { Loader2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: profile, isLoading: isProfileLoading } = useQuery({
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
    if (session && profile) {
      // Redirect based on user role
      if (profile.role === "admin" || profile.role === "head_office" || profile.role === "general_subsection") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    }
  }, [session, profile, navigate]);

  if (isSessionLoading || (session && isProfileLoading)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  // Only show login page if there's no active session
  if (!session) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-yellow-300 to-yellow-500 opacity-85">
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md space-y-2 bg-white p-8 rounded-lg shadow-md">
            <div className="text-center flex flex-col items-center">
              <Link to="/">
                <img
                  src="/img/bedelau-logo.png"
                  alt="Bedelau Logo"
                  className="h-10 w-auto"
                />
              </Link>
              <p className="text-xs md:text-sm text-muted-foreground mt-5 text-left">
                Masuk menggunakan email dan kata sandi yang telah disediakan.
              </p>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
    );
  }

  return null;
}