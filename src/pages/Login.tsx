import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showDemo, setShowDemo] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate brief loading
    await new Promise(r => setTimeout(r, 600));
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      toast.success("Welcome back!");
      navigate("/dashboard");
    } else {
      setError(result.error || "Sign in failed");
    }
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("If an account exists with this email, a reset link has been sent.");
    setForgotOpen(false);
    setResetEmail("");
  };

  const demoAccounts = [
    { label: "New Patient", email: "new@demo.com", password: "demo123" },
    { label: "Approved Patient", email: "approved@demo.com", password: "demo123" },
    { label: "Admin", email: "admin@medaesthetics.com", password: "Admin123" },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-navy">Welcome Back</h1>
          <p className="mt-2 text-muted-foreground">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
          {error && <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required className="h-11" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <button type="button" onClick={() => setForgotOpen(true)} className="text-xs text-primary hover:underline">Forgot Password?</button>
            </div>
            <div className="relative">
              <Input id="password" type={showPw ? "text" : "password"} required className="pr-10 h-11" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full h-11" size="lg" disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing In...</> : "Sign In"}
          </Button>
        </form>

        {/* Demo Credentials */}
        <div className="rounded-lg border bg-muted/50 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowDemo(!showDemo)}
            className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>👁 View Demo Credentials</span>
            {showDemo ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {showDemo && (
            <div className="border-t px-4 pb-4 pt-3 space-y-2 animate-fade-in">
              {demoAccounts.map(acc => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => { setEmail(acc.email); setPassword(acc.password); setError(""); toast.info(`${acc.label} credentials filled`); }}
                  className="flex w-full items-center justify-between rounded-md border bg-card px-3 py-2 text-left text-xs hover:border-primary/40 transition-colors"
                >
                  <div>
                    <span className="font-semibold text-foreground">{acc.label}</span>
                    <span className="ml-2 text-muted-foreground">{acc.email} / {acc.password}</span>
                  </div>
                  <span className="text-primary text-[10px] font-medium">USE</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">Create Account</Link>
        </p>
      </div>

      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleReset} className="space-y-4">
            <p className="text-sm text-muted-foreground">Enter your email and we'll send you a reset link.</p>
            <Input type="email" required placeholder="your@email.com" className="h-11" value={resetEmail} onChange={e => setResetEmail(e.target.value)} />
            <Button type="submit" className="w-full h-11">Send Reset Link</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
