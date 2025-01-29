import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PostCard } from "@/components/PostCard";
import { supabase } from "@/lib/supabase";

export function PostSection() {
  const { data: posts } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between">
        <h2 className="text-2xl font-semibold mb-4 md:mb-0">Daftar Postingan</h2>
        <Button>
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