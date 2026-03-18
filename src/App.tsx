import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import TopNav from "@/components/TopNav";
import DemoPanel from "@/components/DemoPanel";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MedicalIntake from "./pages/MedicalIntake";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import BookAppointment from "./pages/BookAppointment";
import Admin from "./pages/Admin";
import PhysicianLogin from "./pages/PhysicianLogin";
import Orders from "./pages/Orders";
import Appointments from "./pages/Appointments";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Notifications from "./pages/Notifications";
import Receipt from "./pages/Receipt";
import Transactions from "./pages/Transactions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <NotificationProvider>
              <TopNav />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/intake" element={<MedicalIntake />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/book-appointment" element={<BookAppointment />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/auth/physician" element={<PhysicianLogin />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/receipt" element={<Receipt />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <DemoPanel />
            </NotificationProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
