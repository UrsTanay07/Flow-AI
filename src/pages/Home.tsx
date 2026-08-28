import React from "react";
import { motion } from "motion/react";
import { Activity, ArrowUpRight, CircleGauge, Navigation, ShieldCheck, Sparkles } from "lucide-react";

interface HomeProps {
  onNavigate: (page: "home" | "dashboard" | "optimizer" | "advisories" | "map" | "history") => void;
}

const capabilities = [
  { index: "01", title: "Adaptive signals", body: "Generate timing plans from live flow, demand patterns, and operational constraints.", icon: CircleGauge },
  { index: "02", title: "Network intelligence", body: "Turn city-wide movement into clear congestion forecasts with confidence scores.", icon: Activity },
  { index: "03", title: "Controlled execution", body: "Route every intervention through authenticated approvals, audit history, and rollback.", icon: ShieldCheck },
];

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className="-mx-4 -my-6 sm:-mx-6 sm:-my-8 bg-[#0b0b0b] text-white">
      <section className="saniti-grid min-h-[calc(100vh-65px)] border-b border-white/10 px-5 py-14 sm:px-10 sm:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-20">
          <div className="flex items-center justify-between">
            <p className="saniti-eyebrow flex items-center gap-2 text-[#b9b9b9]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#f36458]" />
              Live mobility intelligence
            </p>
            <p className="saniti-eyebrow hidden text-[#797979] sm:block">India · Urban systems</p>
          </div>

          <div className="max-w-[1240px]">
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="saniti-display text-[clamp(4rem,10vw,8.8rem)] font-normal"
            >
              Movement becomes
              <span className="block text-[#b9b9b9]">city intelligence.</span>
            </motion.h1>
          </div>

          <div className="grid gap-10 border-t border-white/15 pt-8 lg:grid-cols-[1fr_1.25fr] lg:items-end">
            <div className="saniti-eyebrow text-[#797979]">FlowAI Traffic · Operations platform</div>
            <div>
              <p className="max-w-2xl text-lg leading-relaxed text-[#b9b9b9] sm:text-xl">
                Coordinate signals, predict pressure, and approve network interventions from one accountable control surface—using infrastructure cities already have.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => onNavigate("dashboard")}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#f36458] px-6 font-medium text-[#0b0b0b] hover:bg-[#ff786d]"
                >
                  Open live operations <ArrowUpRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate("map")}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-[#212121] px-6 font-medium text-white hover:bg-[#2b2b2b]"
                >
                  Explore network map <Navigation className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="saniti-eyebrow text-[#797979]">A clearer control layer</p>
              <h2 className="saniti-display mt-5 max-w-xl text-5xl sm:text-6xl lg:text-7xl">Operate the network with context.</h2>
            </div>
            <div className="flex items-end">
              <p className="max-w-xl text-lg leading-relaxed text-[#b9b9b9]">Designed for traffic engineers who need fast answers without losing operational discipline. Every recommendation shows its source, status, and path to action.</p>
            </div>
          </div>

          <div className="mt-16 grid border-l border-t border-white/10 md:grid-cols-3">
            {capabilities.map((item) => (
              <article key={item.index} className="min-h-72 border-b border-r border-white/10 bg-[#151515] p-7 transition-colors hover:bg-[#212121] sm:p-9">
                <div className="flex items-center justify-between">
                  <span className="saniti-eyebrow text-[#797979]">{item.index}</span>
                  <item.icon className="h-5 w-5 text-[#f36458]" />
                </div>
                <h3 className="mt-20 text-2xl font-normal tracking-tight">{item.title}</h3>
                <p className="mt-4 leading-relaxed text-[#b9b9b9]">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#ededed] px-5 py-20 text-[#0b0b0b] sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <p className="saniti-eyebrow flex items-center gap-2 text-[#505b6c]"><Sparkles className="h-3.5 w-3.5" /> Decision support, not a black box</p>
            <h2 className="saniti-display mt-6 text-5xl sm:text-7xl">Forecast. Review. Act. Roll back.</h2>
          </div>
          <div className="flex flex-col justify-end">
            <p className="text-lg leading-relaxed text-[#353535]">Live and demonstration inputs are labelled. High-impact commands require authorization. Controller execution is never implied when a physical endpoint is not connected.</p>
            <button type="button" onClick={() => onNavigate("history")} className="mt-8 inline-flex h-12 w-fit items-center gap-2 rounded-full bg-[#0b0b0b] px-6 font-medium text-white hover:bg-[#212121]">
              View accountability trail <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
