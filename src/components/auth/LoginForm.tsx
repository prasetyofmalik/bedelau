import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { loginSchema, type LoginFormValues } from "@/lib/schemas/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export function LoginForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      // First, sign in the user
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

      // Then fetch their profile
      let userProfile = null;
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (profile && !profileError) {
        userProfile = profile;
      } else {
        // Create new profile if none exists
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
        title: "Login successful",
        description: "Redirecting to dashboard...",
      });

      // Redirect based on role
      if (userProfile?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again",
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
        >
          Sign in
        </Button>
      </form>
    </Form>
  );
}