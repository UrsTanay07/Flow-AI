import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Database, Cpu, Network, CheckCircle2 } from "lucide-react";
import { REAL_TRAFFIC_STATS } from "@/data/trafficData";

export function AITrainingOverlay() {
  const [stage, setStage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [records, setRecords] = useState(0);

  useEffect(() => {
    // Has already trained?
    if (localStorage.getItem("ai_trained")) {
      setIsVisible(false);
      return;
    }

    const totalRecords = REAL_TRAFFIC_STATS.historicalRecordsProcessed;
    
    // Animate records counting up rapidly
    const recordInterval = setInterval(() => {
      setRecords(prev => {
        const next = prev + Math.floor(Math.random() * 5000000);
        return next > totalRecords ? totalRecords : next;
      });
    }, 50);

    // Timeline of training phases
    const timeline = [
      { delay: 0, stage: 0, prog: 0 }, 
      { delay: 800, stage: 1, prog: 25 },
      { delay: 1800, stage: 2, prog: 60 },
      { delay: 2800, stage: 3, prog: 90 },
      { delay: 3500, stage: 4, prog: 100 },
    ];

    timeline.forEach(t => {
      setTimeout(() => {
        setStage(t.stage);
        setProgress(t.prog);
      }, t.delay);
    });

    setTimeout(() => {
      clearInterval(recordInterval);
      setRecords(totalRecords);
    }, 3500);

    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem("ai_trained", "true");
    }, 4500);

  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md text-white font-mono"
      >
        <div className="max-w-xl w-full px-6 space-y-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Cpu className="w-12 h-12 text-blue-500 animate-pulse" />
            <h2 className="text-2xl font-bold tracking-widest uppercase">Initializing Core Model</h2>
            <p className="text-gray-400 text-sm">Applying massive real-world dataset to neural network...</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
            <motion.div 
              className="bg-blue-500 h-full relative"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeInOut", duration: 0.5 }}
            >
              <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-r from-transparent to-white/50 animate-[shimmer_1s_infinite]" />
            </motion.div>
          </div>

          {/* Status Matrix */}
          <div className="grid grid-cols-1 gap-4 text-xs">
            <div className={`flex items-center justify-between p-3 border rounded-xl transition-colors ${stage >= 1 ? "border-green-500/50 bg-green-500/10 text-green-400" : "border-neutral-800 text-gray-500"}`}>
              <div className="flex items-center gap-3">
                <Database className="w-4 h-4" />
                <span>Ingesting Telemetry Data</span>
              </div>
              <span>{stage >= 1 ? "COMPLETED" : "WAITING"}</span>
            </div>

            <div className={`flex items-center justify-between p-3 border rounded-xl transition-colors ${stage >= 2 ? "border-green-500/50 bg-green-500/10 text-green-400" : stage === 1 ? "border-blue-500/50 bg-blue-500/10 text-blue-400 animate-pulse" : "border-neutral-800 text-gray-500"}`}>
              <div className="flex items-center gap-3">
                <Network className="w-4 h-4" />
                <span>Processing Spatial Vectors</span>
              </div>
              <span>{stage >= 2 ? "COMPLETED" : stage === 1 ? "PROCESSING" : "WAITING"}</span>
            </div>

            <div className={`flex items-center justify-between p-3 border rounded-xl transition-colors ${stage >= 3 ? "border-green-500/50 bg-green-500/10 text-green-400" : stage === 2 ? "border-blue-500/50 bg-blue-500/10 text-blue-400 animate-pulse" : "border-neutral-800 text-gray-500"}`}>
              <div className="flex items-center gap-3">
                <Cpu className="w-4 h-4" />
                <span>Training Neural Parameters</span>
              </div>
              <span>{stage >= 3 ? "COMPLETED" : stage === 2 ? "TRAINING" : "WAITING"}</span>
            </div>
            
            <div className={`flex items-center justify-between p-3 border rounded-xl transition-colors ${stage >= 4 ? "border-green-500/50 bg-green-500/10 text-green-400 flex" : "hidden"}`}>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4" />
                <span>Model Converged</span>
              </div>
              <span className="font-bold">READY</span>
            </div>
          </div>

          <div className="text-center pt-8 border-t border-white/10">
            <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] mb-2">Historical Records Processed</p>
            <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              {records.toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
