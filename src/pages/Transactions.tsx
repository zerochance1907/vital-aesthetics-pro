import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Receipt, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Order {
  id: string;
  items: { name: string; price: number; quantity: number }[];
  total: number;
  date: string;
  status?: string;
}

function getOrders(): Order[] {
  try { return JSON.parse(localStorage.getItem("orders") || "[]"); } catch { return []; }
}

export default function Transactions() {
  const { user } = useAuth();
  const [statusFilter, setStatusFilter] = useState("all");

  if (!user) return <Navigate to="/login" />;

  const orders = getOrders();
  const filtered = statusFilter === "all" ? orders : orders.filter(o => (o.status || "Completed").toLowerCase() === statusFilter.toLowerCase());

  const totalSpent = orders.reduce((s, o) => s + (o.total || 0), 0);
  const avgOrder = orders.length > 0 ? totalSpent / orders.length : 0;

  return (
    <div className="container max-w-4xl pt-24 pb-10 animate-fade-in">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 font-body font-light mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>
      <h1 className="font-display text-3xl font-medium text-foreground">Transaction History</h1>
      <p className="mt-1 text-muted-foreground font-body font-light mb-8">All your purchases and payments</p>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-[3px] hover:shadow-md">
          <span className="text-sm text-muted-foreground font-body font-light">Total Spent</span>
          <p className="mt-1 font-display text-2xl font-medium text-foreground">${totalSpent.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-[3px] hover:shadow-md">
          <span className="text-sm text-muted-foreground font-body font-light">Total Orders</span>
          <p className="mt-1 font-display text-2xl font-medium text-foreground">{orders.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-[3px] hover:shadow-md">
          <span className="text-sm text-muted-foreground font-body font-light">Avg. Order Value</span>
          <p className="mt-1 font-display text-2xl font-medium text-foreground">${avgOrder.toFixed(2)}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 mb-6">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left font-body font-light text-muted-foreground">Transaction ID</th>
              <th className="px-4 py-3 text-left font-body font-light text-muted-foreground">Date</th>
              <th className="px-4 py-3 text-left font-body font-light text-muted-foreground">Description</th>
              <th className="px-4 py-3 text-left font-body font-light text-muted-foreground">Amount</th>
              <th className="px-4 py-3 text-left font-body font-light text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-body font-light text-muted-foreground">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground font-body font-light">No transactions found</td></tr>}
            {filtered.map((o, idx) => {
              const status = o.status || "Completed";
              const statusClass = status === "Completed" ? "bg-primary/10 text-primary" : status === "Refunded" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning";
              return (
                <tr key={o.id || idx} className="border-t border-border">
                  <td className="px-4 py-3 font-mono text-xs text-foreground">{o.id || `TXN-${idx + 1}`}</td>
                  <td className="px-4 py-3 text-muted-foreground font-body font-light">{o.date || "—"}</td>
                  <td className="px-4 py-3 text-foreground font-body font-light text-xs">{o.items?.map(i => i.name).join(", ") || "—"}</td>
                  <td className="px-4 py-3 font-body font-medium text-foreground">${o.total?.toFixed(2)}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs font-body ${statusClass}`}>{status}</span></td>
                  <td className="px-4 py-3">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/receipt?order=${o.id || idx}`}>
                        <Receipt className="h-3 w-3 mr-1" /> View
                      </Link>
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
