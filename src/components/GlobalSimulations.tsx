import React, { useEffect } from "react";
import { toast } from "sonner";
import { AlertTriangle, Ambulance, Car } from "lucide-react";

export function GlobalSimulations() {
  useEffect(() => {
    const alerts = [
      {
        title: "Emergency Vehicle Approaching",
        description: "Ambulance approaching ITO Crossing. Pre-empting North Phase to Green.",
        icon: <Ambulance className="w-5 h-5 text-red-500" />,
        border: "border-red-500"
      },
      {
        title: "Traffic Anomaly Detected",
        description: "Sudden 40% volume spike on Western Express Highway. Suggesting AI diversion.",
        icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
        border: "border-yellow-500"
      },
      {
        title: "VIP Dispatch Active",
        description: "Clearing corridor at Silk Board Junction for VIP convoy. Wait times +12m.",
        icon: <Car className="w-5 h-5 text-purple-500" />,
        border: "border-purple-500"
      }
    ];

    const interval = setInterval(() => {
      const alert = alerts[Math.floor(Math.random() * alerts.length)];
      toast.custom(() => (
        <div className={`flex items-start gap-4 p-4 bg-black border ${alert.border} rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] min-w-[320px]`}>
          <div className="mt-1 flex-shrink-0 animate-pulse">{alert.icon}</div>
          <div>
            <h4 className="font-bold text-white text-sm">{alert.title}</h4>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">{alert.description}</p>
          </div>
        </div>
      ), { duration: 6000 });
    }, 25000); // Shoot every 25s for cool demo

    // Initial alert for wow factor
    const initialAlert = window.setTimeout(() => {
      toast.custom(() => (
        <div className="flex items-start gap-4 p-4 bg-black border border-red-500 rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] min-w-[320px]">
          <div className="mt-1 flex-shrink-0 animate-pulse"><Ambulance className="w-5 h-5 text-red-500" /></div>
          <div>
            <h4 className="font-bold text-white text-sm">Emergency Pre-emption Active</h4>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">Ambulance detected on Saki Naka Junction. Forcing corridor green cycle.</p>
          </div>
        </div>
      ), { duration: 6000 });
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialAlert);
    };
  }, []);

  return null;
}
