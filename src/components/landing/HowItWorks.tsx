import { ClipboardList, UserCheck, ShieldCheck, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  { icon: ClipboardList, title: "Register", desc: "Create your free account in seconds" },
  { icon: UserCheck, title: "Medical Intake", desc: "Complete your health history form" },
  { icon: ShieldCheck, title: "Physician Approval", desc: "A licensed physician reviews your file" },
  { icon: ShoppingBag, title: "Access Marketplace", desc: "Browse and purchase approved treatments" },
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-background">
      <div className="container px-4">
        <h2 className="text-center font-display text-3xl sm:text-4xl font-medium text-foreground">How It Works</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground font-body font-light text-sm sm:text-base">
          Four simple steps to access physician-approved treatments.
        </p>
        <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative rounded-xl border border-border bg-card p-6 text-center transition-all duration-300 hover:shadow-md hover:-translate-y-[3px]"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <step.icon className="h-6 w-6" />
              </div>
              <span className="absolute top-4 left-4 font-body text-sm font-light text-muted-foreground/40">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-lg font-medium text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground font-body font-light">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
