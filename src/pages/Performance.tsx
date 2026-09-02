import React, { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  TrendingDown, 
  CheckCircle2, 
  XCircle, 
  Cpu,
  History as HistoryIcon,
  ArrowUpRight,
  RefreshCw,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { api, type AuditRecord, type SessionUser } from "@/lib/api";

const PERFORMANCE_DATA = [
  { day: "Mon", before: 45, after: 32 },
  { day: "Tue", before: 48, after: 30 },
  { day: "Wed", before: 52, after: 35 },
  { day: "Thu", before: 50, after: 33 },
  { day: "Fri", before: 58, after: 38 },
  { day: "Sat", before: 40, after: 28 },
  { day: "Sun", before: 35, after: 25 },
];

const TOP_CORRIDORS = [
  { name: "WEH (Mumbai)", improvement: 28 },
  { name: "ORR (Bengaluru)", improvement: 24 },
  { name: "Ring Road (Delhi)", improvement: 22 },
  { name: "Hitech City (Hyd)", improvement: 18 },
  { name: "Mount Road (Chennai)", improvement: 15 },
];

export default function Performance() {
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>([]);
  const [auditError, setAuditError] = useState("");
  const [auditLoading, setAuditLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [updatingId, setUpdatingId] = useState("");

  const loadAudit = useCallback(async () => {
    setAuditLoading(true);
    try {
      const { records } = await api.audit();
      setAuditRecords(records);
      setAuditError("");
    } catch (error) {
      setAuditError(error instanceof Error ? error.message : "Audit trail is unavailable");
    } finally {
      setAuditLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAudit();
    api.session().then(({ user }) => setCurrentUser(user)).catch(() => undefined);
  }, [loadAudit]);

  const updateOperation = async (id: string, action: "approve" | "reject" | "rollback") => {
    setUpdatingId(id);
    try {
      if (action === "approve") await api.approveOperation(id);
      else if (action === "reject") await api.rejectOperation(id);
      else await api.rollbackOperation(id);
      await loadAudit();
    } catch (error) {
      setAuditError(error instanceof Error ? error.message : "Operation could not be updated");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div className="app-page">
      <div className="app-header">
        <div>
          <p className="app-eyebrow">Accountability & outcomes</p>
          <h1 className="app-title">History & Performance</h1>
          <p className="app-subtitle">Historical analysis and system efficiency metrics.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Last 7 Days
          </Button>
          <Button className="bg-black dark:bg-white text-white dark:text-black">
            Export Report
          </Button>
        </div>
      </div>

      <Card className="border-black/20 dark:border-white/15">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#f36458]" /> Operations Audit Trail
            </CardTitle>
            <CardDescription>Authenticated control actions recorded by the backend.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={loadAudit} disabled={auditLoading} aria-label="Refresh audit trail">
            <RefreshCw className={`w-4 h-4 mr-2 ${auditLoading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {auditError ? (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
              {auditError}. Operator access is required to view control history.
            </div>
          ) : auditRecords.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 dark:border-white/15 p-8 text-center text-sm text-gray-500">
              No control operations have been submitted yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Operation</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Operator</TableHead>
                    <TableHead>Status</TableHead>
                    {currentUser?.role === "city_admin" && <TableHead className="text-right">Admin action</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditRecords.slice(0, 12).map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="whitespace-nowrap text-xs text-gray-500">
                        {new Date(record.createdAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                      </TableCell>
                      <TableCell className="font-medium">{record.action}</TableCell>
                      <TableCell className="text-sm text-gray-500">{record.target}</TableCell>
                      <TableCell className="text-xs font-mono">{record.actor}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant={record.status === "failed" || record.status === "rejected" ? "destructive" : "secondary"}>{record.status.replaceAll("_", " ")}</Badge>
                          <p className="text-[10px] text-gray-500">{record.executionMode === "controller" ? "Controller connected" : "Planning mode"}</p>
                        </div>
                      </TableCell>
                      {currentUser?.role === "city_admin" && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {record.status === "pending_approval" && <>
                              <Button size="sm" onClick={() => updateOperation(record.id, "approve")} disabled={updatingId === record.id}>Approve</Button>
                              <Button size="sm" variant="outline" onClick={() => updateOperation(record.id, "reject")} disabled={updatingId === record.id}>Reject</Button>
                            </>}
                            {(record.status === "approved" || record.status === "executed") && (
                              <Button size="sm" variant="destructive" onClick={() => updateOperation(record.id, "rollback")} disabled={updatingId === record.id}>Rollback</Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Avg. Delay Reduction", value: "24.5%", icon: TrendingDown, color: "text-green-500" },
          { title: "Successful Advisories", value: "1,248", icon: CheckCircle2, color: "text-blue-500" },
          { title: "Fuel Saved (Est.)", value: "45.2k L", icon: Cpu, color: "text-yellow-500" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gray-50 dark:bg-neutral-900 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Before vs After Delay */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">Before vs After Optimization (Delay Index)</CardTitle>
            <CardDescription>Comparison of average travel delay in minutes.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PERFORMANCE_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Line type="monotone" dataKey="before" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="Before" />
                <Line type="monotone" dataKey="after" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} name="After" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Corridor Improvement */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">Top 5 Corridors (Improvement %)</CardTitle>
            <CardDescription>Corridors with highest efficiency gains this week.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TOP_CORRIDORS} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Bar dataKey="improvement" fill="#f36458" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Advisory History Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">Recent Advisory Performance</CardTitle>
            <CardDescription>Log of recent reroute advisories and their outcomes.</CardDescription>
          </div>
          <div className="p-4 rounded-[6px] bg-[#f36458]/8 border border-[#f36458]/25 flex items-center gap-3">
            <Cpu className="w-5 h-5 text-[#f36458]" />
            <div>
              <p className="text-[10px] text-blue-700 dark:text-blue-300 font-bold uppercase">Model Status</p>
              <p className="text-xs font-bold">Last retrained: 2h ago</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead className="text-right">Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { time: "12:45 PM", route: "Worli Naka", status: "Success", compliance: "82%", impact: "-12 min" },
                { time: "11:30 AM", route: "Silk Board", status: "Success", compliance: "75%", impact: "-18 min" },
                { time: "10:15 AM", route: "Connaught Place", status: "Partial", compliance: "45%", impact: "-5 min" },
                { time: "09:00 AM", route: "Hitech City", status: "Success", compliance: "88%", impact: "-9 min" },
                { time: "08:15 AM", route: "Mount Road", status: "Failed", compliance: "12%", impact: "0 min" },
              ].map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="text-xs text-gray-500">{row.time}</TableCell>
                  <TableCell className="font-medium">{row.route}</TableCell>
                  <TableCell>
                    <Badge variant={row.status === "Success" ? "secondary" : row.status === "Partial" ? "outline" : "destructive"}>
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-mono">{row.compliance}</TableCell>
                  <TableCell className="text-right font-bold text-green-600">{row.impact}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
