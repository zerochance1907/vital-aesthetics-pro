import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Users, CheckCircle2, Clock, ShoppingBag, CalendarDays, Shield } from "lucide-react";
import { toast } from "sonner";

type Tab = "overview" | "pending" | "all" | "orders" | "appointments";

export default function Admin() {
  const { user, getAllPatients, approvePatient, rejectPatient } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [patients, setPatients] = useState(getAllPatients());

  useEffect(() => {
    setPatients(getAllPatients());
  }, [tab, getAllPatients]);

  if (!user?.isAdmin) return <Navigate to="/login" />;

  const pending = patients.filter(p => p.status === "pending");
  const approved = patients.filter(p => p.status === "approved");

  const handleApprove = (email: string) => {
    approvePatient(email);
    setPatients(getAllPatients());
    toast.success("Patient approved!");
  };

  const handleReject = (email: string) => {
    rejectPatient(email);
    setPatients(getAllPatients());
    toast.error("Patient rejected.");
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: Shield },
    { id: "pending", label: "Pending", icon: Clock },
    { id: "all", label: "All Patients", icon: Users },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "appointments", label: "Appointments", icon: CalendarDays },
  ];

  return (
    <div className="flex min-h-screen pt-16">
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-border bg-card p-4 gap-1">
        <h2 className="px-3 py-2 font-display text-sm font-medium text-foreground">Admin Panel</h2>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 rounded-[6px] px-3 py-2 text-sm font-body font-light transition-colors duration-300 ${
              tab === t.id
                ? "bg-muted text-primary border-l-[3px] border-l-primary pl-[9px]"
                : "text-muted-foreground hover:bg-muted"
            }`}>
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </aside>

      {/* Mobile tabs */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-card">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-body transition-colors duration-300 ${tab === t.id ? "text-primary" : "text-muted-foreground"}`}>
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 md:p-10 animate-fade-in">
        {tab === "overview" && (
          <div>
            <h1 className="font-display text-2xl font-medium text-foreground">Dashboard Overview</h1>
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard label="Total Patients" value={patients.length} icon={Users} />
              <StatCard label="Pending Review" value={pending.length} icon={Clock} />
              <StatCard label="Approved" value={approved.length} icon={CheckCircle2} />
              <StatCard label="Orders" value={0} icon={ShoppingBag} />
            </div>
          </div>
        )}

        {tab === "pending" && (
          <div>
            <h1 className="font-display text-2xl font-medium text-foreground">Pending Patients</h1>
            <p className="mt-1 text-muted-foreground font-body font-light">{pending.length} patients awaiting review</p>
            <div className="mt-6 space-y-3">
              {pending.length === 0 && <p className="text-muted-foreground text-sm font-body font-light">No pending patients.</p>}
              {pending.map(p => (
                <div key={p.email} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-[3px] hover:shadow-md">
                  <div>
                    <p className="font-body font-medium text-foreground">{p.firstName} {p.lastName}</p>
                    <p className="text-sm text-muted-foreground font-body font-light">{p.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleApprove(p.email)}>APPROVE</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleReject(p.email)}>REJECT</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "all" && (
          <div>
            <h1 className="font-display text-2xl font-medium text-foreground">All Patients</h1>
            <div className="mt-6 overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left font-body font-light text-muted-foreground">Name</th>
                    <th className="px-4 py-3 text-left font-body font-light text-muted-foreground">Email</th>
                    <th className="px-4 py-3 text-left font-body font-light text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left font-body font-light text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(p => (
                    <tr key={p.email} className="border-t border-border">
                      <td className="px-4 py-3 font-body font-medium text-foreground">{p.firstName} {p.lastName}</td>
                      <td className="px-4 py-3 text-muted-foreground font-body font-light">{p.email}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-body font-light ${p.status === "approved" ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {p.status === "pending" && <Button size="sm" variant="outline" onClick={() => handleApprove(p.email)}>APPROVE</Button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "orders" && (
          <div>
            <h1 className="font-display text-2xl font-medium text-foreground">Orders</h1>
            <p className="mt-4 text-muted-foreground text-sm font-body font-light">No orders yet.</p>
          </div>
        )}

        {tab === "appointments" && (
          <div>
            <h1 className="font-display text-2xl font-medium text-foreground">Appointments</h1>
            <p className="mt-4 text-muted-foreground text-sm font-body font-light">No appointments yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-[3px] hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground font-body font-light">{label}</span>
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <p className="mt-2 font-display text-2xl font-medium text-foreground">{value}</p>
    </div>
  );
}
