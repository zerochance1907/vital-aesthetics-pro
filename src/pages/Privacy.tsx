import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";

const sections = [
  {
    title: "1. Data Collection",
    content: "We collect personal and medical information necessary for providing aesthetic and wellness treatments. This includes your name, contact details, medical history, treatment preferences, and payment information. All data is collected with your explicit consent and in accordance with HIPAA regulations."
  },
  {
    title: "2. Use of Information",
    content: "Your information is used exclusively for: providing medical consultations and treatment plans, processing orders and appointments, communicating treatment updates, ensuring patient safety through medical history review, and improving our services. We never sell your personal or medical data to third parties."
  },
  {
    title: "3. Patient Rights",
    content: "As a patient, you have the right to: access your medical records at any time, request corrections to your personal information, obtain a copy of your data in a portable format, request deletion of your account and associated data, opt out of non-essential communications, and file a complaint with the HHS Office for Civil Rights."
  },
  {
    title: "4. Data Security",
    content: "We employ enterprise-grade security measures including: AES-256 encryption for all data at rest, TLS 1.3 encryption for data in transit, role-based access controls for staff, regular security audits and penetration testing, HIPAA-compliant cloud infrastructure, and automated breach detection and response systems."
  },
  {
    title: "5. Data Retention",
    content: "Medical records are retained for a minimum of 7 years as required by federal and state regulations. Non-medical account data is retained for the duration of your account and up to 30 days after deletion request. Payment records are retained as required by financial regulations."
  },
  {
    title: "6. Contact & Complaints",
    content: "For privacy-related inquiries, data access requests, or to file a complaint, contact our Privacy Officer at privacy@medaesthetics.com or call 1-800-MED-AEST. You may also contact the U.S. Department of Health and Human Services Office for Civil Rights."
  },
];

export default function Privacy() {
  return (
    <div className="container max-w-3xl pt-24 pb-16 animate-fade-in">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 font-body font-light mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Home
      </Link>
      <div className="flex items-center gap-3 mb-2">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="font-display text-3xl font-medium text-foreground">Privacy Policy</h1>
      </div>
      <p className="text-muted-foreground font-body font-light mb-2">HIPAA-Compliant Medical Privacy Policy</p>
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
