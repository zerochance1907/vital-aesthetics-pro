import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function DemoPanel() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-full bg-navy px-3 py-1.5 text-xs font-medium text-navy-foreground shadow-lg hover:bg-navy/90 transition-colors">
        Demo {open ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
      </button>
      {open && (
        <div className="absolute bottom-10 left-0 w-64 rounded-lg border bg-card p-4 shadow-xl animate-fade-in">
          <h4 className="text-xs font-bold text-navy mb-3">Demo Accounts</h4>
          <div className="space-y-2.5 text-xs">
            <div className="rounded-md bg-muted p-2">
              <p className="font-semibold text-foreground">New Patient</p>
              <p className="text-muted-foreground">new@demo.com / demo123</p>
            </div>
            <div className="rounded-md bg-muted p-2">
              <p className="font-semibold text-foreground">Approved Patient</p>
              <p className="text-muted-foreground">approved@demo.com / demo123</p>
            </div>
            <div className="rounded-md bg-muted p-2">
              <p className="font-semibold text-foreground">Admin</p>
              <p className="text-muted-foreground">admin@medaesthetics.com / Admin123</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
