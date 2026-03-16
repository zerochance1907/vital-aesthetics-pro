import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ShoppingCart, AlertTriangle, Plus, Minus, Trash2, Search, Syringe, Leaf, Sparkles, Heart, Droplets } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const categories = ["All Products", "Aesthetic Treatments", "Weight Management", "Wellness Products", "Skincare", "IV Therapy"];

const categoryStyles: Record<string, { gradient: string; icon: React.ElementType }> = {
  "Weight Management": { gradient: "from-emerald-600 via-teal-500 to-cyan-500", icon: Leaf },
  "Aesthetic Treatments": { gradient: "from-purple-600 via-fuchsia-500 to-pink-500", icon: Sparkles },
  "Wellness Products": { gradient: "from-blue-600 via-cyan-500 to-sky-400", icon: Heart },
  "Skincare": { gradient: "from-orange-400 via-rose-400 to-pink-400", icon: Droplets },
  "IV Therapy": { gradient: "from-indigo-500 via-violet-500 to-purple-400", icon: Syringe },
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
  const { items, itemCount, subtotal, addItem, removeItem, updateQuantity, isDrawerOpen, setDrawerOpen } = useCart();
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  if (!user) return <Navigate to="/login" />;
  const isPending = user.status === "pending";

  let filtered = activeCategory === "All Products" ? products : products.filter(p => p.category === activeCategory);
  if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  if (sort === "low") filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === "high") filtered = [...filtered].sort((a, b) => b.price - a.price);

  return (
    <TooltipProvider>
      <div className="container py-10 animate-fade-in">
        {isPending && (
          <div className="mb-8 flex items-center gap-3 rounded-lg bg-amber-50 border border-amber-200 px-5 py-4 text-sm font-medium text-amber-800">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
            🔒 Marketplace access requires physician approval. Please complete your medical intake form.
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-navy">Marketplace</h1>
            <p className="mt-1 text-muted-foreground">Physician-approved treatments and products</p>
          </div>
          <Button variant="outline" className="relative h-11" onClick={() => setDrawerOpen(true)}>
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{itemCount}</span>
            )}
          </Button>
        </div>

        {/* Filters */}
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
                  className={`whitespace-nowrap rounded-md px-4 py-2 text-left text-sm font-medium transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
                  {cat}
                </button>
              ))}
            </nav>
          </aside>

          <div className="flex-1 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map(product => {
              const style = categoryStyles[product.category] || categoryStyles["Wellness Products"];
              const IconComp = style.icon;
              return (
                <div key={product.name} className={`flex flex-col rounded-lg border bg-card overflow-hidden transition-all duration-200 ${isPending ? "opacity-50" : "hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02]"}`}>
                  <div className={`h-40 bg-gradient-to-br ${style.gradient} flex items-center justify-center relative`}>
                    <IconComp className="h-16 w-16 text-white/30" />
                    <span className="absolute bottom-3 left-4 text-white/90 text-xs font-semibold tracking-wide uppercase">{product.category}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-base font-semibold text-navy">{product.name}</h3>
                    <p className="mt-1 flex-1 text-sm text-muted-foreground">{product.desc}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xl font-bold text-navy">${product.price}</span>
                      {isPending ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              <Button size="sm" disabled className="h-11">Add to Cart</Button>
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>Physician approval required</TooltipContent>
                        </Tooltip>
                      ) : (
                        <Button size="sm" className="h-11" onClick={() => {
                          addItem(product.name, product.price);
                          toast.success(`${product.name} added to cart`);
                        }}>Add to Cart</Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cart Drawer */}
        <Sheet open={isDrawerOpen} onOpenChange={setDrawerOpen}>
          <SheetContent className="flex flex-col">
            <SheetHeader>
              <SheetTitle>Your Cart ({itemCount})</SheetTitle>
            </SheetHeader>
            {items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">Your cart is empty</div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto space-y-4 mt-4">
                  {items.map(item => (
                    <div key={item.name} className="flex items-center gap-3 rounded-lg border p-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-navy truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground">${item.price}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQuantity(item.name, item.quantity - 1)} className="rounded p-1 hover:bg-muted"><Minus className="h-3 w-3" /></button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.name, item.quantity + 1)} className="rounded p-1 hover:bg-muted"><Plus className="h-3 w-3" /></button>
                      </div>
                      <button onClick={() => removeItem(item.name)} className="rounded p-1 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center justify-between font-semibold text-navy">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <Button className="w-full h-11" size="lg" disabled={isPending} onClick={() => {
                    if (isPending) return;
                    toast.success("Checkout coming soon!");
                  }}>
                    {isPending ? "Approval Required" : "Checkout"}
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
