import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronLeft, ChevronRight, CalendarDays, Clock, CreditCard } from "lucide-react";
import { toast } from "sonner";

const services = [
  { name: "Initial Physician Consultation", price: "Free", priceNum: 0 },
  { name: "Weight Management Consultation", price: "$50", priceNum: 50 },
  { name: "Aesthetic Treatment Consultation", price: "$75", priceNum: 75 },
  { name: "Follow-up Appointment", price: "$25", priceNum: 25 },
];
const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"];

function SimpleCalendar({ selected, onSelect, monthOffset, setMonthOffset }: { selected: number | null; onSelect: (d: number) => void; monthOffset: number; setMonthOffset: (fn: (m: number) => number) => void }) {
  const now = new Date();
  const viewing = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const daysInMonth = new Date(viewing.getFullYear(), viewing.getMonth() + 1, 0).getDate();
  const startDay = viewing.getDay();
  const monthName = viewing.toLocaleString("default", { month: "long", year: "numeric" });
  const isCurrentMonth = monthOffset === 0;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button type="button" onClick={() => setMonthOffset(m => m - 1)} disabled={isCurrentMonth} className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"><ChevronLeft className="h-5 w-5" /></button>
        <span className="font-display text-sm font-semibold text-navy">{monthName}</span>
        <button type="button" onClick={() => setMonthOffset(m => m + 1)} className="rounded p-1 text-muted-foreground hover:text-foreground"><ChevronRight className="h-5 w-5" /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => <div key={d} className="py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const isPast = isCurrentMonth && day < now.getDate();
          const isSel = selected === day;
          return (
            <button key={day} type="button" disabled={isPast} onClick={() => !isPast && onSelect(day)}
              className={`rounded-md py-2 text-sm transition-colors ${
                isSel ? "bg-primary text-primary-foreground font-semibold" 
                : isPast ? "text-muted-foreground/30 line-through cursor-not-allowed pointer-events-none" 
                : "hover:bg-primary/10 text-foreground"
              }`}>
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function BookAppointment() {
  const { user } = useAuth();
  const [service, setService] = useState<string | null>(null);
  const [date, setDate] = useState<number | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [monthOffset, setMonthOffset] = useState(0);

  if (!user) return <Navigate to="/login" />;

  const refNumber = `MA-${Date.now().toString(36).toUpperCase()}`;

  const viewingDate = new Date(new Date().getFullYear(), new Date().getMonth() + monthOffset, 1);
  const viewingMonthName = viewingDate.toLocaleString("default", { month: "long" });
  const viewingYear = viewingDate.getFullYear();

  const selectedService = services.find(s => s.name === service);

  const handleConfirm = () => {
    const booking = {
      id: refNumber,
      service,
      date: `${date} ${viewingMonthName} ${viewingYear}`,
      time,
      status: "Upcoming",
      createdAt: new Date().toISOString(),
    };
    try {
      const existing = JSON.parse(localStorage.getItem("appointments") || "[]");
      existing.push(booking);
      localStorage.setItem("appointments", JSON.stringify(existing));
    } catch {
      localStorage.setItem("appointments", JSON.stringify([booking]));
    }
    setConfirmed(true);
    toast.success("Appointment booked successfully!");
  };

  if (confirmed) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 pt-20 animate-fade-in">
        <div className="max-w-lg text-center space-y-4 rounded-lg border bg-card p-8 shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-12 w-12 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-navy">Appointment Confirmed!</h2>
          <p className="text-sm text-muted-foreground">Booking Reference: <span className="font-mono font-semibold text-foreground">{refNumber}</span></p>
          <p className="text-muted-foreground">A confirmation has been sent to your email. Our team will contact you shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl pt-24 pb-10 animate-fade-in">
      <h1 className="text-3xl font-bold text-navy">Book a Consultation</h1>
      <p className="mt-1 text-muted-foreground">Select a service, date, and time to schedule</p>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-8">
          {/* Step 1 */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-display text-sm font-semibold text-muted-foreground">Step 1</h3>
            <h2 className="mt-1 text-lg font-semibold text-navy">Select a Service</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {services.map(s => (
                <button key={s.name} onClick={() => setService(s.name)}
                  className={`rounded-md border px-4 py-3 text-left text-sm font-medium transition-all ${service === s.name ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20" : "text-foreground hover:border-primary/30 hover:shadow-sm"}`}>
                  <div className="flex items-center justify-between">
                    <span>{s.name}</span>
                    <span className={`text-xs font-semibold ${s.price === "Free" ? "text-emerald-600" : "text-muted-foreground"}`}>{s.price}</span>
                  </div>
                </button>
              ))}
            </div>
            {service && !date && (
              <Button className="mt-4 h-11" onClick={() => document.getElementById('step2')?.scrollIntoView({ behavior: 'smooth' })}>
                Next: Select Date →
              </Button>
            )}
          </div>

          {/* Step 2 */}
          <div id="step2" className="rounded-lg border bg-card p-6">
            <h3 className="font-display text-sm font-semibold text-muted-foreground">Step 2</h3>
            <h2 className="mt-1 text-lg font-semibold text-navy">Select a Date</h2>
            <div className="mt-4 max-w-xs">
              <SimpleCalendar selected={date} onSelect={(d) => { setDate(d); }} monthOffset={monthOffset} setMonthOffset={setMonthOffset} />
            </div>
            {date && !time && (
              <Button className="mt-4 h-11" onClick={() => document.getElementById('step3')?.scrollIntoView({ behavior: 'smooth' })}>
                Next: Select Time →
              </Button>
            )}
          </div>

          {/* Step 3 */}
          <div id="step3" className="rounded-lg border bg-card p-6">
            <h3 className="font-display text-sm font-semibold text-muted-foreground">Step 3</h3>
            <h2 className="mt-1 text-lg font-semibold text-navy">Select a Time Slot</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {timeSlots.map(t => (
                <button key={t} onClick={() => setTime(t)}
                  className={`rounded-full border px-5 py-2.5 text-sm font-medium transition-all ${time === t ? "border-primary bg-primary text-primary-foreground" : "text-foreground hover:border-primary/30 hover:shadow-sm"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:w-72">
          <div className="sticky top-20 rounded-lg border bg-card p-6 space-y-4">
            <h3 className="font-display text-sm font-semibold text-navy">Booking Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <CalendarDays className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <span className="text-muted-foreground text-xs">Service</span>
                  <p className="font-medium text-foreground">{service || "Not selected"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <span className="text-muted-foreground text-xs">Date & Time</span>
                  <p className="font-medium text-foreground">
                    {date ? `${viewingMonthName} ${date}, ${viewingYear}` : "No date"} 
                    {time ? ` at ${time}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div>
                  <span className="text-muted-foreground text-xs">Total</span>
                  <p className="font-semibold text-lg text-navy">{selectedService ? selectedService.price : "—"}</p>
                </div>
              </div>
            </div>
            <div className="border-t pt-4">
              {service && date && time ? (
                <Button className="w-full h-11" onClick={handleConfirm}>
                  Confirm Booking
                </Button>
              ) : (
                <p className="text-xs text-center text-muted-foreground">Select service, date and time to book</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
