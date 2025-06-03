import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import QAF from "./pages/QAF";
import Monitoring from "./pages/Monitoring";
import MailsRecap from "./pages/umum/MailsRecap";
import SKPRecap from "./pages/umum/SKPRecap";
import TeamEvaluation from "./pages/umum/TeamEvaluation";
import WorkPlan from "./pages/WorkPlan";
import SsnM25 from "./pages/ansos/SsnM25";
import SakF25 from "./pages/ansos/SakF25";
import Podes25 from "./pages/ansos/Podes25";
import Seruti25 from "./pages/ansos/Seruti25";
import Supas25 from "./pages/ansos/Supas25";
import { teams } from "@/components/monitoring/teamsData";
import { MonitoringLayout } from "@/components/monitoring/MonitoringLayout";
import { useTeamAccess } from "@/hooks/useTeamAccess";

const queryClient = new QueryClient();

// Define TeamWorkPlanRoute component to handle routing with team access permissions
interface TeamWorkPlanRouteProps {
  teamId: number;
  teamName: string;
}

const TeamWorkPlanRoute: React.FC<TeamWorkPlanRouteProps> = ({ teamId, teamName }) => {
  const { hasAccess, isLoading } = useTeamAccess(teamId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!hasAccess) {
    return <Navigate to="/monitoring" replace />;
  }

  return <WorkPlan teamId={teamId} teamName={teamName} />;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/qaf" element={<QAF />} />

            {/* Protected routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />

            {/* Monitoring routes */}
            <Route path="/monitoring" element={<MonitoringLayout />}>
              <Route index element={<Monitoring />} />
              {teams.map((team) => (
                <Route
                  path={team.name.toLowerCase()}
                  element={<Navigate to={"work-plan"} replace />}
                />
              ))}
              <Route
                path="umum/work-plan"
                element={
                  <ProtectedRoute>
                    <TeamWorkPlanRoute teamId={1} teamName="UMUM" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="ansos/work-plan"
                element={
                  <ProtectedRoute>
                    <TeamWorkPlanRoute teamId={2} teamName="ANSOS" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="kape/work-plan"
                element={
                  <ProtectedRoute>
                    <TeamWorkPlanRoute teamId={3} teamName="KAPE" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="neodist/work-plan"
                element={
                  <ProtectedRoute>
                    <TeamWorkPlanRoute teamId={4} teamName="NEODIST" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="nasa/work-plan"
                element={
                  <ProtectedRoute>
                    <TeamWorkPlanRoute teamId={5} teamName="NASA" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="pjd/work-plan"
                element={
                  <ProtectedRoute>
                    <TeamWorkPlanRoute teamId={6} teamName="PJD" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="ss/work-plan"
                element={
                  <ProtectedRoute>
                    <TeamWorkPlanRoute teamId={7} teamName="SS" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="sakip/work-plan"
                element={
                  <ProtectedRoute>
                    <TeamWorkPlanRoute teamId={8} teamName="SAKIP" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="pekppp/work-plan"
                element={
                  <ProtectedRoute>
                    <TeamWorkPlanRoute teamId={9} teamName="PEKPPP" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="rb/work-plan"
                element={
                  <ProtectedRoute>
                    <TeamWorkPlanRoute teamId={10} teamName="RB" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="humas/work-plan"
                element={
                  <ProtectedRoute>
                    <TeamWorkPlanRoute teamId={11} teamName="HUMAS" />
                  </ProtectedRoute>
                }
              />

              {/* Existing routes */}
              <Route
                path="umum/mails-recap"
                element={
                  <ProtectedRoute>
                    <MailsRecap />
                  </ProtectedRoute>
                }
              />
              <Route
                path="umum/skp-recap"
                element={
                  <ProtectedRoute>
                    <SKPRecap />
                  </ProtectedRoute>
                }
              />
              <Route
                path="umum/team-evaluation"
                element={
                  <ProtectedRoute>
                    <TeamEvaluation />
                  </ProtectedRoute>
                }
              />
              <Route path="ansos/ssn-m25" element={<SsnM25 />} />
              <Route path="ansos/sak-f25" element={<SakF25 />} />
              <Route path="ansos/podes25" element={<Podes25 />} />
              <Route path="ansos/seruti25" element={<Seruti25 />} />
              <Route path="ansos/supas25" element={<Supas25 />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      <SpeedInsights />
      <Analytics />
    </QueryClientProvider>
  );
};

export default App;
