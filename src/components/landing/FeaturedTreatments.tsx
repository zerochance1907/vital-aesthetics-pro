import { Link } from "react-router-dom";
import { Syringe, Scale, Sparkles, Heart } from "lucide-react";
import { motion } from "framer-motion";

const treatments = [
  { icon: Syringe, name: "Botox & Fillers", desc: "Professional neuromodulator and dermal filler treatments" },
  { icon: Scale, name: "Weight Management", desc: "FDA-approved GLP-1 and HCG programs" },
  { icon: Sparkles, name: "Skin Rejuvenation", desc: "Advanced resurfacing and renewal therapies" },
  { icon: Heart, name: "Wellness Programs", desc: "IV therapy, vitamins, and hormone optimization" },
];

export default function FeaturedTreatments() {
  return (
    <section className="py-16 bg-surface">
      <div className="container px-4">
        <h2 className="text-center font-display text-3xl sm:text-4xl font-medium text-foreground">Featured Treatments</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground font-body font-light text-sm sm:text-base">
          Explore our most popular physician-approved services.
        </p>
        <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {treatments.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-[3px] flex flex-col"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-primary">
                <t.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-base font-medium text-foreground">{t.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground font-body font-light flex-1">{t.desc}</p>
              <Link
                to="/register"
                className="mt-4 text-sm font-body font-medium text-primary hover:text-primary/80 transition-colors duration-300"
              >
                Learn More →
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
