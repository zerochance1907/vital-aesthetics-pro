import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const stepLabels = ["Personal Info", "Medical History", "Consent & Submit"];

export default function MedicalIntake() {
  const { user, completeIntake } = useAuth();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [consent, setConsent] = useState(false);

  if (!user) return <Navigate to="/login" />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    completeIntake();
    setSubmitted(true);
    toast.success("Medical intake form submitted!");
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 pt-20 animate-fade-in">
        <div className="max-w-lg text-center space-y-4 rounded-xl border border-border bg-card p-8 shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <CheckCircle2 className="h-12 w-12 text-primary animate-fade-in" />
          </div>
          <h2 className="font-display text-2xl font-medium text-foreground">Form Submitted Successfully!</h2>
          <p className="text-muted-foreground font-body font-light">
            A physician will review your application within 24–48 hours. You will be notified once approved.
          </p>
          <Button asChild className="mt-4"><a href="/dashboard">BACK TO DASHBOARD</a></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen justify-center p-4 pt-24 pb-10 animate-fade-in">
      <div className="w-full max-w-xl space-y-6">
        <div className="text-center">
          <h1 className="font-display text-3xl font-medium text-foreground">Medical Intake Form</h1>
          <p className="mt-2 text-muted-foreground font-body font-light">Please complete before physician review</p>
        </div>

        <div className="flex items-center gap-2">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex-1">
              <div className={`h-1.5 rounded-full transition-colors duration-300 ${i <= step ? "bg-primary" : "bg-muted"}`} />
              <p className={`mt-1.5 text-xs font-body font-light ${i <= step ? "text-primary" : "text-muted-foreground"}`}>{label}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 shadow-sm">
          {step === 0 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-body font-light">Full Name</Label>
                  <Input required defaultValue={`${user.firstName} ${user.lastName}`.trim()} className="focus:border-primary focus:ring-primary" />
                </div>
                <div className="space-y-2">
                  <Label className="font-body font-light">Email</Label>
                  <Input type="email" required defaultValue={user.email} className="focus:border-primary focus:ring-primary" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="font-body font-light">Age</Label>
                  <Input type="number" required min={18} max={120} className="focus:border-primary focus:ring-primary" />
                </div>
                <div className="space-y-2">
                  <Label className="font-body font-light">Weight (kg)</Label>
                  <Input type="number" required min={30} max={300} className="focus:border-primary focus:ring-primary" />
                </div>
                <div className="space-y-2">
                  <Label className="font-body font-light">Height (cm)</Label>
                  <Input type="number" required min={100} max={250} className="focus:border-primary focus:ring-primary" />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label className="font-body font-light">Medical Conditions</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="diabetes">Diabetes</SelectItem>
                    <SelectItem value="hbp">High Blood Pressure</SelectItem>
                    <SelectItem value="heart">Heart Condition</SelectItem>
                    <SelectItem value="asthma">Asthma</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-body font-light">Current Medications</Label>
                <Textarea placeholder="List any current medications..." className="focus:border-primary focus:ring-primary" />
              </div>
              <div className="space-y-2">
                <Label className="font-body font-light">Allergies or Health Concerns</Label>
                <Textarea placeholder="List any allergies or health concerns..." className="focus:border-primary focus:ring-primary" />
              </div>
              <div className="space-y-2">
                <Label className="font-body font-light">Previous Surgeries</Label>
                <Textarea placeholder="List any previous surgeries..." className="focus:border-primary focus:ring-primary" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="rounded-md bg-muted p-4 text-sm text-muted-foreground font-body font-light leading-relaxed">
                <p className="font-body font-medium text-foreground mb-2">Consent Declaration</p>
                I hereby declare that all information provided in this medical intake form is accurate and complete to the best of my knowledge.
                I understand that this information will be reviewed by a licensed physician for the purpose of determining my eligibility for aesthetic and wellness treatments.
                I consent to the collection, storage, and processing of my personal and medical data in accordance with applicable privacy regulations.
                I understand that providing false or misleading information may result in denial of services or adverse health outcomes.
              </div>
              <div className="flex items-start gap-3 rounded-md border border-border p-4">
                <Checkbox id="consent" checked={consent} onCheckedChange={v => setConsent(v === true)} />
                <label htmlFor="consent" className="text-sm leading-relaxed text-foreground cursor-pointer font-body font-light">
                  I confirm the information provided is accurate and consent to physician review.
                </label>
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            {step > 0 && (
              <Button type="button" variant="outline" onClick={() => setStep(s => s - 1)} className="flex-1">
                <ChevronLeft className="mr-1 h-4 w-4" /> BACK
              </Button>
            )}
            {step < 2 ? (
              <Button type="button" onClick={() => setStep(s => s + 1)} className="flex-1">
                NEXT <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" className="flex-1" disabled={!consent}>SUBMIT INTAKE FORM</Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
