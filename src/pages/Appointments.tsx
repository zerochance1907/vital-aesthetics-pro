import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { CalendarDays, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Appointment {
  id: string;
  service: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
}

function getAppointments(): Appointment[] {
  try {
    return JSON.parse(localStorage.getItem("appointments") || "[]");
  } catch {
    return [];
  }
}

export default function Appointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>(getAppointments());

  if (!user) return <Navigate to="/login" />;

  const cancel = (id: string) => {
    const updated = appointments.map(a => a.id === id ? { ...a, status: "cancelled" as const } : a);
    setAppointments(updated);
    localStorage.setItem("appointments", JSON.stringify(updated));
    toast.success("Appointment cancelled");
  };

  const statusBadge = (s: string) => {
    if (s === "upcoming") return "bg-primary/10 text-primary";
    if (s === "completed") return "bg-muted text-muted-foreground";
    return "bg-destructive/10 text-destructive";
  };

  return (
    <div className="container max-w-3xl pt-24 pb-10 animate-fade-in">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 font-body font-light mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>
      <h1 className="font-display text-3xl font-medium text-foreground">My Appointments</h1>
      <p className="mt-1 text-muted-foreground font-body font-light mb-8">Manage your scheduled consultations</p>

      {appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-12 text-center">
          <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-display text-lg font-medium text-foreground">No appointments yet</h3>
          <p className="mt-1 text-sm text-muted-foreground font-body font-light">Book a consultation with our physicians.</p>
          <Button asChild className="mt-6">
            <Link to="/book-appointment">BOOK APPOINTMENT</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map(a => (
            <div key={a.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-[3px] hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-primary">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display text-base font-medium text-foreground">{a.service}</p>
                  <p className="text-sm text-muted-foreground font-body font-light">{a.date} at {a.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-body font-medium capitalize ${statusBadge(a.status)}`}>{a.status}</span>
                {a.status === "upcoming" && (
                  <Button variant="outline" size="sm" onClick={() => cancel(a.id)}>Cancel</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
