import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";

const sections = [
  {
    title: "1. Terms of Use",
    content: "By accessing MedAesthetics, you agree to these terms. Our platform provides physician-supervised aesthetic and wellness treatments. You must be 18 years or older to use our services. Account credentials are personal and non-transferable. We reserve the right to suspend accounts that violate these terms."
  },
  {
    title: "2. Medical Disclaimer",
    content: "All treatments offered through MedAesthetics are prescribed and supervised by licensed physicians. Results vary by individual. The information on this platform is for educational purposes and does not replace professional medical advice. Always consult with a qualified physician before starting any treatment. In case of a medical emergency, call 911 immediately."
  },
  {
    title: "3. Patient Responsibilities",
    content: "Patients must: provide accurate and complete medical history, disclose all current medications and supplements, follow prescribed treatment protocols, attend scheduled appointments or cancel with 24-hour notice, report any adverse reactions immediately, and maintain honest communication with their assigned physician."
  },
  {
    title: "4. Payment Terms",
    content: "All prices are listed in USD. Payment is required at the time of order or appointment booking. Refunds for unused treatments are available within 14 days of purchase. Consultation fees are non-refundable. Insurance is not accepted at this time. Payment plans may be available for qualifying treatments."
  },
  {
    title: "5. Intellectual Property",
    content: "All content, branding, and materials on this platform are the property of MedAesthetics and are protected by copyright and trademark laws. You may not reproduce, distribute, or create derivative works without written permission."
  },
  {
    title: "6. Limitation of Liability",
    content: "MedAesthetics facilitates connections between patients and licensed physicians. While we maintain high standards, we are not liable for individual treatment outcomes. Our liability is limited to the amount paid for services. We are not responsible for third-party services or content linked from our platform."
  },
];

export default function Terms() {
  return (
    <div className="container max-w-3xl pt-24 pb-16 animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 font-body font-light mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <div className="flex items-center gap-3 mb-2">
        <FileText className="h-6 w-6 text-primary" />
        <h1 className="font-display text-3xl font-medium text-foreground">Terms of Service</h1>
      </div>
      <p className="text-muted-foreground font-body font-light mb-2">Medical Platform Terms & Conditions</p>
      <p className="text-xs text-muted-foreground font-light mb-10">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

      <div className="space-y-8">
        {sections.map(s => (
          <div key={s.title} className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-medium text-foreground mb-3">{s.title}</h2>
            <p className="text-sm text-muted-foreground font-body font-light leading-relaxed">{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
