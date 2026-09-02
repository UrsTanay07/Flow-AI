import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Navigation, 
  Clock, 
  MapPin, 
  ArrowRight, 
  ChevronRight, 
  AlertTriangle,
  CheckCircle2,
  X,
  Filter,
  TrendingDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface Advisory {
  id: string;
  route: string;
  city: string;
  status: "active" | "resolved" | "pending";
  impact: "high" | "medium" | "low";
  timeSaved: number;
  description: string;
  beforeDelay: number;
  afterDelay: number;
}

const ADVISORIES: Advisory[] = [
  // MUMBAI
  {
    id: "adv-1",
    route: "Worli to BKC via Sea Link",
    city: "Mumbai",
    status: "active",
    impact: "high",
    timeSaved: 12,
    description: "Reroute traffic via Senapati Bapat Marg to avoid bottleneck at Worli Naka.",
    beforeDelay: 35,
    afterDelay: 23,
  },
  {
    id: "adv-2",
    route: "Andheri East to Powai",
    city: "Mumbai",
    status: "active",
    impact: "high",
    timeSaved: 18,
    description: "Divert light vehicles through MIDC to bypass JVLR severe congestion.",
    beforeDelay: 45,
    afterDelay: 27,
  },
  {
    id: "adv-3",
    route: "Dadar to CST",
    city: "Mumbai",
    status: "pending",
    impact: "medium",
    timeSaved: 8,
    description: "Shift 20% flow to Eastern Freeway due to Parel TT infrastructure work.",
    beforeDelay: 30,
    afterDelay: 22,
  },
  {
    id: "adv-4",
    route: "Goregaon to Malad",
    city: "Mumbai",
    status: "resolved",
    impact: "low",
    timeSaved: 5,
    description: "Traffic stabilized. Re-routing via back road cancelled.",
    beforeDelay: 15,
    afterDelay: 10,
  },
  
  // BENGALURU
  {
    id: "adv-5",
    route: "Silk Board to Marathahalli",
    city: "Bengaluru",
    status: "active",
    impact: "high",
    timeSaved: 18,
    description: "Divert light vehicles through HSR Layout internal roads to bypass ORR congestion.",
    beforeDelay: 55,
    afterDelay: 37,
  },
  {
    id: "adv-6",
    route: "Whitefield to Indiranagar",
    city: "Bengaluru",
    status: "active",
    impact: "high",
    timeSaved: 22,
    description: "Maximize green light duration at Kundalahalli gate by 12 seconds.",
    beforeDelay: 60,
    afterDelay: 38,
  },
  {
    id: "adv-7",
    route: "Koramangala to Electronic City",
    city: "Bengaluru",
    status: "pending",
    impact: "medium",
    timeSaved: 15,
    description: "Suggesting elevated tollway for heavy volume from Madiwala.",
    beforeDelay: 40,
    afterDelay: 25,
  },
  {
    id: "adv-8",
    route: "Majestic to Malleshwaram",
    city: "Bengaluru",
    status: "resolved",
    impact: "low",
    timeSaved: 6,
    description: "Bus terminal overflow cleared. Standard timing resumed at Anand Rao Circle.",
    beforeDelay: 22,
    afterDelay: 16,
  },
  
  // DELHI
  {
    id: "adv-9",
    route: "Cyber City to IGI Airport",
    city: "Delhi",
    status: "resolved",
    impact: "medium",
    timeSaved: 8,
    description: "Optimization of signals at NH-48 entry points completed.",
    beforeDelay: 25,
    afterDelay: 17,
  },
  {
    id: "adv-10",
    route: "Noida Sec 18 to Connaught Place",
    city: "Delhi",
    status: "active",
    impact: "high",
    timeSaved: 14,
    description: "DND flyway overwhelmed. Diverting to Barapullah elevated road.",
    beforeDelay: 45,
    afterDelay: 31,
  },
  {
    id: "adv-11",
    route: "Lajpat Nagar to Hauz Khas",
    city: "Delhi",
    status: "active",
    impact: "medium",
    timeSaved: 9,
    description: "Ring road choke point. Adapting signal cycle at South Ext.",
    beforeDelay: 28,
    afterDelay: 19,
  },
  {
    id: "adv-12",
    route: "Dwarka to Gurugram",
    city: "Delhi",
    status: "pending",
    impact: "medium",
    timeSaved: 11,
    description: "Predictive routing activated via Dwarka Expressway avoiding Kapashera.",
    beforeDelay: 32,
    afterDelay: 21,
  },

  // HYDERABAD
  {
    id: "adv-13",
    route: "Hitech City to Gachibowli",
    city: "Hyderabad",
    status: "active",
    impact: "medium",
    timeSaved: 6,
    description: "Adjusting signal cycles at Mindspace junction to favor airport-bound traffic.",
    beforeDelay: 20,
    afterDelay: 14,
  },
  {
    id: "adv-14",
    route: "Secunderabad to Ameerpet",
    city: "Hyderabad",
    status: "active",
    impact: "high",
    timeSaved: 14,
    description: "Begumpet flyover gridlock. Re-routing via lower tank bund.",
    beforeDelay: 38,
    afterDelay: 24,
  },
  {
    id: "adv-15",
    route: "Banjara Hills to Mehdipatnam",
    city: "Hyderabad",
    status: "resolved",
    impact: "low",
    timeSaved: 4,
    description: "Left-free transition optimized. Flow is moving steadily.",
    beforeDelay: 18,
    afterDelay: 14,
  },

  // PUNE
  {
    id: "adv-16",
    route: "Hinjewadi to Shivaji Nagar",
    city: "Pune",
    status: "active",
    impact: "high",
    timeSaved: 20,
    description: "University circle massive delays. Rerouting via Pashan road.",
    beforeDelay: 50,
    afterDelay: 30,
  },
  {
    id: "adv-17",
    route: "Kothrud to Deccan",
    city: "Pune",
    status: "pending",
    impact: "medium",
    timeSaved: 7,
    description: "Karve Road metro construction blocking lane. Adapting parallel residential streets.",
    beforeDelay: 25,
    afterDelay: 18,
  },
  {
    id: "adv-18",
    route: "Viman Nagar to Kharadi",
    city: "Pune",
    status: "resolved",
    impact: "low",
    timeSaved: 5,
    description: "Airport road congestion eased. Smart signals returning to default.",
    beforeDelay: 20,
    afterDelay: 15,
  },

  // CHENNAI
  {
    id: "adv-19",
    route: "OMR to Tidel Park",
    city: "Chennai",
    status: "active",
    impact: "high",
    timeSaved: 16,
    description: "Major IT corridor block. Opening counter-flow lane at SRP Tools junction.",
    beforeDelay: 42,
    afterDelay: 26,
  },
  {
    id: "adv-20",
    route: "Guindy to Velachery",
    city: "Chennai",
    status: "active",
    impact: "medium",
    timeSaved: 9,
    description: "Kathipara grade separator saturated. Dynamic signals at check-post active.",
    beforeDelay: 28,
    afterDelay: 19,
  },
  {
    id: "adv-21",
    route: "Jessore Road (Gate 3)",
    city: "Kolkata",
    status: "resolved",
    impact: "low",
    timeSaved: 8,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 57,
    afterDelay: 49,
  },
  {
    id: "adv-22",
    route: "East Coast Road (ECR) (Underpass)",
    city: "Chennai",
    status: "pending",
    impact: "low",
    timeSaved: 20,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 53,
    afterDelay: 33,
  },
  {
    id: "adv-23",
    route: "JVLR to Powai (Gate 5)",
    city: "Mumbai",
    status: "active",
    impact: "high",
    timeSaved: 11,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 31,
    afterDelay: 20,
  },
  {
    id: "adv-24",
    route: "SCLR Junction (Sector 13)",
    city: "Mumbai",
    status: "pending",
    impact: "low",
    timeSaved: 16,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 39,
    afterDelay: 23,
  },
  {
    id: "adv-25",
    route: "Nagar Road (Gate 2)",
    city: "Pune",
    status: "resolved",
    impact: "medium",
    timeSaved: 22,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 58,
    afterDelay: 36,
  },
  {
    id: "adv-26",
    route: "Inner Ring Road (Phase 3)",
    city: "Chennai",
    status: "pending",
    impact: "low",
    timeSaved: 14,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 55,
    afterDelay: 41,
  },
  {
    id: "adv-27",
    route: "Marine Drive (Phase 2)",
    city: "Mumbai",
    status: "resolved",
    impact: "low",
    timeSaved: 8,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 39,
    afterDelay: 31,
  },
  {
    id: "adv-28",
    route: "PVNR Expressway (Gate 5)",
    city: "Hyderabad",
    status: "pending",
    impact: "low",
    timeSaved: 16,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 55,
    afterDelay: 39,
  },
  {
    id: "adv-29",
    route: "S V Road (Phase 2)",
    city: "Mumbai",
    status: "active",
    impact: "low",
    timeSaved: 11,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 22,
    afterDelay: 11,
  },
  {
    id: "adv-30",
    route: "Marine Drive (Underpass)",
    city: "Mumbai",
    status: "active",
    impact: "medium",
    timeSaved: 5,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 58,
    afterDelay: 53,
  },
  {
    id: "adv-31",
    route: "VIP Road (Gate 2)",
    city: "Kolkata",
    status: "active",
    impact: "low",
    timeSaved: 19,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 41,
    afterDelay: 22,
  },
  {
    id: "adv-32",
    route: "GST Road (Phase 3)",
    city: "Chennai",
    status: "active",
    impact: "low",
    timeSaved: 11,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 53,
    afterDelay: 42,
  },
  {
    id: "adv-33",
    route: "NH-44 (Link)",
    city: "Hyderabad",
    status: "pending",
    impact: "high",
    timeSaved: 15,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 31,
    afterDelay: 16,
  },
  {
    id: "adv-34",
    route: "Bannerghatta Road (Gate 3)",
    city: "Bengaluru",
    status: "pending",
    impact: "low",
    timeSaved: 21,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 46,
    afterDelay: 25,
  },
  {
    id: "adv-35",
    route: "Inner Ring Road (Junction)",
    city: "Chennai",
    status: "active",
    impact: "medium",
    timeSaved: 22,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 35,
    afterDelay: 13,
  },
  {
    id: "adv-36",
    route: "OMR IT Corridor (Sector 13)",
    city: "Chennai",
    status: "pending",
    impact: "medium",
    timeSaved: 5,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 41,
    afterDelay: 36,
  },
  {
    id: "adv-37",
    route: "VIP Road (Junction)",
    city: "Kolkata",
    status: "pending",
    impact: "medium",
    timeSaved: 7,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 58,
    afterDelay: 51,
  },
  {
    id: "adv-38",
    route: "Mount Road (Sector 10)",
    city: "Chennai",
    status: "active",
    impact: "medium",
    timeSaved: 7,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 56,
    afterDelay: 49,
  },
  {
    id: "adv-39",
    route: "NH-44 (Junction)",
    city: "Hyderabad",
    status: "resolved",
    impact: "low",
    timeSaved: 17,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 26,
    afterDelay: 9,
  },
  {
    id: "adv-40",
    route: "Old Bombay Highway (Phase 1)",
    city: "Hyderabad",
    status: "resolved",
    impact: "medium",
    timeSaved: 6,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 43,
    afterDelay: 37,
  },
  {
    id: "adv-41",
    route: "VIP Road (Junction)",
    city: "Kolkata",
    status: "resolved",
    impact: "medium",
    timeSaved: 8,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 32,
    afterDelay: 24,
  },
  {
    id: "adv-42",
    route: "Old Madras Road (Link)",
    city: "Bengaluru",
    status: "pending",
    impact: "medium",
    timeSaved: 21,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 25,
    afterDelay: 4,
  },
  {
    id: "adv-43",
    route: "Park Street (Link)",
    city: "Kolkata",
    status: "active",
    impact: "medium",
    timeSaved: 15,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 54,
    afterDelay: 39,
  },
  {
    id: "adv-44",
    route: "Sea Link Ramp (Underpass)",
    city: "Mumbai",
    status: "resolved",
    impact: "medium",
    timeSaved: 7,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 34,
    afterDelay: 27,
  },
  {
    id: "adv-45",
    route: "Hinjewadi Phase 1 (Gate 3)",
    city: "Pune",
    status: "active",
    impact: "low",
    timeSaved: 12,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 32,
    afterDelay: 20,
  },
  {
    id: "adv-46",
    route: "Kazi Nazrul Islam Sarani (Phase 2)",
    city: "Kolkata",
    status: "active",
    impact: "high",
    timeSaved: 17,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 44,
    afterDelay: 27,
  },
  {
    id: "adv-47",
    route: "JVLR to Powai (Phase 2)",
    city: "Mumbai",
    status: "active",
    impact: "low",
    timeSaved: 7,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 46,
    afterDelay: 39,
  },
  {
    id: "adv-48",
    route: "Red Road (Phase 2)",
    city: "Kolkata",
    status: "pending",
    impact: "high",
    timeSaved: 13,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 49,
    afterDelay: 36,
  },
  {
    id: "adv-49",
    route: "Ghodbunder Road (Gate 1)",
    city: "Mumbai",
    status: "active",
    impact: "medium",
    timeSaved: 8,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 38,
    afterDelay: 30,
  },
  {
    id: "adv-50",
    route: "EM Bypass (Link)",
    city: "Kolkata",
    status: "pending",
    impact: "high",
    timeSaved: 21,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 34,
    afterDelay: 13,
  },
  {
    id: "adv-51",
    route: "NH-48 Bypass (Link)",
    city: "Delhi",
    status: "pending",
    impact: "low",
    timeSaved: 24,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 44,
    afterDelay: 20,
  },
  {
    id: "adv-52",
    route: "Vikas Marg (Phase 2)",
    city: "Delhi",
    status: "resolved",
    impact: "low",
    timeSaved: 10,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 54,
    afterDelay: 44,
  },
  {
    id: "adv-53",
    route: "Ghodbunder Road (Link)",
    city: "Mumbai",
    status: "resolved",
    impact: "low",
    timeSaved: 19,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 37,
    afterDelay: 18,
  },
  {
    id: "adv-54",
    route: "Mount Road (Underpass)",
    city: "Chennai",
    status: "pending",
    impact: "high",
    timeSaved: 15,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 46,
    afterDelay: 31,
  },
  {
    id: "adv-55",
    route: "Katraj Bypass (Sector 11)",
    city: "Pune",
    status: "pending",
    impact: "low",
    timeSaved: 17,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 49,
    afterDelay: 32,
  },
  {
    id: "adv-56",
    route: "Velachery Bypass (Gate 3)",
    city: "Chennai",
    status: "pending",
    impact: "low",
    timeSaved: 7,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 42,
    afterDelay: 35,
  },
  {
    id: "adv-57",
    route: "Kazi Nazrul Islam Sarani (Junction)",
    city: "Kolkata",
    status: "active",
    impact: "high",
    timeSaved: 8,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 25,
    afterDelay: 17,
  },
  {
    id: "adv-58",
    route: "Hitex Road (Sector 14)",
    city: "Hyderabad",
    status: "resolved",
    impact: "high",
    timeSaved: 22,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 29,
    afterDelay: 7,
  },
  {
    id: "adv-59",
    route: "NH-48 Bypass (Phase 1)",
    city: "Delhi",
    status: "resolved",
    impact: "high",
    timeSaved: 23,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 50,
    afterDelay: 27,
  },
  {
    id: "adv-60",
    route: "Tank Bund Road (Junction)",
    city: "Hyderabad",
    status: "pending",
    impact: "high",
    timeSaved: 15,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 37,
    afterDelay: 22,
  },
  {
    id: "adv-61",
    route: "Hitex Road (Underpass)",
    city: "Hyderabad",
    status: "resolved",
    impact: "low",
    timeSaved: 17,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 29,
    afterDelay: 12,
  },
  {
    id: "adv-62",
    route: "Wakad Link Road (Sector 10)",
    city: "Pune",
    status: "resolved",
    impact: "high",
    timeSaved: 24,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 26,
    afterDelay: 2,
  },
  {
    id: "adv-63",
    route: "Tank Bund Road (Phase 2)",
    city: "Hyderabad",
    status: "pending",
    impact: "medium",
    timeSaved: 21,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 58,
    afterDelay: 37,
  },
  {
    id: "adv-64",
    route: "Old Madras Road (Phase 2)",
    city: "Bengaluru",
    status: "active",
    impact: "low",
    timeSaved: 10,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 37,
    afterDelay: 27,
  },
  {
    id: "adv-65",
    route: "Barapullah Elevated (Phase 3)",
    city: "Delhi",
    status: "pending",
    impact: "medium",
    timeSaved: 24,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 24,
    afterDelay: 0,
  },
  {
    id: "adv-66",
    route: "Hitex Road (Phase 1)",
    city: "Hyderabad",
    status: "pending",
    impact: "high",
    timeSaved: 20,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 26,
    afterDelay: 6,
  },
  {
    id: "adv-67",
    route: "Red Road (Link)",
    city: "Kolkata",
    status: "active",
    impact: "medium",
    timeSaved: 7,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 40,
    afterDelay: 33,
  },
  {
    id: "adv-68",
    route: "Baner Road (Phase 3)",
    city: "Pune",
    status: "active",
    impact: "medium",
    timeSaved: 20,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 24,
    afterDelay: 4,
  },
  {
    id: "adv-69",
    route: "OMR IT Corridor (Underpass)",
    city: "Chennai",
    status: "active",
    impact: "high",
    timeSaved: 21,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 31,
    afterDelay: 10,
  },
  {
    id: "adv-70",
    route: "Jessore Road (Gate 2)",
    city: "Kolkata",
    status: "active",
    impact: "high",
    timeSaved: 19,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 45,
    afterDelay: 26,
  },
  {
    id: "adv-71",
    route: "OMR IT Corridor (Link)",
    city: "Chennai",
    status: "pending",
    impact: "high",
    timeSaved: 19,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 27,
    afterDelay: 8,
  },
  {
    id: "adv-72",
    route: "SCLR Junction (Sector 11)",
    city: "Mumbai",
    status: "resolved",
    impact: "low",
    timeSaved: 10,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 37,
    afterDelay: 27,
  },
  {
    id: "adv-73",
    route: "Baner Road (Junction)",
    city: "Pune",
    status: "resolved",
    impact: "high",
    timeSaved: 24,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 38,
    afterDelay: 14,
  },
  {
    id: "adv-74",
    route: "Tank Bund Road (Phase 3)",
    city: "Hyderabad",
    status: "pending",
    impact: "medium",
    timeSaved: 22,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 41,
    afterDelay: 19,
  },
  {
    id: "adv-75",
    route: "NH-9 (Link)",
    city: "Delhi",
    status: "resolved",
    impact: "low",
    timeSaved: 13,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 58,
    afterDelay: 45,
  },
  {
    id: "adv-76",
    route: "LBS Marg to Kurla (Phase 1)",
    city: "Mumbai",
    status: "active",
    impact: "medium",
    timeSaved: 12,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 45,
    afterDelay: 33,
  },
  {
    id: "adv-77",
    route: "Thane-Belapur Road (Link)",
    city: "Mumbai",
    status: "resolved",
    impact: "medium",
    timeSaved: 15,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 51,
    afterDelay: 36,
  },
  {
    id: "adv-78",
    route: "Mathura Road (Underpass)",
    city: "Delhi",
    status: "resolved",
    impact: "medium",
    timeSaved: 21,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 24,
    afterDelay: 3,
  },
  {
    id: "adv-79",
    route: "Katraj Bypass (Underpass)",
    city: "Pune",
    status: "active",
    impact: "high",
    timeSaved: 13,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 43,
    afterDelay: 30,
  },
  {
    id: "adv-80",
    route: "Silk Board Junction (Link)",
    city: "Bengaluru",
    status: "active",
    impact: "low",
    timeSaved: 20,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 26,
    afterDelay: 6,
  },
  {
    id: "adv-81",
    route: "AJC Bose Road Flyover (Junction)",
    city: "Kolkata",
    status: "active",
    impact: "high",
    timeSaved: 9,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 48,
    afterDelay: 39,
  },
  {
    id: "adv-82",
    route: "Kazi Nazrul Islam Sarani (Underpass)",
    city: "Kolkata",
    status: "pending",
    impact: "high",
    timeSaved: 10,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 42,
    afterDelay: 32,
  },
  {
    id: "adv-83",
    route: "Marine Drive (Underpass)",
    city: "Mumbai",
    status: "resolved",
    impact: "high",
    timeSaved: 12,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 32,
    afterDelay: 20,
  },
  {
    id: "adv-84",
    route: "SCLR Junction (Phase 1)",
    city: "Mumbai",
    status: "active",
    impact: "medium",
    timeSaved: 24,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 55,
    afterDelay: 31,
  },
  {
    id: "adv-85",
    route: "Baner Road (Junction)",
    city: "Pune",
    status: "active",
    impact: "high",
    timeSaved: 18,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 53,
    afterDelay: 35,
  },
  {
    id: "adv-86",
    route: "Katraj Bypass (Gate 4)",
    city: "Pune",
    status: "active",
    impact: "high",
    timeSaved: 10,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 34,
    afterDelay: 24,
  },
  {
    id: "adv-87",
    route: "NH-9 (Underpass)",
    city: "Delhi",
    status: "resolved",
    impact: "medium",
    timeSaved: 23,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 40,
    afterDelay: 17,
  },
  {
    id: "adv-88",
    route: "Jubilee Hills Checkpost (Underpass)",
    city: "Hyderabad",
    status: "resolved",
    impact: "low",
    timeSaved: 23,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 47,
    afterDelay: 24,
  },
  {
    id: "adv-89",
    route: "Nagar Road (Junction)",
    city: "Pune",
    status: "resolved",
    impact: "high",
    timeSaved: 7,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 28,
    afterDelay: 21,
  },
  {
    id: "adv-90",
    route: "Ring Road Hub (Phase 3)",
    city: "Delhi",
    status: "active",
    impact: "low",
    timeSaved: 20,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 50,
    afterDelay: 30,
  },
  {
    id: "adv-91",
    route: "NH-9 (Junction)",
    city: "Delhi",
    status: "resolved",
    impact: "low",
    timeSaved: 17,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 38,
    afterDelay: 21,
  },
  {
    id: "adv-92",
    route: "Vidyasagar Setu (Underpass)",
    city: "Kolkata",
    status: "resolved",
    impact: "low",
    timeSaved: 6,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 55,
    afterDelay: 49,
  },
  {
    id: "adv-93",
    route: "Diamond Harbour Road (Underpass)",
    city: "Kolkata",
    status: "active",
    impact: "high",
    timeSaved: 13,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 49,
    afterDelay: 36,
  },
  {
    id: "adv-94",
    route: "Bellary Road (Sector 11)",
    city: "Bengaluru",
    status: "resolved",
    impact: "low",
    timeSaved: 14,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 45,
    afterDelay: 31,
  },
  {
    id: "adv-95",
    route: "Old Madras Road (Sector 16)",
    city: "Bengaluru",
    status: "resolved",
    impact: "high",
    timeSaved: 24,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 20,
    afterDelay: -4,
  },
  {
    id: "adv-96",
    route: "LB Road (Underpass)",
    city: "Chennai",
    status: "resolved",
    impact: "medium",
    timeSaved: 22,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 48,
    afterDelay: 26,
  },
  {
    id: "adv-97",
    route: "Hinjewadi Phase 1 (Underpass)",
    city: "Pune",
    status: "pending",
    impact: "low",
    timeSaved: 6,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 56,
    afterDelay: 50,
  },
  {
    id: "adv-98",
    route: "Baner Road (Sector 7)",
    city: "Pune",
    status: "active",
    impact: "medium",
    timeSaved: 16,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 39,
    afterDelay: 23,
  },
  {
    id: "adv-99",
    route: "Katraj Bypass (Link)",
    city: "Pune",
    status: "resolved",
    impact: "low",
    timeSaved: 21,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 54,
    afterDelay: 33,
  },
  {
    id: "adv-100",
    route: "Old Bombay Highway (Underpass)",
    city: "Hyderabad",
    status: "active",
    impact: "medium",
    timeSaved: 16,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 36,
    afterDelay: 20,
  },
  {
    id: "adv-101",
    route: "VIP Road (Phase 1)",
    city: "Kolkata",
    status: "pending",
    impact: "high",
    timeSaved: 10,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 56,
    afterDelay: 46,
  },
  {
    id: "adv-102",
    route: "Mathura Road (Phase 1)",
    city: "Delhi",
    status: "active",
    impact: "low",
    timeSaved: 20,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 23,
    afterDelay: 3,
  },
  {
    id: "adv-103",
    route: "Karve Road (Junction)",
    city: "Pune",
    status: "resolved",
    impact: "high",
    timeSaved: 15,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 20,
    afterDelay: 5,
  },
  {
    id: "adv-104",
    route: "LBS Marg to Kurla (Underpass)",
    city: "Mumbai",
    status: "active",
    impact: "high",
    timeSaved: 23,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 42,
    afterDelay: 19,
  },
  {
    id: "adv-105",
    route: "OMR IT Corridor (Sector 20)",
    city: "Chennai",
    status: "active",
    impact: "high",
    timeSaved: 10,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 47,
    afterDelay: 37,
  },
  {
    id: "adv-106",
    route: "Thane-Belapur Road (Sector 4)",
    city: "Mumbai",
    status: "resolved",
    impact: "medium",
    timeSaved: 10,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 56,
    afterDelay: 46,
  },
  {
    id: "adv-107",
    route: "Poonamallee High Road (Link)",
    city: "Chennai",
    status: "resolved",
    impact: "low",
    timeSaved: 8,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 41,
    afterDelay: 33,
  },
  {
    id: "adv-108",
    route: "OMR IT Corridor (Phase 3)",
    city: "Chennai",
    status: "resolved",
    impact: "high",
    timeSaved: 18,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 43,
    afterDelay: 25,
  },
  {
    id: "adv-109",
    route: "GST Road (Gate 5)",
    city: "Chennai",
    status: "active",
    impact: "medium",
    timeSaved: 20,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 45,
    afterDelay: 25,
  },
  {
    id: "adv-110",
    route: "Marine Drive (Link)",
    city: "Mumbai",
    status: "pending",
    impact: "high",
    timeSaved: 5,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 42,
    afterDelay: 37,
  },
  {
    id: "adv-111",
    route: "Hosur Road (Underpass)",
    city: "Bengaluru",
    status: "active",
    impact: "high",
    timeSaved: 9,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 45,
    afterDelay: 36,
  },
  {
    id: "adv-112",
    route: "Hitex Road (Underpass)",
    city: "Hyderabad",
    status: "resolved",
    impact: "low",
    timeSaved: 24,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 31,
    afterDelay: 7,
  },
  {
    id: "adv-113",
    route: "Banjara Hills Rd No. 12 (Phase 1)",
    city: "Hyderabad",
    status: "active",
    impact: "low",
    timeSaved: 22,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 21,
    afterDelay: -1,
  },
  {
    id: "adv-114",
    route: "Outer Ring Road (ORR) (Link)",
    city: "Bengaluru",
    status: "resolved",
    impact: "medium",
    timeSaved: 7,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 25,
    afterDelay: 18,
  },
  {
    id: "adv-115",
    route: "Howrah Bridge Approach (Phase 2)",
    city: "Kolkata",
    status: "resolved",
    impact: "high",
    timeSaved: 18,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 31,
    afterDelay: 13,
  },
  {
    id: "adv-116",
    route: "Inner Ring Road (Junction)",
    city: "Chennai",
    status: "active",
    impact: "medium",
    timeSaved: 13,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 42,
    afterDelay: 29,
  },
  {
    id: "adv-117",
    route: "Silk Board Junction (Phase 2)",
    city: "Bengaluru",
    status: "active",
    impact: "high",
    timeSaved: 21,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 45,
    afterDelay: 24,
  },
  {
    id: "adv-118",
    route: "Velachery Bypass (Underpass)",
    city: "Chennai",
    status: "active",
    impact: "low",
    timeSaved: 12,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 30,
    afterDelay: 18,
  },
  {
    id: "adv-119",
    route: "Western Express Highway (Sector 19)",
    city: "Mumbai",
    status: "resolved",
    impact: "medium",
    timeSaved: 22,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 57,
    afterDelay: 35,
  },
  {
    id: "adv-120",
    route: "Old Madras Road (Gate 2)",
    city: "Bengaluru",
    status: "active",
    impact: "high",
    timeSaved: 24,
    description: "FlowAI dynamically generated rerouting protocol to bypass heavy localized congestion across key nodes.",
    beforeDelay: 47,
    afterDelay: 23,
  },
];

export default function Advisories() {
  const [search, setSearch] = useState("");
  const [selectedAdvisory, setSelectedAdvisory] = useState<Advisory | null>(null);

  const filteredAdvisories = ADVISORIES.filter(a => 
    a.route.toLowerCase().includes(search.toLowerCase()) || 
    a.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-page">
      <div className="app-header">
        <div>
          <p className="app-eyebrow">Network balancing</p>
          <h1 className="app-title">Reroute Advisories</h1>
          <p className="app-subtitle">Dynamic traffic distribution and route optimization.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="Search routes..." 
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Advisory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAdvisories.map((advisory, i) => (
          <motion.div
            key={advisory.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card 
              className="transition-all duration-300 cursor-pointer group hover:-translate-y-0.5"
              onClick={() => setSelectedAdvisory(advisory)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={advisory.status === "active" ? "destructive" : "secondary"}>
                    {advisory.status.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className={advisory.impact === "high" ? "border-red-500 text-red-500" : "border-[#f36458] text-[#f36458]"}>
                    {advisory.impact.toUpperCase()} IMPACT
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold group-hover:text-[#f36458] transition-colors">{advisory.route}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {advisory.city}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                  {advisory.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/10">
                  <div className="flex items-center gap-2 text-green-600 font-bold">
                    <TrendingDown className="w-4 h-4" />
                    <span>{advisory.timeSaved} min saved</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Route Detail Modal */}
      <Dialog open={!!selectedAdvisory} onOpenChange={(open) => !open && setSelectedAdvisory(null)}>
        <DialogContent className="max-w-2xl">
          {selectedAdvisory && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="border-[#f36458] text-[#f36458]">REROUTE ADVISORY</Badge>
                  <Badge variant="secondary">{selectedAdvisory.city}</Badge>
                </div>
                <DialogTitle className="text-2xl font-bold">{selectedAdvisory.route}</DialogTitle>
                <DialogDescription>
                  Detailed impact analysis and corridor visualization.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Comparison Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-white/20">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Before Optimization</p>
                    <p className="text-3xl font-bold text-red-500">{selectedAdvisory.beforeDelay} min</p>
                    <p className="text-[10px] text-gray-400 mt-1">Avg. Travel Time</p>
                  </div>
                  <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
                    <p className="text-xs text-green-600 uppercase font-bold mb-1">After Optimization</p>
                    <p className="text-3xl font-bold text-green-600">{selectedAdvisory.afterDelay} min</p>
                    <p className="text-[10px] text-green-500/70 mt-1">Projected Travel Time</p>
                  </div>
                </div>

                {/* Corridor Visualization (Mock) */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold flex items-center gap-2">
                    <Navigation className="w-4 h-4" /> Corridor Heatmap
                  </h4>
                  <div className="h-12 w-full rounded-full bg-gray-100 dark:bg-neutral-900 flex overflow-hidden p-1">
                    <div className="h-full w-[20%] bg-green-500 rounded-l-full" />
                    <div className="h-full w-[15%] bg-yellow-500" />
                    <div className="h-full w-[40%] bg-red-500 animate-pulse" />
                    <div className="h-full w-[10%] bg-orange-500" />
                    <div className="h-full w-[15%] bg-green-500 rounded-r-full" />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 font-bold px-2">
                    <span>ORIGIN</span>
                    <span>BOTTLENECK</span>
                    <span>DESTINATION</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold">Actionable Insights</h4>
                  <ul className="space-y-2">
                    {[
                      "Divert 30% of traffic to alternate corridor B.",
                      "Extend green phase at junction 4 by 15 seconds.",
                      "Broadcast advisory to public transit feeds.",
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Button variant="ghost" onClick={() => setSelectedAdvisory(null)}>Close</Button>
                <Button className="bg-black dark:bg-white text-white dark:text-black hover:opacity-90">
                  Broadcast Advisory
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
