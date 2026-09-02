import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export function NetworkStatus() {
  const [online, setOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (online) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-[110] flex items-center justify-center gap-2 bg-amber-400 px-4 py-2 text-xs font-semibold text-black" role="status" aria-live="assertive">
      <WifiOff className="h-4 w-4" /> Offline — showing the latest available information. Actions will resume after reconnection.
    </div>
  );
}
