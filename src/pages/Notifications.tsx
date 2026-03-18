import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, ArrowLeft } from "lucide-react";

export default function Notifications() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;

  const notifications = [
    ...(user.status === "pending" ? [{ text: "Your account is pending physician review", time: "Now", type: "warning" as const }] : []),
    ...(user.intakeCompleted ? [{ text: "Medical intake form submitted successfully", time: "Recently", type: "success" as const }] : [{ text: "Complete your medical intake form to continue", time: "Action needed", type: "info" as const }]),
    { text: "Welcome to MedAesthetics!", time: "On signup", type: "info" as const },
  ];

  const dotColor = (t: string) => t === "warning" ? "bg-warning" : t === "success" ? "bg-primary" : "bg-muted-foreground";

  return (
    <div className="container max-w-2xl pt-24 pb-10 animate-fade-in">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 font-body font-light mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>
      <h1 className="font-display text-3xl font-medium text-foreground">Notifications</h1>
      <p className="mt-1 text-muted-foreground font-body font-light mb-8">Stay updated on your account activity</p>

      <div className="space-y-3">
        {notifications.map((n, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-[3px] hover:shadow-md">
            <div className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dotColor(n.type)}`} />
            <div className="flex-1">
              <p className="text-sm font-body font-medium text-foreground">{n.text}</p>
              <p className="text-xs text-muted-foreground font-light">{n.time}</p>
            </div>
            <Bell className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          </div>
        ))}
      </div>
    </div>
  );
}
