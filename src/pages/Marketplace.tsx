import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ShoppingCart, AlertTriangle, Plus, Minus, Trash2, Search, Syringe, Leaf, Sparkles, Heart, Droplets } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const categories = ["All Products", "Aesthetic Treatments", "Weight Management", "Wellness Products", "Skincare", "IV Therapy"];

const categoryIcons: Record<string, React.ElementType> = {
  "Weight Management": Leaf,
  "Aesthetic Treatments": Sparkles,
  "Wellness Products": Heart,
  "Skincare": Droplets,
  "IV Therapy": Syringe,
};

const products = [
  { name: "Semaglutide Weight Loss Program", price: 299, category: "Weight Management", desc: "FDA-approved GLP-1 weight management program" },
  { name: "Botox Treatment Package", price: 450, category: "Aesthetic Treatments", desc: "Professional neuromodulator treatment package" },
  { name: "Vitamin B12 Injections", price: 89, category: "Wellness Products", desc: "Energy-boosting vitamin B12 injection series" },
  { name: "HCG Weight Management", price: 199, category: "Weight Management", desc: "Physician-supervised HCG protocol" },
  { name: "Skin Rejuvenation Treatment", price: 350, category: "Skincare", desc: "Advanced skin resurfacing and renewal" },
  { name: "Collagen Wellness Pack", price: 79, category: "Wellness Products", desc: "Premium marine collagen supplement pack" },
  { name: "Testosterone Therapy", price: 249, category: "Wellness Products", desc: "Medically supervised TRT program" },
  { name: "Glutathione IV Drip", price: 149, category: "IV Therapy", desc: "Antioxidant IV therapy for skin & wellness" },
];

export default function Marketplace() {
  const { user } = useAuth();
  const { items, itemCount, subtotal, addItem, removeItem, updateQuantity, clearCart, isDrawerOpen, setDrawerOpen } = useCart();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  if (!user) return <Navigate to="/login" />;
  const isPending = user.status === "pending";

  let filtered = activeCategory === "All Products" ? products : products.filter(p => p.category === activeCategory);
  if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  if (sort === "low") filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === "high") filtered = [...filtered].sort((a, b) => b.price - a.price);

  const handleCheckout = () => {
    if (isPending || items.length === 0) return;
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    const order = {
      id: orderId,
      items: items.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })),
      total: subtotal,
      date: new Date().toLocaleDateString(),
      step: 0,
      status: "Processing",
      patientEmail: user.email,
      patientName: `${user.firstName} ${user.lastName}`,
      paymentMethod: "Card ending ****4242",
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    };
    try {
      const existing = JSON.parse(localStorage.getItem("orders") || "[]");
      existing.push(order);
      localStorage.setItem("orders", JSON.stringify(existing));
    } catch {
      localStorage.setItem("orders", JSON.stringify([order]));
    }
    addNotification({ type: "order_placed", title: "Order Placed", message: `Order ${orderId} has been placed — $${subtotal.toFixed(2)}` });
    clearCart();
    setDrawerOpen(false);
    toast.success("Order placed successfully!");
    navigate("/orders");
  };

  return (
    <TooltipProvider>
      <div className="container pt-24 pb-10 animate-fade-in">
        {isPending && (
          <div className="mb-8 flex items-center gap-3 rounded-xl bg-warning/10 border border-warning/20 px-5 py-4 text-sm font-body font-light text-warning">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            🔒 Marketplace access requires physician approval. Please complete your medical intake form.
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-medium text-foreground">Marketplace</h1>
            <p className="mt-1 text-muted-foreground font-body font-light">Physician-approved treatments and products</p>
          </div>
          <Button variant="outline" className="relative h-11" onClick={() => setDrawerOpen(true)}>
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{itemCount}</span>
            )}
          </Button>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-9 h-11" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-44 h-11"><SelectValue placeholder="Sort by" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="low">Price: Low to High</SelectItem>
              <SelectItem value="high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-8 flex flex-col gap-8 lg:flex-row">
          <aside className="shrink-0 lg:w-56">
            <nav className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:gap-1">
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap rounded-[6px] px-4 py-2 text-left text-sm font-body font-light transition-colors duration-300 ${activeCategory === cat ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
                  {cat}
                </button>
              ))}
            </nav>
          </aside>

          <div className="flex-1 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map(product => {
              const IconComp = categoryIcons[product.category] || Heart;
              return (
                <div key={product.name} className={`flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 ${isPending ? "opacity-50" : "hover:shadow-md hover:-translate-y-[3px]"}`}>
                  <div className="h-40 flex items-center justify-center relative" style={{
                    background: product.category === "Weight Management" ? "linear-gradient(135deg, #064e3b, #065f46)"
                      : product.category === "Aesthetic Treatments" ? "linear-gradient(135deg, #4c1d95, #6d28d9)"
                      : product.category === "Wellness Products" ? "linear-gradient(135deg, #1e3a5f, #1d4ed8)"
                      : product.category === "Skincare" ? "linear-gradient(135deg, #831843, #be185d)"
                      : product.category === "IV Therapy" ? "linear-gradient(135deg, #1e1b4b, #3730a3)"
                      : "linear-gradient(135deg, hsl(var(--muted)), hsl(var(--muted)))"
                  }}>
                    <IconComp className="h-20 w-20 text-white" />
                    <span className="absolute top-3 left-3 rounded-full bg-white/20 px-3 py-0.5 text-[10px] font-body font-medium text-white uppercase tracking-wider backdrop-blur-sm">{product.category}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-base font-medium text-foreground">{product.name}</h3>
                    <p className="mt-1 flex-1 text-sm text-muted-foreground font-body font-light">{product.desc}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-display text-xl font-medium text-foreground">${product.price}</span>
                      {isPending ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span><Button size="sm" disabled className="h-11">ADD TO CART</Button></span>
                          </TooltipTrigger>
                          <TooltipContent>Physician approval required</TooltipContent>
                        </Tooltip>
                      ) : (
                        <Button size="sm" className="h-11" onClick={() => {
                          addItem(product.name, product.price);
                          toast.success(`${product.name} added to cart`);
                        }}>ADD TO CART</Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Sheet open={isDrawerOpen} onOpenChange={setDrawerOpen}>
          <SheetContent className="flex flex-col">
            <SheetHeader>
              <SheetTitle>Your Cart ({itemCount})</SheetTitle>
            </SheetHeader>
            {items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm font-body font-light">Your cart is empty</div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto space-y-4 mt-4">
                  {items.map(item => (
                    <div key={item.name} className="flex items-center gap-3 rounded-xl border border-border p-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-body font-medium text-foreground truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground font-light">${item.price}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQuantity(item.name, item.quantity - 1)} className="rounded p-1 hover:bg-muted transition-colors duration-300"><Minus className="h-3 w-3" /></button>
                        <span className="w-6 text-center text-sm font-body font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.name, item.quantity + 1)} className="rounded p-1 hover:bg-muted transition-colors duration-300"><Plus className="h-3 w-3" /></button>
                      </div>
                      <button onClick={() => removeItem(item.name)} className="rounded p-1 text-destructive hover:bg-destructive/10 transition-colors duration-300"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex items-center justify-between font-body font-medium text-foreground">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <Button className="w-full h-11" size="lg" disabled={isPending} onClick={handleCheckout}>
                    {isPending ? "APPROVAL REQUIRED" : "CHECKOUT"}
                  </Button>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </TooltipProvider>
  );
}
