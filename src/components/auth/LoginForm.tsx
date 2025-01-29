import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { loginSchema, type LoginFormValues } from "@/lib/schemas/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export function LoginForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error("No user data returned");
      }

      let userProfile = null;
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (profile && !profileError) {
        userProfile = profile;
      } else {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: authData.user.id,
              role: 'user',
              email: authData.user.email
            }
          ])
          .select('role')
          .single();

        if (insertError) {
          console.error('Profile creation error:', insertError);
          throw new Error("Error creating user profile");
        }

        userProfile = newProfile;
      }

      toast({
        title: "Login berhasil",
        description: "Mengarahkan ke dasbor...",
      });

      if (userProfile?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login gagal",
        description: error instanceof Error ? error.message : "Kredensial tidak valid. Silakan periksa dan coba kembali.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Masukkan email"
                    className="pl-10 text-sm md:text-base"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan kata sandi"
                    className="pl-10 pr-10 text-sm md:text-base"
                    {...field}
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
        >
          Masuk
        </Button>
      </form>
    </Form>
  );
}