import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function TopNav() {
  const { user, logout } = useAuth();
  const { itemCount, setDrawerOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isTransparent = isHomePage && !scrolled && !user;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isTransparent
        ? "bg-transparent border-b border-transparent"
        : "bg-card/95 backdrop-blur-lg border-b border-border shadow-sm"
    }`}>
      <div className="container flex h-16 items-center justify-between">
        <Link to={user ? (user.isAdmin ? "/admin" : "/dashboard") : "/"} className={`font-display text-xl font-bold transition-colors ${isTransparent ? "text-white" : "text-navy"}`}>
          Med<span className="text-primary">Aesthetics</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {user ? (
            user.isAdmin ? (
              <>
                <Link to="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Admin</Link>
                <Button variant="ghost" size="sm" onClick={() => { logout(); navigate("/"); }}>Sign Out</Button>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
                <Link to="/marketplace" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Marketplace</Link>
                <Link to="/book-appointment" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Book Appointment</Link>
                <button onClick={() => setDrawerOpen(true)} className="relative text-muted-foreground hover:text-foreground transition-colors">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-fade-in">{itemCount}</span>
                  )}
                </button>
                <Button variant="ghost" size="sm" onClick={() => { logout(); navigate("/"); }}>Sign Out</Button>
              </>
            )
          ) : (
            <>
              <Link to="/" className={`text-sm font-medium transition-colors ${isTransparent ? "text-white/80 hover:text-white" : "text-muted-foreground hover:text-foreground"}`}>Home</Link>
              <Link to="/login" className={`text-sm font-medium transition-colors ${isTransparent ? "text-white/80 hover:text-white" : "text-muted-foreground hover:text-foreground"}`}>Sign In</Link>
              <Button size="sm" onClick={() => navigate("/register")}>Create Account</Button>
            </>
          )}
        </nav>

        <button className={`md:hidden ${isTransparent ? "text-white" : "text-foreground"}`} onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-card p-4 animate-fade-in">
          <nav className="flex flex-col gap-3">
            {user ? (
              user.isAdmin ? (
                <>
                  <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Admin</Link>
                  <button onClick={() => { logout(); navigate("/"); setMobileOpen(false); }} className="text-sm font-medium text-left">Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Dashboard</Link>
                  <Link to="/marketplace" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Marketplace</Link>
                  <Link to="/book-appointment" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Book Appointment</Link>
                  <button onClick={() => { logout(); navigate("/"); setMobileOpen(false); }} className="text-sm font-medium text-left">Sign Out</button>
                </>
              )
            ) : (
              <>
                <Link to="/" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Home</Link>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Sign In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="text-sm font-medium">Create Account</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
