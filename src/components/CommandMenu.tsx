import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import { 
  Search, 
  Map, 
  Activity, 
  ShieldAlert, 
  X,
  Radio,
  CloudRain,
  Camera,
  FileSpreadsheet,
  Terminal,
  RefreshCw,
  Zap
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { api } from "@/lib/api";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [pendingCommand, setPendingCommand] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "Escape") {
        if (pendingCommand) setPendingCommand(null);
        else setOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [pendingCommand]);

  const runCommand = async (action: string) => {
    setIsExecuting(true);
    try {
      const { operation } = await api.runOperation(action, "City operations command center");
      const message = operation.status === "pending_approval" ? "SUBMITTED FOR ADMIN APPROVAL" : operation.executionMode === "controller" ? "EXECUTED BY CONTROLLER" : "APPROVED IN PLANNING MODE";
      toast.success(`${message}: ${action}`, { style: { background: 'black', border: '1px solid #3b82f6', color: 'white' } });
      setOpen(false);
      setPendingCommand(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Operation could not be submitted");
    } finally {
      setIsExecuting(false);
    }
  };

  const closeMenu = () => {
    setOpen(false);
    setPendingCommand(null);
  };

  return (
    <>
      {/* Floating Button Entry */}
      <button 
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/20 shadow-2xl p-4 rounded-full hover:scale-110 transition-transform flex items-center justify-center group"
        aria-label="Open command menu"
        aria-haspopup="dialog"
      >
        <Terminal className="w-5 h-5 text-black dark:text-white" />
        <span className="absolute bg-black text-white text-[10px] px-2 py-1 rounded right-14 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Ctrl/Cmd + K
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <div
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-black/60 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeMenu();
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl bg-neutral-900 border border-white/20 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label="City operations command menu"
            >
              <Command className="w-full text-white">
                <div className="flex items-center border-b border-white/10 px-4">
                  <Terminal className="w-5 h-5 text-gray-500 mr-3" />
                  <Command.Input 
                    placeholder="Type a command or search (e.g. 'Flash Red', 'Green Wave')..." 
                    className="w-full bg-transparent p-4 text-base outline-none placeholder:text-gray-500 text-white" 
                    autoFocus 
                  />
                  <button type="button" onClick={closeMenu} className="text-gray-500 hover:text-white p-2" aria-label="Close command menu">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {pendingCommand ? (
                  <div className="p-6 space-y-5" role="alertdialog" aria-labelledby="confirm-operation-title">
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400"><ShieldAlert className="w-5 h-5" /></div>
                      <div>
                        <h3 id="confirm-operation-title" className="font-bold text-white">Confirm city operation</h3>
                        <p className="mt-1 text-sm leading-relaxed text-gray-400">This action will be submitted under your account and written to the audit trail.</p>
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white">{pendingCommand}</div>
                    <div className="flex justify-end gap-3">
                      <button type="button" onClick={() => setPendingCommand(null)} disabled={isExecuting} className="rounded-lg px-4 py-2 text-sm text-gray-300 hover:bg-white/10">Cancel</button>
                      <button type="button" onClick={() => runCommand(pendingCommand)} disabled={isExecuting} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-black hover:bg-amber-400 disabled:opacity-50">
                        {isExecuting ? "Submitting…" : "Confirm operation"}
                      </button>
                    </div>
                  </div>
                ) : <Command.List className="max-h-[400px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-800">
                  <Command.Empty className="py-6 text-center text-sm text-gray-500">No operations found. Try "Reroute" or "View".</Command.Empty>
                  
                  <Command.Group heading="Urgent Overrides" className="text-xs text-gray-400 p-2 font-bold uppercase tracking-wider">
                    <Command.Item onSelect={() => setPendingCommand("Activate Green Wave for WEH Corridor")} className="px-3 py-3 mt-1 hover:bg-white/10 rounded-lg cursor-pointer flex items-center gap-3 text-sm text-white data-[selected='true']:bg-white/10 transition-colors">
                      <Zap className="w-4 h-4 text-green-400" /> Execute Dynamic "Green Wave" (WEH Mumbai)
                    </Command.Item>
                    <Command.Item onSelect={() => setPendingCommand("Lock Central Silk Board to Flash Red")} className="px-3 py-3 mt-1 hover:bg-white/10 rounded-lg cursor-pointer flex items-center gap-3 text-sm text-white data-[selected='true']:bg-white/10 transition-colors">
                      <ShieldAlert className="w-4 h-4 text-red-500" /> Flash Red / Intersection Lockdown (Silk Board)
                    </Command.Item>
                  </Command.Group>

                  <Command.Group heading="Traffic Enforcement & Routing" className="text-xs text-gray-400 p-2 font-bold uppercase tracking-wider">
                    <Command.Item onSelect={() => setPendingCommand("Reroute Freight Traffic off Eastern Freeway")} className="px-3 py-3 mt-1 hover:bg-white/10 rounded-lg cursor-pointer flex items-center gap-3 text-sm text-white data-[selected='true']:bg-white/10 transition-colors">
                      <Map className="w-4 h-4 text-blue-400" /> Divert Heavy Freight (Eastern Freeway, Mumbai)
                    </Command.Item>
                    <Command.Item onSelect={() => setPendingCommand("Engage Severe Weather Protocol (Monsoon)")} className="px-3 py-3 mt-1 hover:bg-white/10 rounded-lg cursor-pointer flex items-center gap-3 text-sm text-white data-[selected='true']:bg-white/10 transition-colors">
                      <CloudRain className="w-4 h-4 text-cyan-400" /> Engage Severe Monsoon Optimization Protocols
                    </Command.Item>
                    <Command.Item onSelect={() => setPendingCommand("Broadcast Emergency Alert to DMS Signs")} className="px-3 py-3 mt-1 hover:bg-white/10 rounded-lg cursor-pointer flex items-center gap-3 text-sm text-white data-[selected='true']:bg-white/10 transition-colors">
                      <Radio className="w-4 h-4 text-orange-400" /> Broadcast Accident Alert to Dynamic Message Signs
                    </Command.Item>
                  </Command.Group>

                  <Command.Group heading="Monitoring & Intel" className="text-xs text-gray-400 p-2 font-bold uppercase tracking-wider">
                    <Command.Item onSelect={() => setPendingCommand("Open CCTV Grid for Sector 4")} className="px-3 py-3 mt-1 hover:bg-white/10 rounded-lg cursor-pointer flex items-center gap-3 text-sm text-white data-[selected='true']:bg-white/10 transition-colors">
                      <Camera className="w-4 h-4 text-gray-300" /> View Live CCTV Camera Grid (Sector 4)
                    </Command.Item>
                    <Command.Item onSelect={() => setPendingCommand("Compile Daily Flow Report (PDF/Excel)")} className="px-3 py-3 mt-1 hover:bg-white/10 rounded-lg cursor-pointer flex items-center gap-3 text-sm text-white data-[selected='true']:bg-white/10 transition-colors">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export Carbon Efficiency & Flow Report
                    </Command.Item>
                  </Command.Group>

                  <Command.Group heading="System" className="text-xs text-gray-400 p-2 font-bold uppercase tracking-wider">
                    <Command.Item onSelect={() => setPendingCommand("Clear all pending alerts and buffers")} className="px-3 py-3 mt-1 hover:bg-white/10 rounded-lg cursor-pointer flex items-center gap-3 text-sm text-white data-[selected='true']:bg-white/10 transition-colors">
                      <RefreshCw className="w-4 h-4 text-gray-400" /> Clear Active Notification Buffers
                    </Command.Item>
                  </Command.Group>
                </Command.List>}
              </Command>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
