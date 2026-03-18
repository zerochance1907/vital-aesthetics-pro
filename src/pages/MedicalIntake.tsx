import { useState, useRef, useEffect } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, ChevronLeft, ChevronRight, Upload, X } from "lucide-react";
import { toast } from "sonner";

const stepLabels = ["Personal Info", "Medical History", "Aesthetic Goals", "Documents", "Consent"];

const medicalConditions = ["Diabetes", "High Blood Pressure", "Heart Condition", "Asthma", "Thyroid Issues", "Cancer History", "None", "Other"];
const goalOptions = ["Weight Loss", "Anti-Aging", "Skin Rejuvenation", "Hormone Optimization", "Energy and Wellness", "Pain Management", "Other"];

export default function MedicalIntake() {
  const { user, completeIntake } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // Step 1: Personal Info
  const [personal, setPersonal] = useState({
    fullName: "",
    email: "",
    dob: "",
    gender: "",
    height: "",
    weight: "",
    phone: "",
  });

  // Step 2: Medical History
  const [conditions, setConditions] = useState<string[]>([]);
  const [diabetesType, setDiabetesType] = useState("");
  const [hba1c, setHba1c] = useState("");
  const [diabetesMeds, setDiabetesMeds] = useState("");
  const [bpReadings, setBpReadings] = useState("");
  const [bpMeds, setBpMeds] = useState("");
  const [heartType, setHeartType] = useState("");
  const [cardiologist, setCardiologist] = useState("");
  const [lastCardioVisit, setLastCardioVisit] = useState("");
  const [cancerType, setCancerType] = useState("");
  const [cancerStatus, setCancerStatus] = useState("");
  const [lastOncoVisit, setLastOncoVisit] = useState("");
  const [medications, setMedications] = useState("");
  const [allergies, setAllergies] = useState("");
  const [surgeries, setSurgeries] = useState("");
  const [familyHistory, setFamilyHistory] = useState("");

  // Step 3: Aesthetic Goals
  const [goals, setGoals] = useState<string[]>([]);
  const [goalDetails, setGoalDetails] = useState("");
  const [triedBefore, setTriedBefore] = useState<"yes" | "no" | "">("");
  const [previousTreatments, setPreviousTreatments] = useState("");

  // Step 4: Documents
  const [idFile, setIdFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const idInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Step 5: Consent
  const [consent, setConsent] = useState(false);
  const [signature, setSignature] = useState("");

  useEffect(() => {
    if (user) {
      setPersonal(p => ({
        ...p,
        fullName: p.fullName || `${user.firstName} ${user.lastName}`.trim(),
        email: p.email || user.email,
      }));
    }
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  const toggleCondition = (c: string) => {
    if (c === "None") {
      setConditions(prev => prev.includes("None") ? [] : ["None"]);
    } else {
      setConditions(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev.filter(x => x !== "None"), c]);
    }
  };

  const toggleGoal = (g: string) => {
    setGoals(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (f: File | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File must be under 5MB");
        return;
      }
      setter(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent || !signature.trim()) {
      toast.error("Please complete the consent section");
      return;
    }

    // Save intake data to localStorage
    const intakeData = {
      personal, conditions, diabetesType, hba1c, diabetesMeds, bpReadings, bpMeds,
      heartType, cardiologist, lastCardioVisit, cancerType, cancerStatus, lastOncoVisit,
      medications, allergies, surgeries, familyHistory, goals, goalDetails, triedBefore,
      previousTreatments, signature, submittedAt: new Date().toISOString(),
      idFileName: idFile?.name, photoFileName: photoFile?.name,
    };

    try {
      const existing = JSON.parse(localStorage.getItem("intake_submissions") || "{}");
      existing[user.email] = intakeData;
      localStorage.setItem("intake_submissions", JSON.stringify(existing));
    } catch {
      localStorage.setItem("intake_submissions", JSON.stringify({ [user.email]: intakeData }));
    }

    completeIntake();
    addNotification({ type: "form_submitted", title: "Form Submitted", message: "Your medical intake form has been submitted for physician review." });
    setSubmitted(true);
    toast.success("Medical intake form submitted!");
  };

  const canProceed = () => {
    if (step === 0) return personal.fullName && personal.email && personal.dob && personal.gender && personal.height && personal.weight && personal.phone;
    if (step === 1) return conditions.length > 0;
    if (step === 2) return goals.length > 0;
    if (step === 3) return !!idFile;
    return consent && signature.trim().length > 0;
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 pt-20 animate-fade-in">
        <div className="max-w-lg text-center space-y-4 rounded-xl border border-border bg-card p-8 shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted animate-fade-in">
            <CheckCircle2 className="h-12 w-12 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-medium text-foreground">Form Submitted Successfully!</h2>
          <p className="text-muted-foreground font-body font-light">
            A physician will review your application within 24–48 hours.
          </p>
          <Button onClick={() => navigate("/dashboard")} className="mt-4">BACK TO DASHBOARD</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen justify-center p-4 pt-24 pb-10 animate-fade-in">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="font-display text-3xl font-medium text-foreground">Medical Intake Form</h1>
          <p className="mt-2 text-muted-foreground font-body font-light">Please complete all steps for physician review</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-1">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex-1">
              <div className={`h-1.5 rounded-full transition-colors duration-300 ${i <= step ? "bg-primary" : "bg-muted"}`} />
              <p className={`mt-1.5 text-[10px] font-body font-light text-center ${i <= step ? "text-primary" : "text-muted-foreground"}`}>{label}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-5">
          {/* Step 1: Personal Info */}
          {step === 0 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-display text-lg font-medium text-foreground">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-body font-light">Full Name</Label>
                  <Input value={personal.fullName} onChange={e => setPersonal({ ...personal, fullName: e.target.value })} required className="focus:border-primary focus:ring-primary" />
                </div>
                <div className="space-y-2">
                  <Label className="font-body font-light">Email</Label>
                  <Input type="email" value={personal.email} onChange={e => setPersonal({ ...personal, email: e.target.value })} required className="focus:border-primary focus:ring-primary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-body font-light">Date of Birth</Label>
                  <Input type="date" value={personal.dob} onChange={e => setPersonal({ ...personal, dob: e.target.value })} required className="focus:border-primary focus:ring-primary" />
                </div>
                <div className="space-y-2">
                  <Label className="font-body font-light">Gender</Label>
                  <Select value={personal.gender} onValueChange={v => setPersonal({ ...personal, gender: v })}>
                    <SelectTrigger className="focus:border-primary focus:ring-primary"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="prefer_not">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="font-body font-light">Height (cm)</Label>
                  <Input type="number" min={100} max={250} value={personal.height} onChange={e => setPersonal({ ...personal, height: e.target.value })} required className="focus:border-primary focus:ring-primary" />
                </div>
                <div className="space-y-2">
                  <Label className="font-body font-light">Weight (kg)</Label>
                  <Input type="number" min={30} max={300} value={personal.weight} onChange={e => setPersonal({ ...personal, weight: e.target.value })} required className="focus:border-primary focus:ring-primary" />
                </div>
                <div className="space-y-2">
                  <Label className="font-body font-light">Phone</Label>
                  <Input type="tel" value={personal.phone} onChange={e => setPersonal({ ...personal, phone: e.target.value })} required className="focus:border-primary focus:ring-primary" />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Medical History */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <h3 className="font-display text-lg font-medium text-foreground">Medical History</h3>
              <div className="space-y-3">
                <Label className="font-body font-light">Do you have any medical conditions?</Label>
                <div className="grid grid-cols-2 gap-2">
                  {medicalConditions.map(c => (
                    <label key={c} className={`flex items-center gap-2 rounded-[6px] border px-3 py-2 text-sm cursor-pointer transition-all duration-300 ${conditions.includes(c) ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:border-primary/30"}`}>
                      <Checkbox checked={conditions.includes(c)} onCheckedChange={() => toggleCondition(c)} />
                      <span className="font-body font-light">{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Conditional: Diabetes */}
              {conditions.includes("Diabetes") && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3 animate-fade-in">
                  <p className="text-sm font-body font-medium text-primary">Diabetes Details</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-body font-light">Type</Label>
                      <Select value={diabetesType} onValueChange={setDiabetesType}>
                        <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="type1">Type 1</SelectItem>
                          <SelectItem value="type2">Type 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-body font-light">Current HbA1c Level</Label>
                      <Input value={hba1c} onChange={e => setHba1c(e.target.value)} placeholder="e.g. 6.5%" className="h-9" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-body font-light">Diabetic Medications</Label>
                    <Textarea value={diabetesMeds} onChange={e => setDiabetesMeds(e.target.value)} placeholder="List current diabetic medications..." rows={2} />
                  </div>
                </div>
              )}

              {/* Conditional: High Blood Pressure */}
              {conditions.includes("High Blood Pressure") && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3 animate-fade-in">
                  <p className="text-sm font-body font-medium text-primary">Blood Pressure Details</p>
                  <div className="space-y-1">
                    <Label className="text-xs font-body font-light">Current Blood Pressure Readings</Label>
                    <Input value={bpReadings} onChange={e => setBpReadings(e.target.value)} placeholder="e.g. 140/90 mmHg" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-body font-light">BP Medications</Label>
                    <Textarea value={bpMeds} onChange={e => setBpMeds(e.target.value)} placeholder="List BP medications..." rows={2} />
                  </div>
                </div>
              )}

              {/* Conditional: Heart Condition */}
              {conditions.includes("Heart Condition") && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3 animate-fade-in">
                  <p className="text-sm font-body font-medium text-primary">Heart Condition Details</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-body font-light">Type of Heart Condition</Label>
                      <Input value={heartType} onChange={e => setHeartType(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-body font-light">Cardiologist Name</Label>
                      <Input value={cardiologist} onChange={e => setCardiologist(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-body font-light">Last Cardiology Visit</Label>
                    <Input type="date" value={lastCardioVisit} onChange={e => setLastCardioVisit(e.target.value)} />
                  </div>
                </div>
              )}

              {/* Conditional: Cancer History */}
              {conditions.includes("Cancer History") && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3 animate-fade-in">
                  <p className="text-sm font-body font-medium text-primary">Cancer History Details</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-body font-light">Type of Cancer</Label>
                      <Input value={cancerType} onChange={e => setCancerType(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs font-body font-light">Treatment Status</Label>
                      <Select value={cancerStatus} onValueChange={setCancerStatus}>
                        <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active Treatment</SelectItem>
                          <SelectItem value="remission">Remission</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-body font-light">Last Oncologist Visit</Label>
                    <Input type="date" value={lastOncoVisit} onChange={e => setLastOncoVisit(e.target.value)} />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="font-body font-light">Current Medications</Label>
                <Textarea value={medications} onChange={e => setMedications(e.target.value)} placeholder="List all current medications..." className="focus:border-primary focus:ring-primary" />
              </div>
              <div className="space-y-2">
                <Label className="font-body font-light">Known Allergies</Label>
                <Textarea value={allergies} onChange={e => setAllergies(e.target.value)} placeholder="List all drug, food, and environmental allergies..." className="focus:border-primary focus:ring-primary" />
                <p className="text-xs text-muted-foreground font-body font-light">Include all drug, food, and environmental allergies</p>
              </div>
              <div className="space-y-2">
                <Label className="font-body font-light">Previous Surgeries</Label>
                <Textarea value={surgeries} onChange={e => setSurgeries(e.target.value)} placeholder="List any previous surgeries..." className="focus:border-primary focus:ring-primary" />
              </div>
              <div className="space-y-2">
                <Label className="font-body font-light">Family Medical History</Label>
                <Textarea value={familyHistory} onChange={e => setFamilyHistory(e.target.value)} placeholder="Notable family medical history..." className="focus:border-primary focus:ring-primary" />
              </div>
            </div>
          )}

          {/* Step 3: Aesthetic Goals */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <h3 className="font-display text-lg font-medium text-foreground">Aesthetic & Wellness Goals</h3>
              <div className="space-y-3">
                <Label className="font-body font-light">What are your primary goals?</Label>
                <div className="grid grid-cols-2 gap-2">
                  {goalOptions.map(g => (
                    <label key={g} className={`flex items-center gap-2 rounded-[6px] border px-3 py-2 text-sm cursor-pointer transition-all duration-300 ${goals.includes(g) ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:border-primary/30"}`}>
                      <Checkbox checked={goals.includes(g)} onCheckedChange={() => toggleGoal(g)} />
                      <span className="font-body font-light">{g}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-body font-light">Describe your goals in detail</Label>
                <Textarea value={goalDetails} onChange={e => setGoalDetails(e.target.value)} placeholder="Tell us more about what you'd like to achieve..." rows={4} className="focus:border-primary focus:ring-primary" />
              </div>
              <div className="space-y-3">
                <Label className="font-body font-light">Have you tried any treatments before?</Label>
                <div className="flex gap-3">
                  <label className={`flex items-center gap-2 rounded-[6px] border px-4 py-2 text-sm cursor-pointer transition-all duration-300 ${triedBefore === "yes" ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:border-primary/30"}`}>
                    <input type="radio" name="tried" value="yes" checked={triedBefore === "yes"} onChange={() => setTriedBefore("yes")} className="sr-only" />
                    <span className="font-body font-light">Yes</span>
                  </label>
                  <label className={`flex items-center gap-2 rounded-[6px] border px-4 py-2 text-sm cursor-pointer transition-all duration-300 ${triedBefore === "no" ? "border-primary bg-primary/10 text-primary" : "border-border text-foreground hover:border-primary/30"}`}>
                    <input type="radio" name="tried" value="no" checked={triedBefore === "no"} onChange={() => setTriedBefore("no")} className="sr-only" />
                    <span className="font-body font-light">No</span>
                  </label>
                </div>
              </div>
              {triedBefore === "yes" && (
                <div className="space-y-2 animate-fade-in">
                  <Label className="font-body font-light">What treatments have you tried?</Label>
                  <Textarea value={previousTreatments} onChange={e => setPreviousTreatments(e.target.value)} placeholder="Describe previous treatments..." rows={3} className="focus:border-primary focus:ring-primary" />
                </div>
              )}
            </div>
          )}

          {/* Step 4: Documents */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <h3 className="font-display text-lg font-medium text-foreground">ID & Documents</h3>
              <div className="space-y-3">
                <Label className="font-body font-light">Upload Government ID <span className="text-destructive">*</span></Label>
                <p className="text-xs text-muted-foreground font-body font-light">Upload a clear photo of your government-issued ID (JPG, PNG, PDF — max 5MB)</p>
                <input ref={idInputRef} type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={e => handleFileChange(e, setIdFile)} />
                {idFile ? (
                  <div className="flex items-center gap-3 rounded-[6px] border border-primary bg-primary/5 px-4 py-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm font-body font-light text-foreground flex-1 truncate">{idFile.name}</span>
                    <button type="button" onClick={() => setIdFile(null)} className="text-muted-foreground hover:text-destructive transition-colors duration-300"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <button type="button" onClick={() => idInputRef.current?.click()} className="flex w-full items-center justify-center gap-2 rounded-[6px] border-2 border-dashed border-border py-8 text-sm text-muted-foreground hover:border-primary/30 hover:text-primary transition-all duration-300">
                    <Upload className="h-5 w-5" /> Click to upload
                  </button>
                )}
              </div>
              <div className="space-y-3">
                <Label className="font-body font-light">Upload a Recent Photo <span className="text-xs text-muted-foreground">(Optional)</span></Label>
                <p className="text-xs text-muted-foreground font-body font-light">For aesthetic evaluation purposes</p>
                <input ref={photoInputRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={e => handleFileChange(e, setPhotoFile)} />
                {photoFile ? (
                  <div className="flex items-center gap-3 rounded-[6px] border border-primary bg-primary/5 px-4 py-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-sm font-body font-light text-foreground flex-1 truncate">{photoFile.name}</span>
                    <button type="button" onClick={() => setPhotoFile(null)} className="text-muted-foreground hover:text-destructive transition-colors duration-300"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <button type="button" onClick={() => photoInputRef.current?.click()} className="flex w-full items-center justify-center gap-2 rounded-[6px] border-2 border-dashed border-border py-8 text-sm text-muted-foreground hover:border-primary/30 hover:text-primary transition-all duration-300">
                    <Upload className="h-5 w-5" /> Click to upload
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Consent */}
          {step === 4 && (
            <div className="space-y-5 animate-fade-in">
              <h3 className="font-display text-lg font-medium text-foreground">Legal Consent</h3>
              <div className="rounded-lg border border-border bg-muted/50 p-4 max-h-48 overflow-y-auto text-sm text-muted-foreground font-body font-light leading-relaxed">
                <p>I hereby confirm that all information provided in this medical intake form is accurate and complete to the best of my knowledge.</p>
                <p className="mt-3">I consent to the review of my medical information by licensed physicians on the Harmony Medical Aesthetics platform for the purpose of treatment eligibility assessment.</p>
                <p className="mt-3">I understand that access to the medical marketplace and treatment programs is subject to physician approval.</p>
                <p className="mt-3">I acknowledge that this platform is not a substitute for emergency medical care.</p>
                <p className="mt-3">I authorize Harmony Medical Aesthetics to contact me via email, SMS, and phone regarding my application and treatment plan.</p>
              </div>
              <div className="flex items-start gap-3 rounded-[6px] border border-border p-4">
                <Checkbox id="consent" checked={consent} onCheckedChange={v => setConsent(v === true)} />
                <label htmlFor="consent" className="text-sm leading-relaxed text-foreground cursor-pointer font-body font-light">
                  I have read and agree to the above declaration
                </label>
              </div>
              <div className="space-y-2">
                <Label className="font-body font-light">Digital Signature</Label>
                <p className="text-xs text-muted-foreground font-body font-light">Type your full name as your electronic signature</p>
                <Input value={signature} onChange={e => setSignature(e.target.value)} placeholder="Type your full legal name" className="font-body italic focus:border-primary focus:ring-primary" />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-6 flex gap-3 pt-4 border-t border-border">
            {step > 0 && (
              <Button type="button" variant="outline" onClick={() => setStep(s => s - 1)} className="flex-1">
                <ChevronLeft className="mr-1 h-4 w-4" /> BACK
              </Button>
            )}
            {step < 4 ? (
              <Button type="button" onClick={() => setStep(s => s + 1)} className="flex-1" disabled={!canProceed()}>
                NEXT <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" className="flex-1" disabled={!consent || !signature.trim()}>SUBMIT INTAKE FORM</Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
