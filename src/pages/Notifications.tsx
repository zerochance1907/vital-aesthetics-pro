import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications, Notification } from "@/contexts/NotificationContext";
import { Bell, ArrowLeft, UserPlus, FileText, CheckCircle2, XCircle, Package, Truck, MapPin, CalendarDays, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, React.ElementType> = {
  account_created: UserPlus,
  form_submitted: FileText,
  account_approved: CheckCircle2,
  account_rejected: XCircle,
  order_placed: Package,
  order_shipped: Truck,
  order_delivered: MapPin,
  appointment_confirmed: CalendarDays,
  appointment_reminder: Clock,
};

const colorMap: Record<string, string> = {
  account_created: "text-blue-500 bg-blue-500/10",
  form_submitted: "text-yellow-500 bg-yellow-500/10",
  account_approved: "text-primary bg-primary/10",
  account_rejected: "text-destructive bg-destructive/10",
  order_placed: "text-blue-500 bg-blue-500/10",
  order_shipped: "text-purple-500 bg-purple-500/10",
  order_delivered: "text-primary bg-primary/10",
  appointment_confirmed: "text-teal-500 bg-teal-500/10",
  appointment_reminder: "text-orange-500 bg-orange-500/10",
};

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function Notifications() {
  const { user } = useAuth();
  const { notifications, markRead, markAllRead } = useNotifications();

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="container max-w-2xl pt-24 pb-10 animate-fade-in">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 font-body font-light mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-medium text-foreground">Notifications</h1>
          <p className="mt-1 text-muted-foreground font-body font-light">Stay updated on your account activity</p>
        </div>
        {notifications.some(n => !n.read) && (
          <Button variant="outline" size="sm" onClick={markAllRead}>Mark all read</Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-12 text-center">
          <Bell className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-display text-lg font-medium text-foreground">No notifications yet</h3>
          <p className="mt-1 text-sm text-muted-foreground font-body font-light">We'll notify you about important updates.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => {
            const Icon = iconMap[n.type] || Bell;
            const colors = colorMap[n.type] || "text-muted-foreground bg-muted";
            return (
              <div
                key={n.id}
                onClick={() => !n.read && markRead(n.id)}
                className={`flex items-start gap-3 rounded-xl border bg-card p-4 transition-all duration-300 hover:-translate-y-[3px] hover:shadow-md cursor-pointer ${
                  n.read ? "border-border opacity-70" : "border-l-[3px] border-l-blue-500 border-t-border border-r-border border-b-border"
                }`}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${colors}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-body ${n.read ? "font-light" : "font-medium"} text-foreground`}>{n.title}</p>
                  <p className="text-xs text-muted-foreground font-body font-light mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground font-light mt-1">{timeAgo(n.timestamp)}</p>
                </div>
                {!n.read && <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-2" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
