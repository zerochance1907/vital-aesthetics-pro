import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function PhysicianLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ licenseId: "", email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.licenseId && form.email && form.password) {
      toast.success("Physician access granted");
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 pt-20 animate-fade-in">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-primary">
            <Plus className="h-7 w-7" />
          </div>
          <h1 className="font-display text-3xl font-medium text-foreground">Physician Portal</h1>
          <p className="mt-2 text-muted-foreground font-body font-light">Sign in with your medical credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border border-t-[3px] border-t-primary bg-card p-6 shadow-sm">
          <div className="space-y-2">
            <Label className="font-body font-light">Medical License ID</Label>
            <Input
              required
              placeholder="e.g. MD-123456"
              className="h-11 focus:border-primary focus:ring-primary"
              value={form.licenseId}
              onChange={e => setForm({ ...form, licenseId: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="font-body font-light">Email</Label>
            <Input
              type="email"
              required
              className="h-11 focus:border-primary focus:ring-primary"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="font-body font-light">Password</Label>
            <Input
              type="password"
              required
              className="h-11 focus:border-primary focus:ring-primary"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full h-11" size="lg">SIGN IN AS PHYSICIAN</Button>
        </form>

        <p className="text-center text-sm text-muted-foreground font-body font-light">
          <Link to="/login" className="font-body font-medium text-primary hover:underline">← Back to Patient Login</Link>
        </p>
      </div>
    </div>
  );
}
