export interface SessionUser {
  name: string;
  email: string;
  role: "city_admin" | "traffic_engineer" | "observer";
  roleLabel: string;
}

export interface TrafficSnapshot {
  generatedAt: string;
  source: "live" | "demo";
  sourceLabel: string;
  coverageSegments?: number;
  stats: { totalVehicles: number; avgSpeed: number; congestionIndex: number; delayReduction: number };
  congestionByZone: Array<{ zone: string; level: number }>;
}

export interface AuditRecord {
  id: string;
  action: string;
  target: string;
  status: "pending_approval" | "approved" | "executed" | "failed" | "rejected" | "rolled_back";
  actor: string;
  role: SessionUser["role"];
  createdAt: string;
  updatedAt: string;
  reviewedBy?: string;
  executionMode: "planning_only" | "controller";
  error?: string;
}

export interface Prediction {
  generatedAt: string;
  horizonMinutes: number;
  confidence: number;
  inputSource: "live" | "demo";
  forecast: { congestionIndex: number; avgSpeed: number };
  factors: string[];
}

export interface SystemHealth {
  status: "ok";
  time: string;
  uptimeSeconds: number;
  traffic: { configured: boolean; lastCheck: { at: string; status: "live" | "demo" | "error"; message: string } | null };
  controller: { configured: boolean };
  storage: { status: string; engine: string };
}

const csrfToken = () => document.cookie.split(";").map((value) => value.trim()).find((value) => value.startsWith("flowai_csrf="))?.split("=")[1];

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body) headers.set("Content-Type", "application/json");
  const csrf = csrfToken();
  if (csrf && options.method && options.method !== "GET") headers.set("X-CSRF-Token", decodeURIComponent(csrf));
  const response = await fetch(url, { ...options, headers, credentials: "same-origin" });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(payload.error ?? "Request failed");
  }
  return response.status === 204 ? undefined as T : response.json();
}

export const api = {
  session: (signal?: AbortSignal) => request<{ user: SessionUser }>("/api/session", { signal }),
  login: (email: string, password: string) => request<{ user: SessionUser }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  logout: () => request<void>("/api/auth/logout", { method: "POST" }),
  traffic: () => request<TrafficSnapshot>("/api/traffic/snapshot"),
  prediction: (hour: number, weather: string) => request<Prediction>(`/api/predictions?hour=${encodeURIComponent(hour)}&weather=${encodeURIComponent(weather)}`),
  health: () => request<SystemHealth>("/api/health"),
  audit: () => request<{ records: AuditRecord[] }>("/api/audit"),
  runOperation: (action: string, target: string) => request<{ operation: AuditRecord }>("/api/operations", { method: "POST", body: JSON.stringify({ action, target }) }),
  approveOperation: (id: string) => request<{ operation: AuditRecord }>(`/api/operations/${id}/approve`, { method: "POST" }),
  rejectOperation: (id: string) => request<{ operation: AuditRecord }>(`/api/operations/${id}/reject`, { method: "POST" }),
  rollbackOperation: (id: string) => request<{ operation: AuditRecord }>(`/api/operations/${id}/rollback`, { method: "POST" }),
};
