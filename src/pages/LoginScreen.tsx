import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, ArrowUpRight, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/Logo";
import { api, type SessionUser } from "@/lib/api";

interface LoginScreenProps { onLogin: (user: SessionUser) => void }

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault(); setError(""); setLoading(true);
    try { const { user } = await api.login(email, password); onLogin(user); }
    catch (loginError) { setError(loginError instanceof Error ? loginError.message : "Unable to sign in"); setLoading(false); }
  };

  const fillDemo = () => { setEmail("admin@flowai.in"); setPassword("flowai123"); setError(""); };

  return (
    <main className="saniti-grid min-h-screen bg-[#0b0b0b] text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.15fr_.85fr]">
        <section className="flex flex-col justify-between border-b border-white/10 p-6 sm:p-10 lg:border-b-0 lg:border-r lg:p-14">
          <div className="flex items-center gap-3">
            <Logo className="h-11 w-11" />
            <div>
              <p className="font-semibold">FlowAI</p>
              <p className="saniti-eyebrow text-[9px] text-[#797979]">Traffic systems</p>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="my-20 max-w-3xl">
            <p className="saniti-eyebrow flex items-center gap-2 text-[#b9b9b9]"><span className="h-2.5 w-2.5 rounded-full bg-[#f36458]" /> Authorized city operations</p>
            <h1 className="saniti-display mt-7 text-[clamp(4rem,8vw,7.5rem)]">Control starts with context.</h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#b9b9b9]">One accountable workspace for forecasting traffic pressure, reviewing interventions, and coordinating safer urban movement.</p>
          </motion.div>

          <p className="saniti-eyebrow text-[#505b6c]">Bharat infrastructure AI · v2.0</p>
        </section>

        <section className="flex items-center justify-center bg-[#151515] p-6 sm:p-10">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
            <p className="saniti-eyebrow text-[#797979]">Secure access</p>
            <h2 className="mt-4 text-4xl font-normal tracking-[-0.04em]">Enter the control room.</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#b9b9b9]">Use your assigned operator account. Actions are attributed to your role and preserved in the audit trail.</p>

            <form onSubmit={handleLogin} className="mt-10 space-y-5">
              <div>
                <label htmlFor="email" className="saniti-eyebrow mb-2 block text-[#b9b9b9]">Email address</label>
                <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="operator@flowai.in" required autoComplete="email" className="h-12 w-full rounded-[3px] border border-white/15 bg-[#0b0b0b] px-4 text-white outline-none placeholder:text-[#505b6c] focus:border-[#f36458]" />
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="saniti-eyebrow text-[#b9b9b9]">Password</label>
                  <button type="button" onClick={fillDemo} className="text-xs text-[#b9b9b9] hover:text-white">Use demo account</button>
                </div>
                <div className="relative">
                  <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" required autoComplete="current-password" className="h-12 w-full rounded-[3px] border border-white/15 bg-[#0b0b0b] px-4 pr-12 text-white outline-none placeholder:text-[#505b6c] focus:border-[#f36458]" />
                  <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#797979] hover:text-white">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-xs text-[#ff8176]" role="alert"><AlertCircle className="h-4 w-4" />{error}</motion.p>}
              </AnimatePresence>

              <button type="submit" disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#f36458] px-6 font-medium text-[#0b0b0b] hover:bg-[#ff786d] disabled:opacity-50">
                {loading ? "Signing in…" : <>Sign in to FlowAI <ArrowUpRight className="h-4 w-4" /></>}
              </button>
            </form>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
