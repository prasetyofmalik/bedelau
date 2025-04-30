import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useLocation } from "react-router-dom";

export const QAFHeader = () => {
  const { toggleSidebar } = useSidebar();
  const location = useLocation();

  const getTitle = () => {
    // const allItems = [...teams[0].items, ...teams[1].items];
    // const currentItem = allItems.find((item) => location.pathname.includes(item.url.split('/').pop() || ''));
    // if (currentItem) return currentItem.title;
    return "Monitoring BPS Siak";
  };

  return (
    <header className="border-b bg-white bg-opacity-90 backdrop-blur-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-secondary font-semibold">{getTitle()}</h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </nav>
      </div>
    </header>
  );
};