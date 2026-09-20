import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import Card from "../components/ui/Card";
import Btn from "../components/ui/Btn";
import { adminAuthApi } from "../lib/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await adminAuthApi.login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1120] px-5">
      <Card className="w-full max-w-sm p-8" hover={false}>
        <div className="text-center mb-6">
          <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={20} className="text-white" />
          </span>
          <h1 className="font-display text-xl font-semibold text-slate-900 dark:text-white">APNAHUB Admin</h1>
          <p className="text-sm text-slate-400 mt-1">Sign in to manage the platform</p>
        </div>
        <form className="space-y-4" onSubmit={submit}>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@apnahub.in"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-sm outline-none focus:ring-2 ring-indigo-400 text-slate-700 dark:text-slate-200"
          />
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/15 bg-slate-50 dark:bg-white/5 text-sm outline-none focus:ring-2 ring-indigo-400 text-slate-700 dark:text-slate-200"
          />
          {error && <p className="text-xs text-rose-500">{error}</p>}
          <Btn variant="primary" className="w-full" type="submit">Sign in</Btn>
        </form>
        <p className="text-center text-xs text-slate-400 mt-6">
          Default demo credentials come from the backend's <code>.env</code> (<code>ADMIN_EMAIL</code> / <code>ADMIN_PASSWORD</code>).
        </p>
      </Card>
    </div>
  );
}
