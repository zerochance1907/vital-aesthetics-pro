import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

// SVG crosshatch pattern as inline background
const crosshatchSvg = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%238C8070' stroke-width='0.5'%3E%3Cpath d='M0 20h40M20 0v40'/%3E%3C/g%3E%3C/svg%3E")`;

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background min-h-screen flex items-center">
      {/* Crosshatch pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: crosshatchSvg }}
      />

      {/* Decorative SVG right side */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.08] pointer-events-none hidden lg:block">
        <svg width="500" height="500" viewBox="0 0 500 500" fill="none">
          <circle cx="250" cy="250" r="200" stroke="hsl(153,43%,30%)" strokeWidth="1" />
          <circle cx="250" cy="250" r="150" stroke="hsl(153,43%,30%)" strokeWidth="0.5" />
          <circle cx="250" cy="250" r="100" stroke="hsl(153,43%,30%)" strokeWidth="0.5" />
          {/* Grid lines */}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`h${i}`} x1="100" y1={150 + i * 20} x2="400" y2={150 + i * 20} stroke="hsl(153,43%,30%)" strokeWidth="0.3" />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`v${i}`} x1={150 + i * 20} y1="100" x2={150 + i * 20} y2="400" stroke="hsl(153,43%,30%)" strokeWidth="0.3" />
          ))}
        </svg>
      </div>

      <div className="container relative py-20 px-4 sm:py-28">
        <div className="max-w-3xl">
          <motion.div {...fadeUp(0)}>
            <span className="inline-block rounded-full border border-primary/30 bg-muted px-4 py-1.5 text-xs font-body font-medium text-primary mb-8">
              Physician-Approved Platform
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.15)}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-semibold text-foreground leading-[1.1] tracking-tight"
          >
            Aesthetic &<br />Wellness Care,<br />
            <span className="text-primary">Reimagined.</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.3)}
            className="mt-6 max-w-xl text-base sm:text-lg text-muted-foreground font-body font-light leading-relaxed"
          >
            Join thousands of patients accessing physician-approved aesthetic treatments, weight management programs, and wellness products — all from the comfort of your home.
          </motion.p>

          <motion.div {...fadeUp(0.45)} className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="px-8 py-6 text-base" asChild>
              <Link to="/register">CREATE ACCOUNT</Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 text-base" asChild>
              <Link to="/login">SIGN IN</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
