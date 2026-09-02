import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Filter, 
  Clock, 
  Car, 
  Database, 
  Layers,
  Info
} from "lucide-react";
import { INTERSECTIONS, CORRIDORS } from "@/data/trafficData";

// Fix for default marker icons in Leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function HeatMap() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Mumbai");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-[600px] w-full bg-gray-100 dark:bg-neutral-900 animate-pulse rounded-[6px]" />;

  const cityCoords: Record<string, [number, number]> = {
    Mumbai: [19.0760, 72.8777],
    Delhi: [28.6139, 77.2090],
    Pune: [18.5204, 73.8567],
    Bengaluru: [12.9716, 77.5946],
    Hyderabad: [17.3850, 78.4867],
    Chennai: [13.0827, 80.2707],
    Kolkata: [22.5726, 88.3639],
  };

  return (
    <div className="space-y-6 relative h-[calc(100vh-200px)] min-h-[600px]">
      <div className="absolute top-4 left-4 z-[1000] flex flex-wrap gap-2 pointer-events-auto">
        <Card className="bg-[#fafaf8]/95 dark:bg-[#161616]/95 backdrop-blur-md shadow-lg p-2 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#f36458] ml-2" />
          <select 
            className="bg-transparent border-none text-sm font-bold focus:ring-0 cursor-pointer"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            {Object.keys(cityCoords).map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </Card>

        <Card className="bg-[#fafaf8]/95 dark:bg-[#161616]/95 backdrop-blur-md shadow-lg p-2 flex items-center gap-4 px-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-bold">14:30 (Peak)</span>
          </div>
          <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-bold">All Vehicles</span>
          </div>
          <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-bold">GPS + Probe</span>
          </div>
        </Card>
      </div>

      <div className="absolute bottom-8 left-4 z-[1000] pointer-events-auto">
        <Card className="bg-[#fafaf8]/95 dark:bg-[#161616]/95 backdrop-blur-md shadow-lg p-4">
          <h4 className="app-eyebrow mb-3">Congestion Legend</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-[10px] font-medium">Free Flow (&lt; 20%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-[10px] font-medium">Moderate (20-60%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-[10px] font-medium">Heavy (&gt; 60%)</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="w-full h-full rounded-[6px] overflow-hidden ring-1 ring-black/10 dark:ring-white/15 shadow-xl relative z-0">
        <MapContainer 
          center={cityCoords[selectedCity]} 
          zoom={13} 
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className="map-tiles"
          />
          
          {/* Fix map background color to match light tiles while loading */}
          <style>{`.leaflet-container { background: #f8fafc !important; }`}</style>

          {/* Intersections */}
          {INTERSECTIONS.filter(i => i.city === selectedCity).map(intersection => (
            <CircleMarker
              key={intersection.id}
              center={intersection.coordinates}
              radius={12}
              pathOptions={{
                fillColor: intersection.status === "heavy" ? "#ef4444" : intersection.status === "moderate" ? "#f97316" : "#22c55e",
                color: "white",
                weight: 2,
                fillOpacity: 0.8,
              }}
            >
              <Popup>
                <div className="p-2 space-y-2">
                  <h3 className="font-bold text-sm">{intersection.name}</h3>
                  <Badge variant={intersection.status === "heavy" ? "destructive" : "secondary"}>
                    {intersection.status.toUpperCase()}
                  </Badge>
                  <div className="text-xs space-y-1">
                    <p>Avg Speed: <strong>{intersection.avgSpeed} km/h</strong></p>
                    <p>Queue: <strong>{intersection.queueLength}m</strong></p>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* Corridors */}
          {CORRIDORS.filter(c => c.city === selectedCity).map(corridor => (
            <Polyline
              key={corridor.id}
              positions={corridor.coordinates}
              pathOptions={{
                color: corridor.congestionLevel > 80 ? "#ef4444" : corridor.congestionLevel > 50 ? "#f97316" : "#22c55e",
                weight: 8,
                opacity: 0.6,
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-sm">{corridor.name}</h3>
                  <p className="text-xs mt-1">Congestion: <strong>{corridor.congestionLevel}%</strong></p>
                  <p className="text-xs">Avg Delay: <strong>{corridor.avgDelay} min</strong></p>
                </div>
              </Popup>
            </Polyline>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
