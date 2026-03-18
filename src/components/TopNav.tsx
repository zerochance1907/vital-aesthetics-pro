import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { ShoppingCart, Menu, X, Sun, Moon, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

function useTheme() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("theme") === "dark";
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);
  return { dark, toggle: () => setDark(d => !d) };
}

export default function TopNav() {
  const { user, logout } = useAuth();
  const { itemCount, setDrawerOpen } = useCart();
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const { dark, toggle } = useTheme();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinkClass = "font-body font-light text-sm text-stone transition-colors duration-300 hover:text-primary";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-b border-border transition-colors duration-300">
      <div className="container flex h-16 items-center justify-between">
        <Link to={user ? (user.isAdmin ? "/admin" : "/dashboard") : "/"} className="font-body text-xl font-medium text-foreground transition-colors duration-300">
          Med<span className="text-primary">Aesthetics</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {user ? (
            user.isAdmin ? (
              <>
                <Link to="/admin" className={navLinkClass}>Admin</Link>
                <Button variant="ghost" size="sm" onClick={() => { logout(); navigate("/"); }}>Sign Out</Button>
              </>
            ) : (
              <>
                <Link to="/dashboard" className={navLinkClass}>Dashboard</Link>
                <Link to="/marketplace" className={navLinkClass}>Marketplace</Link>
                <Link to="/book-appointment" className={navLinkClass}>Book Appointment</Link>

                {/* Notifications Bell */}
                <div className="relative" ref={notifRef}>
                  <button onClick={() => setNotifOpen(!notifOpen)} className="relative text-stone hover:text-primary transition-colors duration-300">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white animate-fade-in">{unreadCount}</span>
                    )}
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-card shadow-xl z-50 animate-fade-in overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                        <span className="text-sm font-body font-medium text-foreground">Notifications</span>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-xs text-primary hover:underline font-body font-light">Mark all read</button>
                        )}
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="px-4 py-6 text-center text-sm text-muted-foreground font-body font-light">No notifications</p>
                        ) : (
                          notifications.slice(0, 5).map(n => (
                            <div key={n.id} className={`px-4 py-3 border-b border-border/50 text-sm transition-colors duration-300 ${!n.read ? "bg-primary/5" : ""}`}>
                              <p className={`font-body ${n.read ? "font-light text-muted-foreground" : "font-medium text-foreground"}`}>{n.title}</p>
                              <p className="text-xs text-muted-foreground font-light mt-0.5 truncate">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                      <Link to="/notifications" onClick={() => setNotifOpen(false)} className="block px-4 py-2.5 text-center text-xs text-primary font-body font-medium hover:bg-muted transition-colors duration-300">
                        View All →
                      </Link>
                    </div>
                  )}
                </div>

                <button onClick={() => setDrawerOpen(true)} className="relative text-stone hover:text-primary transition-colors duration-300">
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
              <Link to="/" className={navLinkClass}>Home</Link>
              <Link to="/auth/physician" className={navLinkClass}>For Physicians →</Link>
              <Link to="/login" className={navLinkClass}>Sign In</Link>
              <Button size="sm" onClick={() => navigate("/register")}>Create Account</Button>
            </>
          )}

          <button onClick={toggle} className="flex h-8 items-center rounded-full border border-border bg-muted px-1 transition-colors duration-300" aria-label="Toggle theme">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300 ${!dark ? "bg-primary text-primary-foreground" : "text-stone"}`}><Sun className="h-3.5 w-3.5" /></span>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300 ${dark ? "bg-primary text-primary-foreground" : "text-stone"}`}><Moon className="h-3.5 w-3.5" /></span>
          </button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          {user && !user.isAdmin && (
            <button onClick={() => setNotifOpen(!notifOpen)} className="relative text-stone hover:text-primary transition-colors duration-300">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-white">{unreadCount}</span>}
            </button>
          )}
          <button onClick={toggle} className="flex h-8 items-center rounded-full border border-border bg-muted px-1" aria-label="Toggle theme">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300 ${!dark ? "bg-primary text-primary-foreground" : "text-stone"}`}><Sun className="h-3.5 w-3.5" /></span>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300 ${dark ? "bg-primary text-primary-foreground" : "text-stone"}`}><Moon className="h-3.5 w-3.5" /></span>
          </button>
          <button className="text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-card p-4 animate-fade-in">
          <nav className="flex flex-col gap-3">
            {user ? (
              user.isAdmin ? (
                <>
                  <Link to="/admin" onClick={() => setMobileOpen(false)} className={navLinkClass}>Admin</Link>
                  <button onClick={() => { logout(); navigate("/"); setMobileOpen(false); }} className={navLinkClass + " text-left"}>Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className={navLinkClass}>Dashboard</Link>
                  <Link to="/marketplace" onClick={() => setMobileOpen(false)} className={navLinkClass}>Marketplace</Link>
                  <Link to="/book-appointment" onClick={() => setMobileOpen(false)} className={navLinkClass}>Book Appointment</Link>
                  <Link to="/notifications" onClick={() => setMobileOpen(false)} className={navLinkClass}>Notifications</Link>
                  <Link to="/transactions" onClick={() => setMobileOpen(false)} className={navLinkClass}>Transactions</Link>
                  <button onClick={() => { logout(); navigate("/"); setMobileOpen(false); }} className={navLinkClass + " text-left"}>Sign Out</button>
                </>
              )
            ) : (
              <>
                <Link to="/" onClick={() => setMobileOpen(false)} className={navLinkClass}>Home</Link>
                <Link to="/auth/physician" onClick={() => setMobileOpen(false)} className={navLinkClass}>For Physicians →</Link>
                <Link to="/login" onClick={() => setMobileOpen(false)} className={navLinkClass}>Sign In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className={navLinkClass}>Create Account</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
