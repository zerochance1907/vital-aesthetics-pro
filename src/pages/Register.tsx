import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { toast } from "sonner";

function getStrength(pw: string): { label: string; color: string; width: string } {
  if (pw.length < 6) return { label: "Weak", color: "bg-destructive", width: "w-1/4" };
  const has = { upper: /[A-Z]/.test(pw), num: /\d/.test(pw), special: /[^A-Za-z0-9]/.test(pw) };
  const score = [pw.length >= 8, has.upper, has.num, has.special].filter(Boolean).length;
  if (score >= 4) return { label: "Strong", color: "bg-success", width: "w-full" };
  if (score >= 2) return { label: "Medium", color: "bg-warning", width: "w-2/3" };
  return { label: "Weak", color: "bg-destructive", width: "w-1/3" };
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const strength = getStrength(form.password);
  const validations = {
    fullName: form.fullName.trim().length >= 2,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email),
    password: form.password.length >= 8,
    confirm: form.password === form.confirm && form.confirm.length > 0,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ fullName: true, email: true, password: true, confirm: true });
    if (!Object.values(validations).every(Boolean)) return;
    const result = register(form.fullName, form.email, form.password);
    if (result.success) {
      toast.success("Account created successfully!");
      navigate("/intake");
    } else {
      setError(result.error || "Registration failed");
    }
  };

  const fieldClass = (field: keyof typeof validations) => {
    if (!touched[field]) return "";
    return validations[field] ? "border-success focus-visible:ring-success" : "border-destructive focus-visible:ring-destructive";
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 pt-20 animate-fade-in">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-navy">Create Account</h1>
          <p className="mt-2 text-muted-foreground">Start your wellness journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
          {error && <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <Input id="fullName" required className={fieldClass("fullName")} value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                onBlur={() => setTouched(t => ({ ...t, fullName: true }))} />
              {touched.fullName && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  {validations.fullName ? <Check className="h-4 w-4 text-success" /> : <X className="h-4 w-4 text-destructive" />}
                </span>
              )}
            </div>
            {touched.fullName && !validations.fullName && <p className="text-xs text-destructive">Name is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Input id="email" type="email" required className={fieldClass("email")} value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                onBlur={() => setTouched(t => ({ ...t, email: true }))} />
              {touched.email && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  {validations.email ? <Check className="h-4 w-4 text-success" /> : <X className="h-4 w-4 text-destructive" />}
                </span>
              )}
            </div>
            {touched.email && !validations.email && <p className="text-xs text-destructive">Valid email is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" type={showPw ? "text" : "password"} required className={`pr-10 ${fieldClass("password")}`} value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onBlur={() => setTouched(t => ({ ...t, password: true }))} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {form.password.length > 0 && (
              <div className="space-y-1">
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                </div>
                <p className="text-xs text-muted-foreground">Strength: {strength.label}</p>
              </div>
            )}
            {touched.password && !validations.password && <p className="text-xs text-destructive">Minimum 8 characters</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm Password</Label>
            <div className="relative">
              <Input id="confirm" type={showConfirm ? "text" : "password"} required className={`pr-10 ${fieldClass("confirm")}`} value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                onBlur={() => setTouched(t => ({ ...t, confirm: true }))} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {touched.confirm && !validations.confirm && <p className="text-xs text-destructive">Passwords must match</p>}
          </div>

          <Button type="submit" className="w-full" size="lg">Create Account</Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
