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
import Monitoring from "./pages/Monitoring";
import MailsRecap from "./pages/general-subsection/MailsRecap";
import SKPRecap from "./pages/general-subsection/SKPRecap";
import TeamEvaluation from "./pages/general-subsection/TeamEvaluation";
import WorkPlan from "./pages/general-subsection/WorkPlan";
import SsnM25 from "./pages/social-statistics/SsnM25";
import SakF25 from "./pages/social-statistics/SakF25";
import { MonitoringLayout } from "@/components/monitoring/MonitoringLayout";
import { useTeamAccess } from "@/hooks/useTeamAccess";

const queryClient = new QueryClient();

const App = () => {
  const TeamWorkPlanRoute = ({
    teamId,
    teamName,
  }: {
    teamId: number;
    teamName: string;
  }) => {
    const { hasAccess, isLoading } = useTeamAccess(teamId);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!hasAccess) {
      return <Navigate to="/monitoring" replace />;
    }

    return <WorkPlan teamId={teamId} teamName={teamName} />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Existing routes */}
            <Route path="/monitoring" element={<MonitoringLayout />}>
              <Route index element={<Monitoring />} />

              {/* General Subsection Work Plan */}
              <Route
                path="general-subsection/work-plan"
                element={
                  <ProtectedRoute>
                    <TeamWorkPlanRoute teamId={1} teamName="UMUM" />
                  </ProtectedRoute>
                }
              />

              {/* Social Statistics Work Plan */}
              <Route
                path="social-statistics/work-plan"
                element={
                  <ProtectedRoute>
                    <TeamWorkPlanRoute teamId={2} teamName="ANSOS" />
                  </ProtectedRoute>
                }
              />

              {/* Add routes for other teams */}
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
                path="general-subsection/mails-recap"
                element={
                  <ProtectedRoute>
                    <MailsRecap />
                  </ProtectedRoute>
                }
              />
              <Route
                path="general-subsection/skp-recap"
                element={
                  <ProtectedRoute>
                    <SKPRecap />
                  </ProtectedRoute>
                }
              />
              <Route
                path="general-subsection/team-evaluation"
                element={
                  <ProtectedRoute>
                    <TeamEvaluation />
                  </ProtectedRoute>
                }
              />
              <Route path="social-statistics/ssn-m25" element={<SsnM25 />} />
              <Route path="social-statistics/sak-f25" element={<SakF25 />} />
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
