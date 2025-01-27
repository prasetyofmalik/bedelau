import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Monitoring from "./pages/Monitoring";
import MailsRecap from "./pages/general-subsection/MailsRecap";
import SsnM25 from "./pages/social-statistics/SsnM25";
import SakF25 from "./pages/social-statistics/SakF25";
import { MonitoringLayout } from "@/components/monitoring/MonitoringLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
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
          <Route path="/monitoring" element={<MonitoringLayout />}>
            <Route index element={<Monitoring />} />
            <Route
              path="general-subsection"
              element={
                <Navigate to="/monitoring/general-subsection/mails-recap" replace />
              }
            />
            <Route path="general-subsection/mails-recap" element={<ProtectedRoute><MailsRecap /></ProtectedRoute>} />
            <Route
              path="social-statistics"
              element={
                <Navigate to="/monitoring/social-statistics/ssn-m25" replace />
              }
            />
            <Route path="social-statistics/ssn-m25" element={<SsnM25 />} />
            <Route path="social-statistics/sak-f25" element={<SakF25 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
