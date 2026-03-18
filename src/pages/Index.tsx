import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Package, Stethoscope, Star, Shield, BadgeCheck, Lock } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";
import { motion } from "framer-motion";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturedTreatments from "@/components/landing/FeaturedTreatments";
import Testimonials from "@/components/landing/Testimonials";

const statsData = [
  { value: 500, suffix: "+", label: "Patients Served", icon: Users },
  { value: 50, suffix: "+", label: "Products Available", icon: Package },
  { value: 10, suffix: "+", label: "Licensed Physicians", icon: Stethoscope },
  { value: 4.9, suffix: "★", label: "Patient Rating", icon: Star, isDecimal: true },
];

const trustBadges = [
  { icon: Shield, title: "HIPAA Compliant", desc: "All patient data is encrypted and handled per HIPAA regulations" },
  { icon: BadgeCheck, title: "Licensed Physicians", desc: "Every treatment plan is reviewed by board-certified physicians" },
  { icon: Lock, title: "Secure Platform", desc: "Enterprise-grade security protects your personal information" },
];

function StatCard({ value, suffix, label, isDecimal }: { value: number; suffix: string; label: string; isDecimal?: boolean }) {
  const end = isDecimal ? Math.round(value * 10) : value;
  const { count, ref } = useCountUp(end, 1800);
  const display = isDecimal ? (count / 10).toFixed(1) : count;

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl md:text-5xl font-semibold text-primary-foreground">
        {display}{suffix}
      </div>
      <div className="mt-2 text-sm text-primary-foreground/60 font-body font-light">{label}</div>
    </div>
  );
}

export default function Index() {
  return (
    <div>
      <HeroSection />
      <HowItWorks />
      <FeaturedTreatments />
      <Testimonials />

      {/* Stats */}
      <section className="py-16 bg-primary dark:bg-[hsl(153,30%,12%)]">
        <div className="container px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {statsData.map(s => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-background border-t border-border">
        <div className="container px-4">
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-3">
            {trustBadges.map(b => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-[3px] hover:shadow-md"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
                  <b.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-display text-base font-medium text-foreground">{b.title}</h4>
                  <p className="mt-1 text-xs text-muted-foreground font-light leading-relaxed">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-[hsl(40,6%,10%)] py-10">
        <div className="container px-4">
          <div className="grid gap-8 grid-cols-2 md:grid-cols-5">
            <div className="col-span-2 md:col-span-1">
              <h4 className="font-body text-lg font-medium text-white">Harmony <span className="text-primary">Medical</span></h4>
              <p className="mt-2 text-sm text-white/60 font-light">Physician-approved aesthetic and wellness treatments delivered with clinical precision.</p>
              <div className="mt-4 flex items-center gap-2 rounded-[6px] border border-white/10 bg-white/5 px-3 py-2">
                <span className="text-xs">🔒</span>
                <span className="text-[10px] text-white/50 font-body font-light">HIPAA Compliant</span>
              </div>
            </div>
            <div>
              <h5 className="font-display text-sm font-medium text-white">Quick Links</h5>
              <ul className="mt-3 space-y-2 text-sm text-white/60 font-light">
                <li><Link to="/register" className="hover:text-primary transition-colors duration-300">Create Account</Link></li>
                <li><Link to="/login" className="hover:text-primary transition-colors duration-300">Sign In</Link></li>
                <li><Link to="/register" className="hover:text-primary transition-colors duration-300">Marketplace</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-display text-sm font-medium text-white">Services</h5>
              <ul className="mt-3 space-y-2 text-sm text-white/60 font-light">
                <li>Aesthetic Treatments</li>
                <li>Weight Management</li>
                <li>Wellness Programs</li>
                <li>Skincare</li>
              </ul>
            </div>
            <div>
              <h5 className="font-display text-sm font-medium text-white">Legal</h5>
              <ul className="mt-3 space-y-2 text-sm text-white/60 font-light">
                <li><Link to="/privacy" className="hover:text-primary transition-colors duration-300">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-primary transition-colors duration-300">Terms of Service</Link></li>
                <li><span className="cursor-default">Cookie Policy</span></li>
              </ul>
            </div>
            <div>
              <h5 className="font-display text-sm font-medium text-white">Contact</h5>
              <ul className="mt-3 space-y-2 text-sm text-white/60 font-light">
                <li>support@harmonymedicalaesthetics.com</li>
                <li>1-800-MED-AEST</li>
                <li>Mon-Fri 9AM-6PM EST</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/40 font-light">
            © {new Date().getFullYear()} Harmony Medical Aesthetics. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}