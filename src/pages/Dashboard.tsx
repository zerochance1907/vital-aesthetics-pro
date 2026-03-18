import { useState, useEffect, useRef } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ClipboardList, CalendarDays, ShoppingBag, Lock, Activity, Package, FileText, CheckCircle2, User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) return <Navigate to="/login" />;
  if (user.isAdmin) return <Navigate to="/admin" />;

  const isPending = user.status === "pending";
  const displayName = (user.firstName || "").split(/\s+/)[0] || "there";

  const appointments: unknown[] = (() => { try { return JSON.parse(localStorage.getItem("appointments") || "[]"); } catch { return []; } })();
  const orders: unknown[] = (() => { try { return JSON.parse(localStorage.getItem("orders") || "[]"); } catch { return []; } })();

  const statCards = [
    { label: "Appointments", value: String(appointments.length), icon: CalendarDays },
    { label: "Orders", value: String(orders.length), icon: Package },
    { label: "Forms Submitted", value: user.intakeCompleted ? "1" : "0", icon: FileText },
    { label: "Status", value: isPending ? "Pending" : "Approved", icon: isPending ? Activity : CheckCircle2 },
  ];

  const cards = [
    {
      title: "Complete Medical Intake",
      desc: user.intakeCompleted ? "Intake form submitted ✓" : "Fill out your health history for physician review",
      icon: ClipboardList,
      to: "/intake",
      locked: false,
      progress: user.intakeCompleted,
      cta: "Complete Form",
    },
    {
      title: "Book an Appointment",
      desc: "Schedule a consultation with our physicians",
      icon: CalendarDays,
      to: "/book-appointment",
      locked: false,
      cta: "Book Now",
    },
    {
      title: "Visit Marketplace",
      desc: isPending
        ? "Pending Physician Approval — Complete your intake form and wait for review"
        : "Browse physician-approved treatments and products",
      icon: isPending ? Lock : ShoppingBag,
      to: "/marketplace",
      locked: isPending,
      cta: "Browse Marketplace",
    },
  ];

  const activities = [
    { text: "Account created", time: "Just now", dot: "bg-primary" },
    ...(user.intakeCompleted ? [{ text: "Medical intake form submitted", time: "Recently", dot: "bg-primary" }] : []),
    ...(isPending ? [{ text: "Awaiting physician review", time: "Pending", dot: "bg-warning" }] : [{ text: "Account approved by physician", time: "Recently", dot: "bg-primary" }]),
  ];

  const handleLogout = () => { logout(); navigate("/"); };
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="container max-w-5xl pt-24 pb-10 animate-fade-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className={`mb-4 inline-flex rounded-full px-4 py-1.5 text-sm font-body font-light ${isPending ? "bg-warning/10 text-warning" : "bg-primary/10 text-primary"}`}>
            {isPending ? "🟡 Pending Review" : "✅ Approved"}
          </div>
          <h1 className="font-display text-3xl font-medium text-foreground">Hey {displayName}! 👋</h1>
          <p className="mt-1 text-muted-foreground font-body font-light">What would you like to do today?</p>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-full border border-border bg-muted p-1 pr-3 hover:bg-accent transition-colors duration-300"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-body font-medium text-sm">
              {initial}
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-card shadow-lg z-50 animate-fade-in overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-body font-medium text-foreground">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-muted-foreground font-light truncate">{user.email}</p>
              </div>
              <div className="py-1">
                <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-300">
                  <User className="h-4 w-4" /> My Profile
                </Link>
                <Link to="/orders" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-300">
                  <Package className="h-4 w-4" /> My Orders
                </Link>
                <Link to="/appointments" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-300">
                  <CalendarDays className="h-4 w-4" /> My Appointments
                </Link>
              </div>
              <div className="border-t border-border py-1">
                <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors duration-300">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-[3px] hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground font-body font-light">{s.label}</span>
              <s.icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="mt-2 font-display text-2xl font-medium text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Action Cards */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(card => (
          <div key={card.title} className={`group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 ${card.locked ? "opacity-60" : "hover:-translate-y-[3px] hover:shadow-md"}`}>
            <div className="relative flex flex-col p-6 flex-1">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-primary">
                <card.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-medium text-foreground">{card.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground font-body font-light">{card.desc}</p>
              {"progress" in card && card.progress && (
                <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-full rounded-full bg-primary" />
                </div>
              )}
              <div className="mt-5">
                {card.locked ? (
                  <Button disabled className="w-full h-11" variant="secondary">LOCKED</Button>
                ) : (
                  <Button asChild className="w-full h-11">
                    <Link to={card.to}>{card.cta}</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Timeline */}
      <div className="mt-10">
        <h2 className="font-display text-lg font-medium text-foreground mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {activities.map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${a.dot}`} />
              <div>
                <p className="text-sm font-body font-medium text-foreground">{a.text}</p>
                <p className="text-xs text-muted-foreground font-light">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
