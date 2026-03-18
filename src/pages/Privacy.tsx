import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";

const sections = [
  {
    title: "Introduction",
    content: "Harmony Medical Aesthetics ('we,' 'us,' or 'our') is committed to protecting the privacy and security of your personal and protected health information (PHI). This platform handles PHI in accordance with the Health Insurance Portability and Accountability Act of 1996 (HIPAA) and applicable state privacy laws."
  },
  {
    title: "Information We Collect",
    content: "We collect the following categories of information: Personal identifiers (name, email, phone, date of birth), Protected Health Information (medical history, conditions, medications, allergies, treatment records), Payment information (processed securely through third-party providers), Government-issued identification for identity verification, Photos for aesthetic evaluation purposes, and usage analytics to improve our services."
  },
  {
    title: "How We Use Your Information",
    content: "Your information is used exclusively for: providing medical consultations and personalized treatment plans, processing orders and managing appointments, physician review and treatment eligibility assessment, communicating treatment updates and important health information, ensuring patient safety through comprehensive medical history review, regulatory compliance and quality improvement, and billing and payment processing."
  },
  {
    title: "HIPAA Privacy Rights",
    content: "As a patient, you have the following rights under HIPAA: Right to access your medical records and obtain copies, Right to request amendments to your health information, Right to an accounting of disclosures of your PHI, Right to request restrictions on certain uses and disclosures, Right to receive confidential communications, Right to receive a copy of this notice, Right to file a complaint with us or the HHS Office for Civil Rights if you believe your privacy rights have been violated."
  },
  {
    title: "Data Security",
    content: "We employ comprehensive security measures including: AES-256 encryption for all data at rest, TLS 1.3 encryption for all data in transit, Role-based access controls limiting PHI access to authorized personnel, Multi-factor authentication for all staff accounts, Regular security audits and penetration testing, HIPAA-compliant cloud infrastructure with SOC 2 Type II certification, Automated breach detection and incident response systems, Regular staff training on HIPAA compliance and security best practices."
  },
  {
    title: "Third-Party Services",
    content: "We use the following third-party services that may process your data: Cloud infrastructure providers for secure data storage, Payment processors for handling financial transactions, Communication services for email and SMS notifications. All third-party providers are bound by Business Associate Agreements (BAAs) ensuring HIPAA compliance."
  },
  {
    title: "Data Retention",
    content: "Medical records are retained for a minimum of 7 years as required by federal and state regulations, or longer if required by applicable law. Non-medical account data is retained for the duration of your account and up to 30 days after a deletion request. Payment records are retained as required by financial regulations and tax law."
  },
  {
    title: "Contact Information",
    content: "For privacy-related inquiries, data access requests, or to file a complaint, contact our Privacy Officer at privacy@harmonymedicalaesthetics.com or call 1-800-MED-AEST. You may also contact the U.S. Department of Health and Human Services Office for Civil Rights at www.hhs.gov/ocr."
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
