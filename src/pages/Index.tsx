import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClipboardList, UserCheck, ShieldCheck, ShoppingBag, Syringe, Scale, Sparkles, Heart, Users, Package, Stethoscope, Star, Shield, BadgeCheck, Lock } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

const steps = [
  { icon: ClipboardList, title: "Register", desc: "Create your free account in seconds" },
  { icon: UserCheck, title: "Medical Intake", desc: "Complete your health history form" },
  { icon: ShieldCheck, title: "Physician Approval", desc: "A licensed physician reviews your file" },
  { icon: ShoppingBag, title: "Access Marketplace", desc: "Browse and purchase approved treatments" },
];

const treatments = [
  { icon: Syringe, name: "Botox & Fillers", desc: "Professional neuromodulator and dermal filler treatments", color: "from-blue-500/20 to-blue-600/5", iconBg: "bg-blue-500/15 text-blue-600", borderColor: "border-t-blue-500" },
  { icon: Scale, name: "Weight Management", desc: "FDA-approved GLP-1 and HCG programs", color: "from-emerald-500/20 to-emerald-600/5", iconBg: "bg-emerald-500/15 text-emerald-600", borderColor: "border-t-emerald-500" },
  { icon: Sparkles, name: "Skin Rejuvenation", desc: "Advanced resurfacing and renewal therapies", color: "from-purple-500/20 to-purple-600/5", iconBg: "bg-purple-500/15 text-purple-600", borderColor: "border-t-purple-500" },
  { icon: Heart, name: "Wellness Programs", desc: "IV therapy, vitamins, and hormone optimization", color: "from-orange-500/20 to-orange-600/5", iconBg: "bg-orange-500/15 text-orange-600", borderColor: "border-t-orange-500" },
];

const statsData = [
  { value: 500, suffix: "+", label: "Patients Served", icon: Users },
  { value: 50, suffix: "+", label: "Products Available", icon: Package },
  { value: 10, suffix: "+", label: "Licensed Physicians", icon: Stethoscope },
  { value: 4.9, suffix: "★", label: "Patient Rating", icon: Star, isDecimal: true },
];

const testimonials = [
  { name: "Jessica", rating: 5, text: "Incredible experience from start to finish. The physician approval process gave me so much confidence in my treatment plan." },
  { name: "Marcus", rating: 5, text: "The weight management program changed my life. Professional, caring team and real results within weeks." },
  { name: "Ava", rating: 5, text: "Love how easy the platform is to use. Booked my skin rejuvenation treatment in minutes and the results are amazing!" },
];

const trustBadges = [
  { icon: Shield, title: "HIPAA Compliant", desc: "All patient data is encrypted and handled per HIPAA regulations" },
  { icon: BadgeCheck, title: "Licensed Physicians", desc: "Every treatment plan is reviewed by board-certified physicians" },
  { icon: Lock, title: "Secure Platform", desc: "Enterprise-grade security protects your personal information" },
];

function StatCard({ value, suffix, label, icon: Icon, isDecimal }: typeof statsData[number]) {
  const end = isDecimal ? Math.round(value * 10) : value;
  const { count, ref } = useCountUp(end, 1800);
  const display = isDecimal ? (count / 10).toFixed(1) : count;

  return (
    <div ref={ref} className="text-center">
      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-2xl md:text-3xl font-bold text-navy-foreground">
        {display}{suffix}
      </div>
      <div className="mt-1 text-sm text-navy-foreground/60">{label}</div>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-warning text-warning" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );
}

export default function Index() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy min-h-screen flex items-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(220_80%_46%/0.2),transparent_50%),radial-gradient(ellipse_at_bottom_left,hsl(220_80%_46%/0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_25%,hsl(220_80%_46%/0.05)_50%,transparent_75%)] animate-pulse" style={{ animationDuration: "4s" }} />
        <div className="container relative text-center py-16 px-4 sm:py-20">
          <div className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary mb-8 animate-[pulse_3s_ease-in-out_infinite]">
            Physician-Approved Platform
          </div>
          <h1 className="mx-auto max-w-4xl text-3xl font-bold tracking-tight text-navy-foreground sm:text-4xl md:text-6xl lg:text-7xl leading-tight">
            Med<span className="text-primary">Aesthetics</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg md:text-xl text-navy-foreground/60 font-light px-2">
            Physician-Approved Aesthetic & Wellness Treatments
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-navy-foreground/50 font-light px-4 leading-relaxed">
            Join thousands of patients accessing physician-approved aesthetic treatments, weight management programs, and wellness products — all from the comfort of your home.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
            <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-base font-semibold" asChild>
              <Link to="/register">Create Account</Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 py-6 text-base font-semibold border-white/30 text-white bg-transparent hover:bg-white/10 hover:text-white" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 sm:py-16">
        <div className="container px-4">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-navy md:text-4xl">How It Works</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground text-sm sm:text-base">Four simple steps to access physician-approved treatments.</p>
          <div className="mt-8 sm:mt-10 grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.title} className="group relative rounded-lg border bg-card p-5 sm:p-6 text-center transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <step.icon className="h-6 w-6" />
                </div>
                <span className="absolute top-4 left-4 font-display text-sm font-semibold text-muted-foreground/40">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-lg font-semibold text-navy">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Treatments */}
      <section className="py-12 sm:py-16 bg-surface">
        <div className="container px-4">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-navy md:text-4xl">Featured Treatments</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground text-sm sm:text-base">Explore our most popular physician-approved services.</p>
          <div className="mt-8 sm:mt-10 grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {treatments.map(t => (
              <div key={t.name} className={`group rounded-xl border border-t-4 ${t.borderColor} bg-card p-5 sm:p-6 transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col`}>
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${t.iconBg}`}>
                  <t.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-base font-semibold text-navy">{t.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground flex-1">{t.desc}</p>
                <Link
                  to="/register"
                  className="mt-4 text-sm font-medium text-primary hover:text-primary/80 transition-colors text-left"
                >
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16">
        <div className="container px-4">
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-navy md:text-4xl">What Our Patients Say</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground text-sm sm:text-base">Real experiences from real patients.</p>
          <div className="mt-8 sm:mt-10 grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map(t => (
              <div key={t.name} className="rounded-xl border bg-card p-6 sm:p-8 flex flex-col gap-4 transition-all hover:shadow-lg">
                <StarRating rating={t.rating} />
                <p className="text-sm sm:text-base text-foreground/80 leading-relaxed flex-1">"{t.text}"</p>
                <p className="text-sm font-semibold text-navy">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-navy">
        <div className="container px-4">
          <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
            {statsData.map(s => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-10 sm:py-12 bg-surface border-t">
        <div className="container px-4">
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-3">
            {trustBadges.map(b => (
              <div key={b.title} className="flex items-start gap-4 rounded-lg border bg-card p-5 sm:p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                  <b.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-navy">{b.title}</h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8 sm:py-10">
        <div className="container px-4">
          <div className="grid gap-8 grid-cols-2 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <h4 className="font-display text-lg font-bold text-navy">Med<span className="text-primary">Aesthetics</span></h4>
              <p className="mt-2 text-sm text-muted-foreground">Physician-approved aesthetic and wellness treatments delivered with clinical precision.</p>
            </div>
            <div>
              <h5 className="font-display text-sm font-semibold text-navy">Quick Links</h5>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li><Link to="/register" className="hover:text-primary transition-colors">Create Account</Link></li>
                <li><Link to="/login" className="hover:text-primary transition-colors">Sign In</Link></li>
                <li><Link to="/register" className="hover:text-primary transition-colors">Marketplace</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-display text-sm font-semibold text-navy">Services</h5>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Aesthetic Treatments</li>
                <li>Weight Management</li>
                <li>Wellness Programs</li>
                <li>Skincare</li>
              </ul>
            </div>
            <div>
              <h5 className="font-display text-sm font-semibold text-navy">Contact</h5>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>support@medaesthetics.com</li>
                <li>1-800-MED-AEST</li>
                <li>Mon-Fri 9AM-6PM EST</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} MedAesthetics. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
