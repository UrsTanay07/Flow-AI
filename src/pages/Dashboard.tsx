import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Zap, 
  Clock, 
  TrendingDown, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CloudRain,
  Wind,
  Sun,
  Activity,
  Database,
  RefreshCw
} from "lucide-react";
import { REAL_TRAFFIC_STATS, CONGESTION_BY_ZONE, DELAY_OVER_TIME } from "@/data/trafficData";
import { api, type Prediction, type TrafficSnapshot } from "@/lib/api";

const COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6"];

export default function Dashboard() {
  const [predictiveTime, setPredictiveTime] = useState<number>(14);
  const [weatherMode, setWeatherMode] = useState<"clear" | "rain" | "smog">("clear");
  const [traffic, setTraffic] = useState<TrafficSnapshot | null>(null);
  const [streamConnected, setStreamConnected] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  useEffect(() => {
    let active = true;
    const refresh = () => api.traffic().then((snapshot) => active && setTraffic(snapshot)).catch(() => undefined);
    refresh();
    const closeStream = api.trafficStream((snapshot) => active && setTraffic(snapshot), (connected) => active && setStreamConnected(connected));
    const fallbackTimer = window.setInterval(refresh, 60_000);
    return () => { active = false; closeStream(); window.clearInterval(fallbackTimer); };
  }, []);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(() => {
      api.prediction(predictiveTime, weatherMode).then((result) => active && setPrediction(result)).catch(() => undefined);
    }, 250);
    return () => { active = false; window.clearTimeout(timer); };
  }, [predictiveTime, weatherMode]);

  const refreshTraffic = async () => {
    setIsRefreshing(true);
    try {
      setTraffic(await api.traffic());
    } finally {
      setIsRefreshing(false);
    }
  };

  const snapshotAgeMinutes = traffic ? Math.max(0, Math.floor((Date.now() - new Date(traffic.generatedAt).getTime()) / 60_000)) : null;
  const isStale = snapshotAgeMinutes !== null && snapshotAgeMinutes >= 5;

  // Physics & AI Prediction Factors
  const isPeak = predictiveTime >= 8 && predictiveTime <= 10 || predictiveTime >= 17 && predictiveTime <= 19;
  const isNight = predictiveTime < 6 || predictiveTime > 22;
  
  const timeFactor = isPeak ? 1.5 : isNight ? 0.3 : 1.0;
  const weatherFactor = weatherMode === "rain" ? 1.4 : weatherMode === "smog" ? 1.15 : 1.0;
  const totalMultiplier = timeFactor * weatherFactor;

  // Reactively calculate dynamic stats
  const dynamicStats = {
    totalVehicles: Math.round((traffic?.stats.totalVehicles ?? REAL_TRAFFIC_STATS.totalVehicles) * (timeFactor * 0.8)),
    avgSpeed: prediction?.forecast.avgSpeed ?? Math.max(5, Math.round((traffic?.stats.avgSpeed ?? REAL_TRAFFIC_STATS.avgSpeed) / totalMultiplier)),
    congestionIndex: prediction?.forecast.congestionIndex ?? Math.min(99, Math.round((traffic?.stats.congestionIndex ?? REAL_TRAFFIC_STATS.congestionIndex) * totalMultiplier)),
    delayReduction: weatherMode === "rain" ? 3.5 : weatherMode === "smog" ? 7.2 : (traffic?.stats.delayReduction ?? REAL_TRAFFIC_STATS.delayReduction),
  };

  // Adjust charts based on factors
  const dynamicCongestionData = (traffic?.congestionByZone ?? CONGESTION_BY_ZONE).map(c => ({
    ...c,
    level: Math.min(100, Math.round(c.level * totalMultiplier)),
  }));

  const dynamicStatusData = [
    { name: "Free Flow", value: Math.max(5, 30 / totalMultiplier) },
    { name: "Moderate", value: 45 },
    { name: "Heavy", value: Math.min(80, 25 * totalMultiplier) },
  ];

  return (
    <div className="app-page">
      <div className="app-header">
        <div>
          <p className="app-eyebrow">Network intelligence</p>
          <h1 className="app-title">Live Dashboard</h1>
          <p className="app-subtitle">Real-time traffic metrics across major Indian metros.</p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`px-3 py-1 ${isStale ? "border-amber-500 text-amber-600" : traffic?.source === "live" ? "border-green-500 text-green-600" : "border-blue-500 text-blue-600"}`}
            >
              <Database className="w-3 h-3 mr-1.5" />
              {isStale ? "Data stale" : streamConnected ? "Live stream" : traffic?.source === "live" ? "Live provider" : "Demo data"}
            </Badge>
            <Button variant="ghost" size="icon" onClick={refreshTraffic} disabled={isRefreshing} aria-label="Refresh traffic data">
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
          <span className="text-xs text-gray-400" aria-live="polite">
            {traffic ? `${traffic.sourceLabel} · updated ${snapshotAgeMinutes === 0 ? "just now" : `${snapshotAgeMinutes}m ago`}` : "Connecting to traffic service…"}
          </span>
        </div>
      </div>

      {/* AI Sandbox Control Center */}
      <Card className="border-[#f36458]/30 bg-[#f36458]/5 dark:bg-[#f36458]/[0.06]">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold flex items-center justify-between">
            <span className="flex items-center gap-2"><Activity className="w-5 h-5 text-[#f36458]" /> AI Predictive Sandbox</span>
            <span className="text-[#f36458] font-mono text-xl">{predictiveTime}:00 HRS</span>
          </CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-2">
            Scrub time forward to see server-calculated predicted delays, or simulate severe weather.
            {prediction && <Badge variant="outline">{prediction.confidence}% confidence · {prediction.inputSource} input</Badge>}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Future Scrubber */}
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold text-gray-500">
                <span>00:00</span>
                <span className="text-[#f36458]">PEAK: 09:00</span>
                <span>12:00</span>
                <span className="text-red-500">PEAK: 18:00</span>
                <span>24:00</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="24" 
                value={predictiveTime}
                onChange={(e) => setPredictiveTime(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#f36458] transition-all"
              />
            </div>
            
            {/* Environment Toggles */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Environmental Physics</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Button 
                  variant={weatherMode === "clear" ? "default" : "outline"}
                  onClick={() => setWeatherMode("clear")}
                  className={`flex-1 transition-all ${weatherMode === "clear" ? "bg-amber-500 hover:bg-amber-600 text-white border-none shadow-[0_0_15px_rgba(245,158,11,0.4)]" : ""}`}
                >
                  <Sun className="w-4 h-4 mr-2" /> Clear
                </Button>
                <Button 
                  variant={weatherMode === "rain" ? "default" : "outline"}
                  onClick={() => setWeatherMode("rain")}
                  className={`flex-1 transition-all ${weatherMode === "rain" ? "bg-blue-600 hover:bg-blue-700 text-white border-none shadow-[0_0_15px_rgba(37,99,235,0.4)]" : ""}`}
                >
                  <CloudRain className="w-4 h-4 mr-2" /> Monsoon
                </Button>
                <Button 
                  variant={weatherMode === "smog" ? "default" : "outline"}
                  onClick={() => setWeatherMode("smog")}
                  className={`flex-1 transition-all ${weatherMode === "smog" ? "bg-gray-600 hover:bg-gray-700 text-white border-none shadow-[0_0_15px_rgba(75,85,99,0.4)]" : ""}`}
                >
                  <Wind className="w-4 h-4 mr-2" /> High AQI
                </Button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {weatherMode !== "clear" && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`text-sm p-3 rounded-lg border flex items-start gap-3 mt-4 ${weatherMode === "rain" ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300" : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"}`}
              >
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">{weatherMode === "rain" ? "Heavy Monsoon Detected:" : "Severe AQI Warning:"}</span> 
                  {weatherMode === "rain" 
                    ? " Visibility is low and roads are slick. Predicting a 40% reduction in average speed globally. Routing protocols shifted to major highways."
                    : " Air Quality Index is critically low. Rerouting heavy freight vehicles away from residential corridors to mitigate localized smog."}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: "Predicted Fleet Volume", 
            value: dynamicStats.totalVehicles.toLocaleString(), 
            icon: Users, 
            trend: isPeak ? "+18%" : "-5%", 
            trendUp: isPeak,
            color: "text-blue-500"
          },
          { 
            title: "Projected Avg Speed", 
            value: `${dynamicStats.avgSpeed} km/h`, 
            icon: Zap, 
            trend: dynamicStats.avgSpeed < 15 ? "-12.5%" : "+4.1%", 
            trendUp: dynamicStats.avgSpeed > 15,
            color: dynamicStats.avgSpeed < 12 ? "text-red-500" : "text-yellow-500"
          },
          { 
            title: "Simulated Congestion", 
            value: `${dynamicStats.congestionIndex}%`, 
            icon: AlertTriangle, 
            trend: isPeak || weatherMode !== "clear" ? "+24%" : "-1.4%", 
            trendUp: !(isPeak || weatherMode !== "clear"),
            color: dynamicStats.congestionIndex > 70 ? "text-red-500 animate-pulse" : "text-orange-500"
          },
          { 
            title: "AI Delay Reduction", 
            value: `${dynamicStats.delayReduction}%`, 
            icon: TrendingDown, 
            trend: "+0.8%", 
            trendUp: true,
            color: "text-green-500"
          },
        ].map((stat, i) => (
          <motion.div
            key={`${i}-${predictiveTime}-${weatherMode}`}
            initial={{ opacity: 0.5, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`transition-all duration-300 hover:-translate-y-0.5 ${stat.title === "Simulated Congestion" && dynamicStats.congestionIndex > 85 ? "border-red-500 dark:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]" : ""}`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className={`p-2 rounded-lg bg-gray-50 dark:bg-neutral-900 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div className={`flex items-center text-xs font-medium ${stat.trendUp ? "text-green-500" : "text-red-500"}`}>
                    {stat.trendUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {stat.trend}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Congestion by Zone */}
        <Card className="relative overflow-hidden">
          {dynamicStats.congestionIndex > 80 && (
             <div className="absolute top-0 right-0 p-2">
               <Badge variant="destructive" className="animate-pulse">CRITICAL ZONES</Badge>
             </div>
          )}
          <CardHeader>
            <CardTitle className="text-lg font-bold">Predicted Congestion by Zone</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dynamicCongestionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="zone" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Bar dataKey="level" radius={[4, 4, 0, 0]} animationDuration={500}>
                  {dynamicCongestionData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.level > 80 ? "#ef4444" : entry.level > 50 ? "#f97316" : "#22c55e"} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">Status Distribution Shift</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dynamicStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={500}
                >
                  <Cell fill="#22c55e" />
                  <Cell fill="#f97316" />
                  <Cell fill="#ef4444" />
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 text-xs font-medium mt-4">
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500" /> Free</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-orange-500" /> Moderate</div>
              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500" /> Heavy</div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
