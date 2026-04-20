import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/router/ProtectedRoute";
import { ClerkProvider, AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import VerifyEmailPage from "./pages/VerifyEmail";
import DashboardPage from "./pages/Dashboard";
import PricingEnginePage from "./pages/PricingEngine";
import MarketTrendsPage from "./pages/MarketTrends";
import EvaluationPage from "./pages/Evaluation";
import ComparisonPage from "./pages/Comparison";
import MonitoringPage from "./pages/Monitoring";
import TransactionsPage from "./pages/Transactions";
import InsightsPage from "./pages/Insights";
import ListingsPage from "./pages/Listings";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const queryClient = new QueryClient();

// Ensure the window scrolls back to top when a user navigates to a new page
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const App = () => (
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/login">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />
            <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/pricing-engine" element={<ProtectedRoute><PricingEnginePage /></ProtectedRoute>} />
            <Route path="/market-trends" element={<ProtectedRoute><MarketTrendsPage /></ProtectedRoute>} />
            <Route path="/evaluation" element={<ProtectedRoute><EvaluationPage /></ProtectedRoute>} />
            <Route path="/comparison" element={<ProtectedRoute><ComparisonPage /></ProtectedRoute>} />
            <Route path="/monitoring" element={<ProtectedRoute><MonitoringPage /></ProtectedRoute>} />
            <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
            <Route path="/insights" element={<ProtectedRoute><InsightsPage /></ProtectedRoute>} />
            <Route path="/listings" element={<ProtectedRoute><ListingsPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;
