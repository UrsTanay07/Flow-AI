export interface Intersection {
  id: string;
  name: string;
  city: string;
  coordinates: [number, number];
  status: "free-flow" | "moderate" | "heavy";
  currentTiming: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  recommendedTiming: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  queueLength: number;
  avgSpeed: number;
}

export interface Corridor {
  id: string;
  name: string;
  city: string;
  coordinates: [number, number][];
  congestionLevel: number; // 0 to 100
  avgDelay: number; // in minutes
}

export const CITIES = [
  "Mumbai",
  "Delhi",
  "Pune",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
];

export const INTERSECTIONS: Intersection[] = [
  // MUMBAI (Real Congestion Hotspots)
  {
    id: "bom-1", name: "Saki Naka Junction", city: "Mumbai", coordinates: [19.1025, 72.8833],
    status: "heavy", currentTiming: { north: 90, south: 90, east: 60, west: 60 }, recommendedTiming: { north: 110, south: 110, east: 50, west: 50 }, queueLength: 650, avgSpeed: 14,
  },
  {
    id: "bom-2", name: "Kalanagar Junction", city: "Mumbai", coordinates: [19.0558, 72.8465],
    status: "heavy", currentTiming: { north: 120, south: 120, east: 100, west: 100 }, recommendedTiming: { north: 140, south: 150, east: 90, west: 80 }, queueLength: 820, avgSpeed: 12,
  },
  {
    id: "bom-3", name: "WEH - JVLR Junction", city: "Mumbai", coordinates: [19.1256, 72.8553],
    status: "heavy", currentTiming: { north: 150, south: 150, east: 90, west: 90 }, recommendedTiming: { north: 180, south: 170, east: 70, west: 60 }, queueLength: 1200, avgSpeed: 10,
  },
  {
    id: "bom-4", name: "Worli Naka", city: "Mumbai", coordinates: [18.9953, 72.8152],
    status: "moderate", currentTiming: { north: 75, south: 75, east: 60, west: 60 }, recommendedTiming: { north: 90, south: 80, east: 50, west: 50 }, queueLength: 450, avgSpeed: 18,
  },
  {
    id: "bom-5", name: "Mulund Toll Naka", city: "Mumbai", coordinates: [19.1764, 72.9555],
    status: "heavy", currentTiming: { north: 180, south: 180, east: 40, west: 40 }, recommendedTiming: { north: 220, south: 220, east: 30, west: 30 }, queueLength: 1500, avgSpeed: 8,
  },
  {
    id: "bom-6", name: "Dadar TT Circle", city: "Mumbai", coordinates: [19.0163, 72.8427],
    status: "moderate", currentTiming: { north: 90, south: 90, east: 80, west: 80 }, recommendedTiming: { north: 100, south: 100, east: 70, west: 70 }, queueLength: 350, avgSpeed: 21,
  },

  // DELHI
  {
    id: "del-1", name: "ITO Crossing", city: "Delhi", coordinates: [28.6293, 77.2407],
    status: "heavy", currentTiming: { north: 120, south: 120, east: 90, west: 90 }, recommendedTiming: { north: 150, south: 150, east: 70, west: 70 }, queueLength: 850, avgSpeed: 21,
  },
  {
    id: "del-2", name: "AIIMS Intersection", city: "Delhi", coordinates: [28.5677, 77.2089],
    status: "heavy", currentTiming: { north: 150, south: 140, east: 110, west: 100 }, recommendedTiming: { north: 160, south: 150, east: 90, west: 90 }, queueLength: 920, avgSpeed: 18,
  },
  {
    id: "del-3", name: "Dhaula Kuan", city: "Delhi", coordinates: [28.5873, 77.1611],
    status: "heavy", currentTiming: { north: 180, south: 180, east: 120, west: 120 }, recommendedTiming: { north: 200, south: 200, east: 100, west: 100 }, queueLength: 1100, avgSpeed: 16,
  },
  {
    id: "del-4", name: "Ashram Chowk", city: "Delhi", coordinates: [28.5721, 77.2562],
    status: "heavy", currentTiming: { north: 160, south: 160, east: 140, west: 140 }, recommendedTiming: { north: 210, south: 190, east: 110, west: 110 }, queueLength: 1400, avgSpeed: 11,
  },
  {
    id: "del-5", name: "Rao Tula Ram Marg", city: "Delhi", coordinates: [28.5658, 77.1592],
    status: "moderate", currentTiming: { north: 80, south: 80, east: 60, west: 60 }, recommendedTiming: { north: 90, south: 90, east: 50, west: 50 }, queueLength: 400, avgSpeed: 24,
  },

  // BENGALURU
  {
    id: "blr-1", name: "Central Silk Board", city: "Bengaluru", coordinates: [12.9172, 77.6228],
    status: "heavy", currentTiming: { north: 150, south: 150, east: 120, west: 120 }, recommendedTiming: { north: 200, south: 200, east: 100, west: 100 }, queueLength: 1500, avgSpeed: 11,
  },
  {
    id: "blr-2", name: "Tin Factory Junction", city: "Bengaluru", coordinates: [12.9961, 77.6698],
    status: "heavy", currentTiming: { north: 140, south: 140, east: 140, west: 140 }, recommendedTiming: { north: 180, south: 170, east: 120, west: 110 }, queueLength: 1350, avgSpeed: 12,
  },
  {
    id: "blr-3", name: "Sony World Signal", city: "Bengaluru", coordinates: [12.9408, 77.6258],
    status: "heavy", currentTiming: { north: 110, south: 110, east: 90, west: 90 }, recommendedTiming: { north: 130, south: 130, east: 80, west: 80 }, queueLength: 750, avgSpeed: 15,
  },
  {
    id: "blr-4", name: "Dairy Circle", city: "Bengaluru", coordinates: [12.9348, 77.5996],
    status: "moderate", currentTiming: { north: 90, south: 90, east: 70, west: 70 }, recommendedTiming: { north: 100, south: 110, east: 60, west: 50 }, queueLength: 550, avgSpeed: 19,
  },
  {
    id: "blr-5", name: "Madiwala Checkpost", city: "Bengaluru", coordinates: [12.9221, 77.6186],
    status: "heavy", currentTiming: { north: 130, south: 120, east: 80, west: 80 }, recommendedTiming: { north: 150, south: 150, east: 60, west: 60 }, queueLength: 900, avgSpeed: 14,
  },

  // PUNE
  {
    id: "pun-1", name: "Savitribai Phule Univ Circle", city: "Pune", coordinates: [18.5362, 73.8298],
    status: "heavy", currentTiming: { north: 60, south: 60, east: 45, west: 45 }, recommendedTiming: { north: 80, south: 80, east: 35, west: 35 }, queueLength: 500, avgSpeed: 17,
  },
  {
    id: "pun-2", name: "Swargate Junction", city: "Pune", coordinates: [18.5015, 73.8586],
    status: "heavy", currentTiming: { north: 100, south: 100, east: 80, west: 80 }, recommendedTiming: { north: 130, south: 120, east: 60, west: 60 }, queueLength: 680, avgSpeed: 16,
  },
  {
    id: "pun-3", name: "Nal Stop", city: "Pune", coordinates: [18.5085, 73.8279],
    status: "moderate", currentTiming: { north: 70, south: 70, east: 70, west: 70 }, recommendedTiming: { north: 90, south: 80, east: 50, west: 60 }, queueLength: 320, avgSpeed: 21,
  },
  {
    id: "pun-4", name: "Katraj Chowk", city: "Pune", coordinates: [18.4526, 73.8569],
    status: "heavy", currentTiming: { north: 110, south: 110, east: 60, west: 60 }, recommendedTiming: { north: 150, south: 140, east: 40, west: 50 }, queueLength: 810, avgSpeed: 15,
  },
  {
    id: "pun-5", name: "Chandni Chowk", city: "Pune", coordinates: [18.5034, 73.7667],
    status: "free-flow", currentTiming: { north: 40, south: 40, east: 40, west: 40 }, recommendedTiming: { north: 40, south: 40, east: 40, west: 40 }, queueLength: 120, avgSpeed: 38,
  },

  // HYDERABAD
  {
    id: "hyd-1", name: "Jubilee Hills Check Post", city: "Hyderabad", coordinates: [17.4328, 78.4116],
    status: "moderate", currentTiming: { north: 75, south: 75, east: 60, west: 60 }, recommendedTiming: { north: 90, south: 90, east: 50, west: 50 }, queueLength: 350, avgSpeed: 23,
  },
  {
    id: "hyd-2", name: "Cyber Towers Junction", city: "Hyderabad", coordinates: [17.4504, 78.3807],
    status: "heavy", currentTiming: { north: 130, south: 140, east: 100, west: 90 }, recommendedTiming: { north: 160, south: 160, east: 80, west: 70 }, queueLength: 950, avgSpeed: 16,
  },
  {
    id: "hyd-3", name: "Ameerpet Cross Roads", city: "Hyderabad", coordinates: [17.4357, 78.4444],
    status: "heavy", currentTiming: { north: 110, south: 110, east: 100, west: 100 }, recommendedTiming: { north: 140, south: 130, east: 80, west: 80 }, queueLength: 720, avgSpeed: 14,
  },
  {
    id: "hyd-4", name: "Mehdipatnam Rythu Bazar", city: "Hyderabad", coordinates: [17.3941, 78.4353],
    status: "heavy", currentTiming: { north: 90, south: 90, east: 70, west: 70 }, recommendedTiming: { north: 120, south: 120, east: 50, west: 50 }, queueLength: 640, avgSpeed: 17,
  },
  {
    id: "hyd-5", name: "Kukatpally Y Junction", city: "Hyderabad", coordinates: [17.4811, 78.4168],
    status: "moderate", currentTiming: { north: 85, south: 80, east: 60, west: 60 }, recommendedTiming: { north: 95, south: 90, east: 50, west: 50 }, queueLength: 420, avgSpeed: 21,
  },

  // CHENNAI
  {
    id: "chn-1", name: "Kathipara Junction", city: "Chennai", coordinates: [13.0089, 80.2033],
    status: "heavy", currentTiming: { north: 140, south: 140, east: 120, west: 120 }, recommendedTiming: { north: 180, south: 170, east: 100, west: 90 }, queueLength: 1050, avgSpeed: 15,
  },
  {
    id: "chn-2", name: "Tidel Park Signal", city: "Chennai", coordinates: [12.9897, 80.2458],
    status: "heavy", currentTiming: { north: 110, south: 110, east: 70, west: 70 }, recommendedTiming: { north: 140, south: 140, east: 50, west: 50 }, queueLength: 850, avgSpeed: 18,
  },
  {
    id: "chn-3", name: "Madhya Kailash", city: "Chennai", coordinates: [13.0076, 80.2404],
    status: "heavy", currentTiming: { north: 90, south: 90, east: 80, west: 80 }, recommendedTiming: { north: 120, south: 120, east: 60, west: 60 }, queueLength: 700, avgSpeed: 16,
  },
  {
    id: "chn-4", name: "Gemini Flyover (Anna Flyover)", city: "Chennai", coordinates: [13.0560, 80.2472],
    status: "moderate", currentTiming: { north: 75, south: 80, east: 60, west: 60 }, recommendedTiming: { north: 100, south: 100, east: 50, west: 50 }, queueLength: 450, avgSpeed: 22,
  },
  {
    id: "chn-5", name: "Nandanam Signal", city: "Chennai", coordinates: [13.0336, 80.2406],
    status: "moderate", currentTiming: { north: 60, south: 60, east: 60, west: 60 }, recommendedTiming: { north: 80, south: 80, east: 50, west: 50 }, queueLength: 300, avgSpeed: 25,
  },

  // KOLKATA
  {
    id: "kol-1", name: "Park Street Crossing", city: "Kolkata", coordinates: [22.5539, 88.3512],
    status: "heavy", currentTiming: { north: 100, south: 100, east: 80, west: 80 }, recommendedTiming: { north: 130, south: 130, east: 60, west: 60 }, queueLength: 700, avgSpeed: 14,
  },
  {
    id: "kol-2", name: "Ruby General Hospital Crossing", city: "Kolkata", coordinates: [22.5188, 88.4026],
    status: "heavy", currentTiming: { north: 120, south: 120, east: 90, west: 90 }, recommendedTiming: { north: 150, south: 140, east: 70, west: 70 }, queueLength: 850, avgSpeed: 16,
  },
  {
    id: "kol-3", name: "Ultadanga Crossing", city: "Kolkata", coordinates: [22.5937, 88.3972],
    status: "heavy", currentTiming: { north: 130, south: 120, east: 100, west: 100 }, recommendedTiming: { north: 160, south: 150, east: 80, west: 80 }, queueLength: 950, avgSpeed: 13,
  },
  {
    id: "kol-4", name: "Shyambazar Five-Point", city: "Kolkata", coordinates: [22.6015, 88.3742],
    status: "heavy", currentTiming: { north: 140, south: 140, east: 140, west: 140 }, recommendedTiming: { north: 170, south: 170, east: 110, west: 110 }, queueLength: 1100, avgSpeed: 10,
  },
  {
    id: "kol-5", name: "Gariahat Crossing", city: "Kolkata", coordinates: [22.5173, 88.3644],
    status: "moderate", currentTiming: { north: 80, south: 80, east: 70, west: 70 }, recommendedTiming: { north: 100, south: 100, east: 50, west: 50 }, queueLength: 480, avgSpeed: 19,
  },
  {
    id: "kol-6", name: "Chingrighata Crossing", city: "Kolkata", coordinates: [22.5714, 88.4116],
    status: "heavy", currentTiming: { north: 110, south: 110, east: 80, west: 80 }, recommendedTiming: { north: 140, south: 140, east: 60, west: 60 }, queueLength: 780, avgSpeed: 17,
  }
];

export const CORRIDORS: Corridor[] = [
  // Mumbai
  { id: "c-bom-1", name: "Western Express Highway", city: "Mumbai", coordinates: [[19.05, 72.85], [19.12, 72.855], [19.18, 72.86], [19.23, 72.865]], congestionLevel: 92, avgDelay: 28 },
  { id: "c-bom-2", name: "Eastern Express Highway", city: "Mumbai", coordinates: [[19.04, 72.86], [19.10, 72.93], [19.18, 72.96]], congestionLevel: 75, avgDelay: 22 },
  { id: "c-bom-3", name: "JVLR", city: "Mumbai", coordinates: [[19.125, 72.855], [19.12, 72.88], [19.115, 72.92]], congestionLevel: 88, avgDelay: 35 },
  // Delhi
  { id: "c-del-1", name: "Outer Ring Road (South)", city: "Delhi", coordinates: [[28.56, 77.16], [28.55, 77.20], [28.54, 77.25]], congestionLevel: 85, avgDelay: 25 },
  { id: "c-del-2", name: "Ring Road", city: "Delhi", coordinates: [[28.61, 77.15], [28.63, 77.18], [28.66, 77.17]], congestionLevel: 78, avgDelay: 32 },
  { id: "c-del-3", name: "NH-48 (Delhi-Gurugram)", city: "Delhi", coordinates: [[28.58, 77.16], [28.54, 77.10], [28.50, 77.05]], congestionLevel: 95, avgDelay: 42 },
  // Bengaluru
  { id: "c-blr-1", name: "Outer Ring Road (SE)", city: "Bengaluru", coordinates: [[12.91, 77.62], [12.93, 77.68], [12.98, 77.69]], congestionLevel: 94, avgDelay: 45 },
  { id: "c-blr-2", name: "Hosur Road", city: "Bengaluru", coordinates: [[12.91, 77.62], [12.88, 77.64], [12.84, 77.66]], congestionLevel: 86, avgDelay: 38 },
  { id: "c-blr-3", name: "Tumkur Road", city: "Bengaluru", coordinates: [[13.02, 77.53], [13.05, 77.51], [13.08, 77.49]], congestionLevel: 82, avgDelay: 26 },
  // Pune
  { id: "c-pun-1", name: "Ganeshkhind Road", city: "Pune", coordinates: [[18.53, 73.83], [18.52, 73.85], [18.51, 73.86]], congestionLevel: 88, avgDelay: 32 },
  { id: "c-pun-2", name: "Nagar Road", city: "Pune", coordinates: [[18.53, 73.88], [18.55, 73.91], [18.57, 73.95]], congestionLevel: 84, avgDelay: 28 },
  // Hyderabad
  { id: "c-hyd-1", name: "Inner Ring Road", city: "Hyderabad", coordinates: [[17.43, 78.44], [17.40, 78.46], [17.37, 78.44]], congestionLevel: 76, avgDelay: 20 },
  { id: "c-hyd-2", name: "IT Corridor (Hitech)", city: "Hyderabad", coordinates: [[17.45, 78.38], [17.43, 78.36], [17.41, 78.34]], congestionLevel: 91, avgDelay: 34 },
  // Chennai
  { id: "c-chn-1", name: "OMR (IT Expressway)", city: "Chennai", coordinates: [[13.00, 80.24], [12.95, 80.23], [12.89, 80.22]], congestionLevel: 89, avgDelay: 38 },
  { id: "c-chn-2", name: "Anna Salai (Mount Road)", city: "Chennai", coordinates: [[13.08, 80.27], [13.05, 80.24], [13.01, 80.21]], congestionLevel: 85, avgDelay: 30 },
  // Kolkata
  { id: "c-kol-1", name: "EM Bypass", city: "Kolkata", coordinates: [[22.59, 88.40], [22.54, 88.40], [22.49, 88.39]], congestionLevel: 88, avgDelay: 36 },
  { id: "c-kol-2", name: "AJC Bose Road", city: "Kolkata", coordinates: [[22.54, 88.34], [22.53, 88.36], [22.54, 88.38]], congestionLevel: 84, avgDelay: 28 }
];

export const REAL_TRAFFIC_STATS = {
  totalVehicles: 41200000, 
  avgSpeed: 17.6, 
  congestionIndex: 56.5, 
  delayReduction: 14.8, 
  historicalRecordsProcessed: 184502300,
  activeSensors: 42850
};

export const CONGESTION_BY_ZONE = [
  { zone: "North", level: 69 },
  { zone: "South", level: 88 },
  { zone: "East", level: 52 },
  { zone: "West", level: 84 },
  { zone: "Central", level: 96 },
];

export const DELAY_OVER_TIME = [
  { time: "00:00", delay: 5 },
  { time: "02:00", delay: 2 },
  { time: "04:00", delay: 3 },
  { time: "06:00", delay: 15 },
  { time: "07:00", delay: 40 },
  { time: "08:00", delay: 75 },
  { time: "09:00", delay: 95 },
  { time: "10:00", delay: 85 },
  { time: "11:00", delay: 60 },
  { time: "12:00", delay: 50 },
  { time: "13:00", delay: 55 },
  { time: "14:00", delay: 58 },
  { time: "15:00", delay: 65 },
  { time: "16:00", delay: 80 },
  { time: "17:00", delay: 110 },
  { time: "18:00", delay: 135 },
  { time: "19:00", delay: 120 },
  { time: "20:00", delay: 85 },
  { time: "21:00", delay: 55 },
  { time: "22:00", delay: 30 },
  { time: "23:00", delay: 15 }
];
