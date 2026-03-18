import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Package, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = ["Order Placed", "Processing", "Shipped", "Delivered"];

interface Order {
  id: string;
  items: { name: string; price: number; quantity: number }[];
  total: number;
  date: string;
  step: number;
}

function getOrders(): Order[] {
  try {
    return JSON.parse(localStorage.getItem("orders") || "[]");
  } catch {
    return [];
  }
}

export default function Orders() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;

  const orders = getOrders();

  return (
    <div className="container max-w-3xl pt-24 pb-10 animate-fade-in">
      <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 font-body font-light mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>
      <h1 className="font-display text-3xl font-medium text-foreground">My Orders</h1>
      <p className="mt-1 text-muted-foreground font-body font-light mb-8">Track your treatment orders</p>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-12 text-center">
          <Package className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-display text-lg font-medium text-foreground">No orders yet</h3>
          <p className="mt-1 text-sm text-muted-foreground font-body font-light">Visit the marketplace to place your first order.</p>
          <Button asChild className="mt-6">
            <Link to="/marketplace">BROWSE MARKETPLACE</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, idx) => (
            <div key={order.id || idx} className="rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-[3px] hover:shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-muted-foreground font-body font-light">Order #{order.id || `ORD-${idx + 1}`}</p>
                  <p className="text-xs text-muted-foreground font-light">{order.date || "Recent"}</p>
                </div>
                <span className="font-display text-lg font-medium text-foreground">${order.total?.toFixed(2)}</span>
              </div>
              <div className="space-y-1 mb-5">
                {order.items?.map((item, i) => (
                  <p key={i} className="text-sm font-body font-light text-foreground">{item.quantity}× {item.name} — ${(item.price * item.quantity).toFixed(2)}</p>
                ))}
              </div>
              {/* Progress */}
              <div className="flex items-center gap-1">
                {STEPS.map((step, i) => {
                  const current = order.step ?? 1;
                  const active = i <= current;
                  return (
                    <div key={step} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className={`h-1.5 w-full rounded-full transition-colors duration-300 ${active ? "bg-primary" : "bg-muted"}`} />
                      <span className={`text-[10px] font-body transition-colors duration-300 ${active ? "text-primary font-medium" : "text-muted-foreground font-light"}`}>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
