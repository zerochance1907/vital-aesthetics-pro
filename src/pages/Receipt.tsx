import { Navigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Printer, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Order {
  id: string;
  items: { name: string; price: number; quantity: number }[];
  total: number;
  date: string;
  paymentMethod?: string;
  address?: string;
}

function getOrders(): Order[] {
  try { return JSON.parse(localStorage.getItem("orders") || "[]"); } catch { return []; }
}

export default function Receipt() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const orderId = params.get("order") || "0";

  if (!user) return <Navigate to="/login" />;

  const orders = getOrders();
  const order = orders.find(o => o.id === orderId) || orders[parseInt(orderId)] || null;
  const receiptNum = `REC-${orderId.replace(/\D/g, "").padStart(5, "0") || "00001"}`;

  if (!order) {
    return (
      <div className="container max-w-xl pt-24 pb-10 text-center animate-fade-in">
        <h1 className="font-display text-2xl font-medium text-foreground">Receipt Not Found</h1>
        <p className="mt-2 text-muted-foreground font-body font-light">This receipt doesn't exist.</p>
        <Button asChild className="mt-6"><Link to="/orders">VIEW ORDERS</Link></Button>
      </div>
    );
  }

  const subtotal = order.items?.reduce((s, i) => s + i.price * i.quantity, 0) || order.total;

  return (
    <div className="container max-w-xl pt-24 pb-10 animate-fade-in">
      <div className="print:hidden mb-6">
        <Link to="/orders" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 font-body font-light">
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-card p-8 shadow-sm print:shadow-none print:border-0">
        {/* Header */}
        <div className="text-center border-b border-border pb-6 mb-6">
          <h2 className="font-body text-xl font-medium text-foreground">Harmony <span className="text-primary">Medical Aesthetics</span></h2>
          <p className="text-xs text-muted-foreground font-body font-light mt-1">Physician-Approved Aesthetic & Wellness Treatments</p>
        </div>

        {/* Receipt Info */}
        <div className="flex justify-between text-sm mb-6">
          <div>
            <p className="text-muted-foreground font-body font-light">Receipt Number</p>
            <p className="font-mono text-foreground">{receiptNum}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground font-body font-light">Date</p>
            <p className="text-foreground font-body font-light">{order.date || new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Patient */}
        <div className="mb-6 text-sm">
          <p className="text-muted-foreground font-body font-light">Patient</p>
          <p className="font-body font-medium text-foreground">{user.firstName} {user.lastName}</p>
          <p className="text-muted-foreground font-body font-light">{user.email}</p>
          {order.address && <p className="text-muted-foreground font-body font-light mt-1">{order.address}</p>}
        </div>

        {/* Items */}
        <div className="border-t border-b border-border py-4 mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground font-body font-light">
                <th className="text-left py-1">Item</th>
                <th className="text-center py-1">Qty</th>
                <th className="text-right py-1">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, i) => (
                <tr key={i} className="border-t border-border/50">
                  <td className="py-2 font-body font-light text-foreground">{item.name}</td>
                  <td className="py-2 text-center text-muted-foreground">{item.quantity}</td>
                  <td className="py-2 text-right text-foreground">${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="space-y-1 text-sm mb-6">
          <div className="flex justify-between">
            <span className="text-muted-foreground font-body font-light">Subtotal</span>
            <span className="text-foreground">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground font-body font-light">Tax (0%)</span>
            <span className="text-foreground">$0.00</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-border">
            <span className="font-display text-lg font-medium text-foreground">Total Paid</span>
            <span className="font-display text-lg font-medium text-primary">${order.total.toFixed(2)}</span>
          </div>
        </div>

        {order.paymentMethod && (
          <p className="text-xs text-muted-foreground font-body font-light mb-4">Payment: {order.paymentMethod}</p>
        )}
        <p className="text-xs text-muted-foreground font-body font-light mb-4">Order ID: {order.id}</p>

        {/* Footer */}
        <div className="text-center border-t border-border pt-4 text-xs text-muted-foreground font-body font-light">
          <p>Thank you for choosing Harmony Medical Aesthetics.</p>
          <p>For questions contact support@harmonymedicalaesthetics.com</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3 print:hidden">
        <Button onClick={() => window.print()} className="flex-1">
          <Printer className="h-4 w-4 mr-1" /> PRINT RECEIPT
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => {
          window.print();
        }}>DOWNLOAD PDF</Button>
      </div>
    </div>
  );
}
