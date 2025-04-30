import { Header } from "@/components/Header";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarProvider,
// } from "@/components/ui/sidebar";
import { LucideHome } from "lucide-react";
import { Outlet, Link, useLocation } from "react-router-dom";

export default function QAF() {
  // const location = useLocation();
  // const monitoringSubpages = teams.map((team) => `/${team.name.toLowerCase()}`);
  // const isSubpage = monitoringSubpages.some((path) =>
  //   location.pathname.includes(path)
  // );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      {/* <SidebarProvider> */}
        <div className="flex-1 flex w-full">
          {/* {isSubpage && (
            <Sidebar className="border-r">
              <SidebarContent className="bg-white gap-1">
                <SidebarGroup  className="p-4">
                  <Link to="/">
                    <img
                      src="/img/bedelau-logo-min.png"
                      alt="Bedelau Logo"
                      className="h-8 w-auto"
                    />
                  </Link>
                </SidebarGroup>
                <SidebarGroup className="py-1">
                  <SidebarGroupLabel>Monitoring</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem key="Beranda">
                        <SidebarMenuButton asChild>
                          <Link
                            to="/monitoring"
                            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                              location.pathname === "/monitoring"
                                ? "text-primary bg-primary-light"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <LucideHome className="h-4 w-4" />
                            <span>Beranda</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                {teams.map((team) => (
                  location.pathname.includes(`/${team.name.toLowerCase()}`) && (
                  <SidebarGroup key={team.id} className="py-1">
                    <SidebarGroupLabel>{team.text}</SidebarGroupLabel>
                    <SidebarGroupContent>
                    <SidebarMenu>
                      {team.items.map((item) => (
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
                  )
                ))}
              </SidebarContent>
            </Sidebar>
          )} */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* {isSubpage && <MonitoringHeader />} */}
            <main className="flex-1 overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
      {/* </SidebarProvider> */}
    </div>
  );
}