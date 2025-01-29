import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { supabase } from "@/lib/supabase";

interface UserPostManagerProps {
  userId: string;
}

export function UserPostManager({ userId }: UserPostManagerProps) {
  const [isCreating, setIsCreating] = useState(false);

  const { data: posts } = useQuery({
    queryKey: ['user-posts', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between">
        <h2 className="text-2xl font-semibold mb-4 md:mb-0">Postingan Saya</h2>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Postingan Baru
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {posts?.map((post) => (
          <PostCard
            key={post.id}
            title={post.title}
            date={new Date(post.created_at).toLocaleDateString()}
            image={post.image_url || "/placeholder.svg"}
          />
        ))}
      </div>
    </div>
  );
}