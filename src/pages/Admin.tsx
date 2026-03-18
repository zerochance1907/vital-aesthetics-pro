import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Users, CheckCircle2, Clock, ShoppingBag, CalendarDays, Shield, Stethoscope, X, Eye, UserCheck, UserX, MessageSquare } from "lucide-react";
import { toast } from "sonner";

type Tab = "overview" | "pending" | "approved" | "rejected" | "orders" | "appointments" | "messages";

interface IntakeData {
  personal: { fullName: string; email: string; dob: string; gender: string; height: string; weight: string; phone: string };
  conditions: string[];
  medications: string;
  allergies: string;
  surgeries: string;
  familyHistory: string;
  goals: string[];
  goalDetails: string;
  signature: string;
  submittedAt: string;
  idFileName?: string;
  photoFileName?: string;
  [key: string]: unknown;
}

function getIntakeData(email: string): IntakeData | null {
  try {
    const all = JSON.parse(localStorage.getItem("intake_submissions") || "{}");
    return all[email] || null;
  } catch { return null; }
}

function getAppointments(): { id: string; service: string; date: string; time: string; status: string }[] {
  try { return JSON.parse(localStorage.getItem("appointments") || "[]"); } catch { return []; }
}

function getOrders(): { id: string; items: { name: string; price: number; quantity: number }[]; total: number; date: string; step: number; patientEmail?: string; patientName?: string; tracking?: string; status?: string }[] {
  try { return JSON.parse(localStorage.getItem("orders") || "[]"); } catch { return []; }
}

export default function Admin() {
  const { user, getAllPatients, approvePatient, rejectPatient } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [patients, setPatients] = useState(getAllPatients());
  const [viewingIntake, setViewingIntake] = useState<{ email: string; data: IntakeData } | null>(null);
  const [orders, setOrders] = useState(getOrders());

  useEffect(() => {
    setPatients(getAllPatients());
    setOrders(getOrders());
  }, [tab, getAllPatients]);

  if (!user?.isAdmin) return <Navigate to="/login" />;

  const pending = patients.filter(p => p.status === "pending");
  const approved = patients.filter(p => p.status === "approved");

  const handleApprove = (email: string) => {
    approvePatient(email);
    setPatients(getAllPatients());
    toast.success("Patient approved — they now have marketplace access");
    setViewingIntake(null);
  };

  const handleReject = (email: string) => {
    rejectPatient(email);
    setPatients(getAllPatients());
    toast.error("Patient rejected.");
    setViewingIntake(null);
  };

  const viewForm = (email: string) => {
    const data = getIntakeData(email);
    if (data) setViewingIntake({ email, data });
    else toast.error("No intake form found for this patient.");
  };

  const updateOrderStatus = (idx: number, status: string) => {
    const updated = [...orders];
    updated[idx] = { ...updated[idx], status, step: status === "Processing" ? 1 : status === "Shipped" ? 2 : status === "Delivered" ? 3 : 0 };
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  };

  const updateOrderTracking = (idx: number, tracking: string) => {
    const updated = [...orders];
    updated[idx] = { ...updated[idx], tracking };
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: Shield },
    { id: "pending", label: "Pending Review", icon: Clock },
    { id: "approved", label: "Approved", icon: UserCheck },
    { id: "rejected", label: "Rejected", icon: UserX },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "appointments", label: "Appointments", icon: CalendarDays },
    { id: "messages", label: "Messages", icon: MessageSquare },
  ];

  const appointments = getAppointments();

  return (
    <div className="flex min-h-screen pt-16">
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-border bg-card p-4 gap-1">
        <h2 className="px-3 py-2 font-display text-sm font-medium text-foreground">Admin Panel</h2>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 rounded-[6px] px-3 py-2 text-sm font-body font-light transition-colors duration-300 ${
              tab === t.id ? "bg-muted text-primary border-l-[3px] border-l-primary pl-[9px]" : "text-muted-foreground hover:bg-muted"
            }`}>
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </aside>

      {/* Mobile tabs */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-card overflow-x-auto">
        {tabs.slice(0, 5).map(t => (
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
              <StatCard label="Pending Reviews" value={pending.length} icon={Clock} />
              <StatCard label="Approved Today" value={approved.length} icon={CheckCircle2} />
              <StatCard label="Total Patients" value={patients.length} icon={Users} />
              <StatCard label="Appointments" value={appointments.length} icon={CalendarDays} />
            </div>
          </div>
        )}

        {tab === "pending" && (
          <div>
            <h1 className="font-display text-2xl font-medium text-foreground">Pending Patients</h1>
            <p className="mt-1 text-muted-foreground font-body font-light">{pending.length} patients awaiting review</p>
            <div className="mt-6 overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left font-body font-light text-muted-foreground">Name</th>
                    <th className="px-4 py-3 text-left font-body font-light text-muted-foreground">Email</th>
                    <th className="px-4 py-3 text-left font-body font-light text-muted-foreground">Intake</th>
                    <th className="px-4 py-3 text-left font-body font-light text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground font-body font-light">No pending patients</td></tr>}
                  {pending.map(p => {
                    const intake = getIntakeData(p.email);
                    return (
                      <tr key={p.email} className="border-t border-border">
                        <td className="px-4 py-3 font-body font-medium text-foreground">{p.firstName} {p.lastName}</td>
                        <td className="px-4 py-3 text-muted-foreground font-body font-light">{p.email}</td>
                        <td className="px-4 py-3">
                          {intake ? (
                            <span className="text-xs text-primary font-body font-light">Submitted</span>
                          ) : (
                            <span className="text-xs text-warning font-body font-light">Not submitted</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => viewForm(p.email)}>
                              <Eye className="h-3 w-3 mr-1" /> View
                            </Button>
                            <Button size="sm" onClick={() => handleApprove(p.email)}>APPROVE</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(p.email)}>REJECT</Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "approved" && (
          <div>
            <h1 className="font-display text-2xl font-medium text-foreground">Approved Patients</h1>
            <div className="mt-6 space-y-3">
              {approved.length === 0 && <p className="text-muted-foreground text-sm font-body font-light">No approved patients yet.</p>}
              {approved.map(p => (
                <div key={p.email} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-[3px] hover:shadow-md">
                  <div>
                    <p className="font-body font-medium text-foreground">{p.firstName} {p.lastName}</p>
                    <p className="text-sm text-muted-foreground font-body font-light">{p.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => viewForm(p.email)}>
                      <Eye className="h-3 w-3 mr-1" /> View History
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "rejected" && (
          <div>
            <h1 className="font-display text-2xl font-medium text-foreground">Rejected Patients</h1>
            <p className="mt-4 text-muted-foreground text-sm font-body font-light">Patients whose applications were rejected will appear here.</p>
          </div>
        )}

        {tab === "orders" && (
          <div>
            <h1 className="font-display text-2xl font-medium text-foreground">Orders Management</h1>
            <div className="mt-6 overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left font-body font-light text-muted-foreground">Order ID</th>
                    <th className="px-4 py-3 text-left font-body font-light text-muted-foreground">Patient</th>
                    <th className="px-4 py-3 text-left font-body font-light text-muted-foreground">Products</th>
                    <th className="px-4 py-3 text-left font-body font-light text-muted-foreground">Total</th>
                    <th className="px-4 py-3 text-left font-body font-light text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left font-body font-light text-muted-foreground">Tracking</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground font-body font-light">No orders yet</td></tr>}
                  {orders.map((o, idx) => (
                    <tr key={o.id || idx} className="border-t border-border">
                      <td className="px-4 py-3 font-mono text-xs text-foreground">{o.id || `ORD-${idx + 1}`}</td>
                      <td className="px-4 py-3 text-foreground font-body font-light">{o.patientName || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground font-body font-light text-xs">{o.items?.map(i => i.name).join(", ") || "—"}</td>
                      <td className="px-4 py-3 font-body font-medium text-foreground">${o.total?.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <Select value={o.status || "Processing"} onValueChange={v => updateOrderStatus(idx, v)}>
                          <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Processing">Processing</SelectItem>
                            <SelectItem value="Shipped">Shipped</SelectItem>
                            <SelectItem value="Delivered">Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3">
                        {(o.status === "Shipped" || o.status === "Delivered") && (
                          <Input value={o.tracking || ""} onChange={e => updateOrderTracking(idx, e.target.value)} placeholder="Tracking #" className="h-8 w-36 text-xs" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "appointments" && (
          <div>
            <h1 className="font-display text-2xl font-medium text-foreground">Appointments</h1>
            <div className="mt-6 space-y-3">
              {appointments.length === 0 && <p className="text-muted-foreground text-sm font-body font-light">No appointments scheduled.</p>}
              {appointments.map((a: any, i: number) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-body font-medium text-foreground">{a.service}</p>
                      <p className="text-sm text-muted-foreground font-body font-light">{a.date} at {a.time}</p>
                    </div>
                  </div>
                  <span className="text-xs rounded-full px-3 py-1 bg-primary/10 text-primary font-body">{a.status || "Upcoming"}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "messages" && (
          <div>
            <h1 className="font-display text-2xl font-medium text-foreground">Messages</h1>
            <p className="mt-4 text-muted-foreground text-sm font-body font-light">No messages yet.</p>
          </div>
        )}
      </div>

      {/* Intake Form Viewer */}
      <Sheet open={!!viewingIntake} onOpenChange={() => setViewingIntake(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-display">Patient Intake Form</SheetTitle>
          </SheetHeader>
          {viewingIntake && (
            <div className="mt-4 space-y-5 text-sm">
              <Section title="Personal Information">
                <Field label="Full Name" value={viewingIntake.data.personal.fullName} />
                <Field label="Email" value={viewingIntake.data.personal.email} />
                <Field label="Date of Birth" value={viewingIntake.data.personal.dob} />
                <Field label="Gender" value={viewingIntake.data.personal.gender} />
                <Field label="Height" value={`${viewingIntake.data.personal.height} cm`} />
                <Field label="Weight" value={`${viewingIntake.data.personal.weight} kg`} />
                <Field label="Phone" value={viewingIntake.data.personal.phone} />
              </Section>
              <Section title="Medical Conditions">
                <div className="flex flex-wrap gap-1.5">
                  {viewingIntake.data.conditions.map(c => (
                    <span key={c} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">{c}</span>
                  ))}
                </div>
                {viewingIntake.data.medications && <Field label="Medications" value={viewingIntake.data.medications} />}
                {viewingIntake.data.allergies && <Field label="Allergies" value={viewingIntake.data.allergies} />}
                {viewingIntake.data.surgeries && <Field label="Surgeries" value={viewingIntake.data.surgeries} />}
                {viewingIntake.data.familyHistory && <Field label="Family History" value={viewingIntake.data.familyHistory} />}
              </Section>
              <Section title="Goals">
                <div className="flex flex-wrap gap-1.5">
                  {viewingIntake.data.goals.map(g => (
                    <span key={g} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">{g}</span>
                  ))}
                </div>
                {viewingIntake.data.goalDetails && <Field label="Details" value={viewingIntake.data.goalDetails} />}
              </Section>
              <Section title="Documents">
                {viewingIntake.data.idFileName && <Field label="Government ID" value={viewingIntake.data.idFileName} />}
                {viewingIntake.data.photoFileName && <Field label="Photo" value={viewingIntake.data.photoFileName} />}
              </Section>
              <Section title="Consent">
                <Field label="Digital Signature" value={viewingIntake.data.signature} />
                <Field label="Submitted" value={new Date(viewingIntake.data.submittedAt).toLocaleString()} />
              </Section>
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button className="flex-1" onClick={() => handleApprove(viewingIntake.email)}>APPROVE PATIENT</Button>
                <Button variant="destructive" className="flex-1" onClick={() => handleReject(viewingIntake.email)}>REJECT</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="font-display text-sm font-medium text-foreground border-b border-border pb-1">{title}</h4>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-muted-foreground font-body font-light shrink-0 w-28">{label}:</span>
      <span className="text-foreground font-body font-light">{value}</span>
    </div>
  );
}
