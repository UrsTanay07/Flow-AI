/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sun, 
  Moon,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

import { Toaster } from "sonner";
import { CommandMenu } from "./components/CommandMenu";
import { NetworkStatus } from "./components/NetworkStatus";
import { api, type SessionUser } from "./lib/api";

const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Optimizer = lazy(() => import("./pages/Optimizer"));
const Advisories = lazy(() => import("./pages/Advisories"));
const HeatMap = lazy(() => import("./pages/HeatMap"));
const Performance = lazy(() => import("./pages/Performance"));
const LoginScreen = lazy(() => import("./pages/LoginScreen"));

type Page = "home" | "dashboard" | "optimizer" | "advisories" | "map" | "history";

const PAGE_IDS: Page[] = ["home", "dashboard", "optimizer", "advisories", "map", "history"];

const isPage = (value: string): value is Page => PAGE_IDS.includes(value as Page);

const PageLoading = () => (
  <div className="min-h-[50vh] grid place-items-center" role="status" aria-live="polite">
    <div className="flex items-center gap-3 text-sm font-medium text-gray-500 dark:text-gray-400">
      <span className="h-2.5 w-2.5 rounded-full bg-[#f36458] animate-pulse" aria-hidden="true" />
      Loading city operations…
    </div>
  </div>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const hash = window.location.hash.replace("#", "");
    return isPage(hash) ? hash : "home";
  });

  const [user, setUser] = useState<SessionUser | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = (userData: SessionUser) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    await api.logout().catch(() => undefined);
    setUser(null);
  };

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5_000);
    api.session(controller.signal)
      .then(({ user: sessionUser }) => setUser(sessionUser))
      .catch(() => setUser(null))
      .finally(() => {
        window.clearTimeout(timeout);
        setSessionChecked(true);
      });
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (isPage(hash) && hash !== currentPage) {
        setCurrentPage(hash);
      } else if (hash && !isPage(hash)) {
        window.location.hash = "home";
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [currentPage]);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("isDarkMode");
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("isDarkMode", JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "dashboard", label: "Live Dashboard" },
    { id: "optimizer", label: "Signal Optimizer" },
    { id: "advisories", label: "Reroute Advisories" },
    { id: "map", label: "Heat Map" },
    { id: "history", label: "Performance" },
  ];

  const activeNavIndex = PAGE_IDS.indexOf(currentPage);

  if (!sessionChecked) {
    return (
      <div className="min-h-screen bg-[#030712] grid place-items-center text-white" role="status" aria-live="polite">
        <div className="flex items-center gap-3 text-sm text-gray-300">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f36458] animate-pulse" aria-hidden="true" />
          Connecting to FlowAI…
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#030712]" />}>
        <LoginScreen onLogin={handleLogin} />
      </Suspense>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#ededed] text-gray-900 dark:bg-[#0b0b0b] dark:text-gray-100 transition-colors duration-300 relative">
      <a href="#main-content" className="sr-only fixed left-4 top-4 z-[100] rounded-[5px] bg-[#f36458] px-4 py-2 text-sm font-semibold text-[#0b0b0b] focus:not-sr-only">
        Skip to content
      </a>
      
      
      {/* Navigation */}
      <div className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#0b0b0b]/95 backdrop-blur-md border-b border-black/10 dark:border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Brand */}
          <button
            type="button"
            className="flex items-center gap-2 rounded-[6px] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f36458]"
            onClick={() => navigate("home")}
            aria-label="Go to FlowAI home"
          >
            <Logo className="w-10 h-10" />
            <div className="flex flex-col leading-none">
              <span className="text-lg font-bold tracking-tight">FlowAI</span>
              <span className="saniti-eyebrow text-[9px] text-gray-500 dark:text-[#797979]">Traffic systems</span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-1" aria-label="Primary navigation">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(PAGE_IDS[index])}
                aria-current={activeNavIndex === index ? "page" : undefined}
                className={`rounded-full px-3 py-2 text-xs font-medium transition-colors ${activeNavIndex === index ? "bg-black text-white dark:bg-white dark:text-black" : "text-gray-500 hover:text-black dark:text-[#b9b9b9] dark:hover:text-white"}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold leading-none">{user.name}</p>
                <p className="text-[10px] text-gray-500 leading-none mt-0.5">{user.roleLabel}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-[5px] text-xs font-semibold border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors"
              >
                Logout
              </button>
            </div>
            <button type="button" onClick={() => navigate("optimizer")} className="hidden sm:inline-flex h-9 items-center rounded-full bg-[#f36458] px-4 text-xs font-semibold text-[#0b0b0b] hover:bg-[#ff786d]">
              City control
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full md:hidden"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              id="mobile-navigation"
              aria-label="Primary navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-gray-200/60 dark:border-white/10"
            >
              <div className="max-w-[1440px] mx-auto px-4 py-3 grid gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(item.id as Page)}
                    aria-current={currentPage === item.id ? "page" : undefined}
                    className={`w-full rounded-[5px] px-4 py-3 text-left text-sm font-medium transition-colors ${
                      currentPage === item.id
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "hover:bg-black/5 dark:hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="sm:hidden w-full rounded-[5px] px-4 py-3 text-left text-sm font-medium text-red-500 hover:bg-red-500/10"
                >
                  Log out
                </button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content */}
      <main id="main-content" className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Suspense fallback={<PageLoading />}>
              {currentPage === "home" && <Home onNavigate={navigate} />}
              {currentPage === "dashboard" && <Dashboard />}
              {currentPage === "optimizer" && <Optimizer />}
              {currentPage === "advisories" && <Advisories />}
              {currentPage === "map" && <HeatMap />}
              {currentPage === "history" && <Performance />}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Advanced UI Interactions */}
      <Toaster position="bottom-right" theme="dark" richColors expand={true} />
      <CommandMenu />
      <NetworkStatus />

      {/* Footer */}
      <footer className="relative z-10 mx-auto flex max-w-[1440px] flex-col gap-4 border-t border-black/10 px-6 py-12 text-sm text-gray-500 dark:border-white/10 dark:text-[#797979] sm:flex-row sm:items-center sm:justify-between">
        <p>FlowAI Traffic — accountable urban mobility intelligence.</p>
        <p className="saniti-eyebrow">Built for Bharat</p>
      </footer>
    </div>
    </>
  );
}
