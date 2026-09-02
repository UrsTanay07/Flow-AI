import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Settings2, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  ArrowRight,
  RefreshCw,
  Cpu,
  MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { INTERSECTIONS, Intersection } from "@/data/trafficData";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function Optimizer() {
  const [selectedIntersection, setSelectedIntersection] = useState<Intersection>(INTERSECTIONS[0]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [queueTrend, setQueueTrend] = useState([40, 65, 50, 80, 55, 90, 75, 60, 45, 70]);
  const phases = ["north", "east", "south", "west"] as const;

  // Auto-cycle every 60 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePhaseIndex((prev) => (prev + 1) % phases.length);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Live Queue length simulation
  useEffect(() => {
    const queueSim = setInterval(() => {
      setQueueTrend(prev => {
        const newTrend = [...prev.slice(1)];
        const lastValue = prev[prev.length - 1];
        // Fluctuate organically +/- 20 points
        let nextValue = lastValue + (Math.random() * 40 - 20);
        // Clamp between 10% and 95%
        nextValue = Math.max(10, Math.min(95, nextValue));
        newTrend.push(nextValue);
        return newTrend;
      });
    }, 2500); // Shift every 2.5 seconds for visual impact

    return () => clearInterval(queueSim);
  }, []);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      await api.runOperation("Apply recommended signal plan", `${selectedIntersection.name}, ${selectedIntersection.city}`);
      toast.success("Signal plan accepted and recorded in the operations audit log.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Signal plan could not be applied");
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="app-page">
      <div className="flex flex-col gap-6">
        <div className="app-header">
          <div>
            <p className="app-eyebrow">Adaptive control</p>
            <h1 className="app-title">Signal Optimizer</h1>
            <p className="app-subtitle">AI-driven adaptive signal timing recommendations.</p>
          </div>
        </div>
        
        {/* Route/Intersection Selection */}
        <div className="space-y-3">
          <p className="app-eyebrow flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Select Route / Intersection
          </p>
          <div className="flex overflow-x-auto pb-2 gap-3 hide-scrollbar">
            {INTERSECTIONS.map(i => (
              <Button 
                key={i.id} 
                variant={selectedIntersection?.id === i.id ? "default" : "outline"}
                onClick={() => setSelectedIntersection(i)}
                className="whitespace-nowrap rounded-full transition-all"
              >
                {i.name} ({i.city})
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Selection & Current State */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIntersection.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold">{selectedIntersection.name}</CardTitle>
                    <CardDescription>{selectedIntersection.city} — Current Status: 
                      <Badge variant={selectedIntersection.status === "heavy" ? "destructive" : "secondary"} className="ml-2">
                        {selectedIntersection.status.toUpperCase()}
                      </Badge>
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase font-bold">Avg Speed</p>
                    <p className="text-2xl font-bold">{selectedIntersection.avgSpeed} km/h</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Timing Table */}
                    <div className="space-y-4">
                      <h3 className="font-bold flex items-center gap-2">
                        <Settings2 className="w-4 h-4" /> Current Timing Plan
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Phase</TableHead>
                            <TableHead>Green (s)</TableHead>
                            <TableHead>Yellow (s)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(selectedIntersection.currentTiming).map(([phase, time], idx) => (
                            <TableRow key={phase} className={idx === activePhaseIndex ? "bg-green-50 dark:bg-green-900/10" : ""}>
                              <TableCell className="capitalize font-medium flex items-center gap-2">
                                {idx === activePhaseIndex && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
                                {phase}
                              </TableCell>
                              <TableCell className={idx === activePhaseIndex ? "font-bold text-green-600" : ""}>{time}</TableCell>
                              <TableCell>4</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Phase Diagram */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold flex items-center gap-2">
                          <RefreshCw className="w-4 h-4" /> Phase Diagram
                        </h3>
                        <Badge variant="outline" className="text-[10px] animate-pulse">Auto-Cycle 60s</Badge>
                      </div>
                      <div className="relative w-full aspect-square bg-gray-50 dark:bg-neutral-900/50 rounded-2xl flex items-center justify-center border border-dashed border-gray-300 dark:border-white/20">
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                          <div className="w-1 h-full bg-gray-200 dark:bg-neutral-800" />
                          <div className="h-1 w-full bg-gray-200 dark:bg-neutral-800 absolute" />
                        </div>
                        <div className="relative z-10 grid grid-cols-2 gap-12">
                          {phases.map((dir, idx) => (
                            <button 
                              key={dir} 
                              onClick={() => setActivePhaseIndex(idx)}
                              className="flex flex-col items-center gap-2 group cursor-pointer p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                            >
                              <div className={`w-8 h-8 rounded-full transition-colors duration-500 border-2 border-white dark:border-black group-hover:scale-110 ${idx === activePhaseIndex ? "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]" : "bg-red-500"}`} />
                              <span className={`text-xs font-bold uppercase transition-colors ${idx === activePhaseIndex ? "text-green-600 dark:text-green-400" : "text-gray-500 group-hover:text-black dark:group-hover:text-white"}`}>{dir}</span>
                            </button>
                          ))}
                        </div>
                        <div className="absolute bottom-4 right-4 text-[10px] text-gray-400 font-mono">
                          LIVE_PHASE_SIM_V2.4
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="border-green-200 dark:border-green-900/30 bg-green-50/30 dark:bg-green-900/10">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-green-700 dark:text-green-400 flex items-center gap-2">
                      <Cpu className="w-5 h-5" /> AI Recommended Optimization
                    </CardTitle>
                    <CardDescription>Generated based on real-time probe data from last 15 minutes.</CardDescription>
                  </div>
                  <Button 
                    onClick={handleOptimize} 
                    disabled={isOptimizing}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isOptimizing ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                    Apply Plan
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(Object.entries(selectedIntersection.recommendedTiming) as [string, number][]).map(([phase, time]) => (
                      <div key={phase} className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-green-100 dark:border-green-900/50 shadow-sm">
                        <p className="text-xs text-gray-500 uppercase font-bold">{phase}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">{time}s</span>
                          <span className={`text-xs font-bold ${time > (selectedIntersection.currentTiming as Record<string, number>)[phase] ? "text-green-500" : "text-red-500"}`}>
                            {time > (selectedIntersection.currentTiming as Record<string, number>)[phase] ? "+" : ""}{time - (selectedIntersection.currentTiming as Record<string, number>)[phase]}s
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Column: AI Explain & Insights */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Info className="w-4 h-4 text-[#f36458]" /> AI Reasoning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                The current congestion at <span className="font-bold text-black dark:text-white">{selectedIntersection?.name}</span> is primarily caused by a surge in North-South movement following a transit delay on the parallel corridor.
              </p>
              <p>
                Our model recommends adjusting the green time allocations to clear the {selectedIntersection?.queueLength}m queue before the next peak cycle.
              </p>
              <div className="p-3 rounded-[5px] bg-[#f36458]/8 border border-[#f36458]/25 text-[#b63f37] dark:text-[#ff9a91] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="text-xs">
                  Applying this plan is estimated to reduce wait times by <span className="font-bold">4.2 minutes</span> per vehicle.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Queue Length Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 flex items-end gap-1 px-2">
                {queueTrend.map((h, i) => (
                  <div key={i} className="flex-1 bg-gray-100 dark:bg-neutral-900 rounded-t-sm relative group overflow-hidden">
                    <motion.div 
                      key={`${selectedIntersection.id}-bar-${i}`}
                      initial={{ height: `${h}%` }}
                      animate={{ height: `${h}%` }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
                      className={`absolute bottom-0 w-full rounded-t-sm ${h > 75 ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-[#f36458]"}`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-3 text-[10px] text-gray-400 font-bold uppercase">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f36458]" /> STABLE</span>
                <span className="flex items-center gap-1 animate-pulse text-red-500">LIVE <span className="w-2 h-2 rounded-full bg-red-500" /></span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
