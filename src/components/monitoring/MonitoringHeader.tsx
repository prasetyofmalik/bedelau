import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export const MonitoringHeader = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="border-b bg-white bg-opacity-90 backdrop-blur-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-secondary font-semibold">Monitoring BPS Siak</h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </nav>
      </div>
    </header>
  );
};