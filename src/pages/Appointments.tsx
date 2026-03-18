import { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { CalendarDays, ArrowLeft, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Appointment {
  id: string;
  service: string;
  date: string;
  time: string;
  status: string;
  createdAt?: string;
}

function getAppointments(): Appointment[] {
  try { return JSON.parse(localStorage.getItem("appointments") || "[]"); } catch { return []; }
}

function daysUntil(dateStr: string): number {
  const parts = dateStr.match(/(\d+)\s+(\w+)\s+(\d+)/);
  if (!parts) return -1;
  const target = new Date(`${parts[2]} ${parts[1]}, ${parts[3]}`);
  const diff = Math.ceil((target.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return diff;
}

function generateICS(a: Appointment): string {
  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${now}
SUMMARY:${a.service} - Harmony Medical Aesthetics
DESCRIPTION:Appointment at ${a.time} on ${a.date}
LOCATION:Harmony Medical Aesthetics
END:VEVENT
END:VCALENDAR`;
}

export default function Appointments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>(getAppointments());

  if (!user) return <Navigate to="/login" />;

  const cancel = (id: string) => {
    const updated = appointments.map(a => a.id === id ? { ...a, status: "cancelled" } : a);
    setAppointments(updated);
    localStorage.setItem("appointments", JSON.stringify(updated));
    toast.success("Appointment cancelled");
  };

  const downloadICS = (a: Appointment) => {
    const blob = new Blob([generateICS(a)], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `appointment-${a.id}.ics`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Calendar file downloaded");
  };

  const upcoming = appointments.filter(a => a.status === "upcoming" || a.status === "Upcoming");
  const completed = appointments.filter(a => a.status === "completed" || a.status === "Completed");
  const cancelled = appointments.filter(a => a.status === "cancelled");

  const nextAppointment = upcoming[0];
  const daysLeft = nextAppointment ? daysUntil(nextAppointment.date) : -1;

  const statusBadge = (s: string) => {
    const sl = s.toLowerCase();
    if (sl === "upcoming") return "bg-primary/10 text-primary";
    if (sl === "completed") return "bg-muted text-muted-foreground";
    return "bg-destructive/10 text-destructive";
  };

  return (
    <div className="container max-w-3xl pt-24 pb-10 animate-fade-in">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 font-body font-light mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>
      <h1 className="font-display text-3xl font-medium text-foreground">My Appointments</h1>
      <p className="mt-1 text-muted-foreground font-body font-light mb-6">Manage your scheduled consultations</p>

      {/* Countdown */}
      {nextAppointment && daysLeft >= 0 && (
        <div className="mb-8 rounded-xl border border-primary/20 bg-primary/5 p-5 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-body font-medium text-foreground">Your next appointment is in <span className="text-primary font-display text-lg">{daysLeft}</span> day{daysLeft !== 1 ? "s" : ""}</p>
            <p className="text-xs text-muted-foreground font-body font-light">{nextAppointment.service} — {nextAppointment.date} at {nextAppointment.time}</p>
          </div>
        </div>
      )}

      {appointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-12 text-center">
          <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-display text-lg font-medium text-foreground">No appointments yet</h3>
          <p className="mt-1 text-sm text-muted-foreground font-body font-light">Book a consultation with our physicians.</p>
          <Button asChild className="mt-6"><Link to="/book-appointment">BOOK APPOINTMENT</Link></Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div>
              <h2 className="font-display text-sm font-medium text-muted-foreground mb-3">UPCOMING</h2>
              <div className="space-y-3">
                {upcoming.map(a => (
                  <div key={a.id} className="rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-[3px] hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-primary">
                          <CalendarDays className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-display text-base font-medium text-foreground">{a.service}</p>
                          <p className="text-sm text-muted-foreground font-body font-light">{a.date} at {a.time}</p>
                        </div>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-body font-medium capitalize ${statusBadge(a.status)}`}>{a.status}</span>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => navigate(`/book-appointment`)}>Reschedule</Button>
                      <Button variant="outline" size="sm" onClick={() => cancel(a.id)} className="text-destructive hover:text-destructive">Cancel</Button>
                      <Button variant="outline" size="sm" onClick={() => downloadICS(a)}>
                        <Download className="h-3 w-3 mr-1" /> Add to Calendar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <div>
              <h2 className="font-display text-sm font-medium text-muted-foreground mb-3">COMPLETED</h2>
              <div className="space-y-3">
                {completed.map(a => (
                  <div key={a.id} className="rounded-xl border border-border bg-card p-5 opacity-70">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                          <CalendarDays className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-display text-base font-medium text-foreground">{a.service}</p>
                          <p className="text-sm text-muted-foreground font-body font-light">{a.date} at {a.time}</p>
                        </div>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-body font-medium ${statusBadge("completed")}`}>Completed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cancelled */}
          {cancelled.length > 0 && (
            <div>
              <h2 className="font-display text-sm font-medium text-muted-foreground mb-3">CANCELLED</h2>
              <div className="space-y-3">
                {cancelled.map(a => (
                  <div key={a.id} className="rounded-xl border border-border bg-card p-5 opacity-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                          <CalendarDays className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-display text-base font-medium text-foreground line-through">{a.service}</p>
                          <p className="text-sm text-muted-foreground font-body font-light">{a.date} at {a.time}</p>
                        </div>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-body font-medium ${statusBadge("cancelled")}`}>Cancelled</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
