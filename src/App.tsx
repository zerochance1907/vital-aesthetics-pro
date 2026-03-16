import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
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
              <Route path="*" element={<NotFound />} />
            </Routes>
            <DemoPanel />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
