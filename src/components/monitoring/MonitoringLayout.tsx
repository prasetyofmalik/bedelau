import { MonitoringHeader } from "@/components/monitoring/MonitoringHeader";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { BarChart3, ClipboardList } from "lucide-react";
import { Outlet, Link, useLocation } from "react-router-dom";

export function MonitoringLayout() {
  const location = useLocation();

  const socialStatisticsItems = [
    {
      title: "Susenas Maret 2025",
      url: "/monitoring/social-statistics/ssn-m25",
      icon: ClipboardList,
    },
    {
      title: "Sakernas Februari 2025",
      url: "/monitoring/social-statistics/sak-f25",
      icon: BarChart3,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SidebarProvider>
        <div className="flex-1 flex w-full">
          {location.pathname.includes("/social-statistics") && (
            <Sidebar className="border-r">
              <SidebarContent className="bg-white">
                <SidebarGroup>
                  <SidebarGroupLabel>Statistik Sosial</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {socialStatisticsItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild>
                            <Link
                              to={item.url}
                              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                                location.pathname === item.url
                                  ? "text-primary bg-primary-light"
                                  : "hover:bg-gray-100"
                              }`}
                            >
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
          )}
          <div className="flex-1 flex flex-col min-w-0">
            <MonitoringHeader />
            <main className="flex-1 overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
