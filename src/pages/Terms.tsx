import { Link } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";

const sections = [
  {
    title: "Acceptance of Terms",
    content: "By accessing and using the Harmony Medical Aesthetics platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, you must not access or use our services. We reserve the right to update these terms at any time, and continued use constitutes acceptance of any changes."
  },
  {
    title: "Platform Description",
    content: "Harmony Medical Aesthetics is a digital platform that connects patients with licensed physicians for aesthetic and wellness treatments. Our platform facilitates medical consultations, treatment plan development, product ordering, and appointment scheduling. All medical services are provided by independently licensed healthcare professionals."
  },
  {
    title: "Medical Disclaimer",
    content: "The information provided on this platform is for educational and informational purposes only and does not constitute medical advice. All treatments are prescribed and supervised by licensed physicians. Individual results may vary. This platform is NOT a substitute for emergency medical care — in case of a medical emergency, call 911 immediately. Always consult with a qualified healthcare provider before starting any new treatment or medication."
  },
  {
    title: "Patient Responsibilities",
    content: "As a patient, you agree to: provide accurate, complete, and current medical history and personal information; disclose all current medications, supplements, and treatments; follow prescribed treatment protocols and physician instructions; attend scheduled appointments or cancel with at least 24-hour notice; report any adverse reactions, side effects, or concerns immediately; maintain honest and transparent communication with your assigned physician; not share your account credentials with any other person."
  },
  {
    title: "Physician Services",
    content: "All physicians on our platform are independently licensed and board-certified. Physician services include medical intake review, treatment eligibility assessment, treatment plan development, prescription management, and follow-up consultations. The physician-patient relationship is established upon review and acceptance of your medical intake form."
  },
  {
    title: "Payment and Refund Terms",
    content: "All prices are listed in United States Dollars (USD). Payment is required at the time of order placement or appointment booking. Refunds for unused treatments may be available within 14 days of purchase, subject to review. Consultation fees are non-refundable once the consultation has occurred. Insurance is not currently accepted. Payment plans may be available for qualifying treatments upon request."
  },
  {
    title: "Intellectual Property",
    content: "All content, branding, logos, designs, software, and materials on this platform are the exclusive property of Harmony Medical Aesthetics and are protected by United States and international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works without prior written consent."
  },
  {
    title: "Limitation of Liability",
    content: "Harmony Medical Aesthetics facilitates connections between patients and licensed physicians. While we maintain high standards for quality and safety, we are not liable for individual treatment outcomes, adverse reactions, or the medical judgment of individual physicians. Our total liability is limited to the amount paid for the specific service in question. We are not responsible for third-party services, content, or products linked from our platform."
  },
  {
    title: "Governing Law",
    content: "These Terms of Service shall be governed by and construed in accordance with the laws of the Commonwealth of Puerto Rico and the applicable federal laws of the United States of America. Any disputes arising from these terms shall be resolved in the courts of Puerto Rico."
  },
  {
    title: "Contact Information",
    content: "For questions about these Terms of Service, please contact us at: Email: legal@harmonymedicalaesthetics.com, Phone: 1-800-MED-AEST, Address: Harmony Medical Aesthetics, San Juan, Puerto Rico, USA."
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

      <div className="space-y-6">
        {sections.map((s, i) => (
          <div key={s.title} className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-medium text-foreground mb-3">{i + 1}. {s.title}</h2>
            <p className="text-sm text-muted-foreground font-body font-light leading-relaxed">{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
