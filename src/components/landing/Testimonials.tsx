import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  { name: "Jessica", rating: 5, text: "Incredible experience from start to finish. The physician approval process gave me so much confidence in my treatment plan." },
  { name: "Marcus", rating: 5, text: "The weight management program changed my life. Professional, caring team and real results within weeks." },
  { name: "Ava", rating: 5, text: "Love how easy the platform is to use. Booked my skin rejuvenation treatment in minutes and the results are amazing!" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-16 bg-background">
      <div className="container px-4">
        <h2 className="text-center font-display text-3xl sm:text-4xl font-medium text-foreground">What Our Patients Say</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground font-body font-light text-sm sm:text-base">
          Real experiences from real patients.
        </p>
        <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-8 flex flex-col gap-4 transition-all duration-300 hover:shadow-md hover:-translate-y-[3px]"
            >
              <StarRating rating={t.rating} />
              <p className="text-sm sm:text-base text-foreground/80 leading-relaxed flex-1 font-body font-light">"{t.text}"</p>
              <p className="text-sm font-body font-medium text-foreground">— {t.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
