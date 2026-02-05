import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Budgets from "./pages/Budgets";
import Transactions from "./pages/Transactions";
import MarketData from "./pages/MarketData";
import CurrencyConverter from "./pages/CurrencyConverter";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { TwoFactorRoute } from "./context/TwoFactorRoute";
import TwoFactor from "./context/TwoFactor";
import { ProtectedLayout } from "./context/ProtectedLayout";
import { LoadingProvider } from "./context/LoadingContext";
import { useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();


const App = () => {

  const { role } = useAuth();
 
  return (
  <QueryClientProvider client={queryClient}>
    <LoadingProvider>
    <ThemeProvider defaultTheme="system" storageKey="financeapp-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* ROTAS PÚBLICAS */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* ROTA 2FA */}
            <Route
              path="/2fa"
              element={
                <TwoFactorRoute>
                  <TwoFactor />
                </TwoFactorRoute>
              }
            />

            {/* LAYOUT PROTEGIDO */}
            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<Index />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="transactions" element={<Transactions />} />
                {role === 'ROLE_CUSTOMER' && ( <Route path="budgets" element={<Budgets />} />)}
                <Route path="market-data" element={<MarketData />} />
                <Route
                  path="currency-converter"
                  element={<CurrencyConverter />}
                />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
   </LoadingProvider>
  </QueryClientProvider>
  

);
};

export default App;
