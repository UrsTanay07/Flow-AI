import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import express, { type NextFunction, type Request, type Response } from "express";

type Role = "city_admin" | "traffic_engineer" | "observer";
type OperationStatus = "pending_approval" | "approved" | "executed" | "failed" | "rejected" | "rolled_back";
export interface SessionUser { name: string; email: string; role: Role; roleLabel: string }
interface SessionRecord { user: SessionUser; csrfToken: string; expiresAt: number }
export interface TrafficSnapshot {
  generatedAt: string; source: "live" | "demo"; sourceLabel: string; coverageSegments?: number;
  stats: { totalVehicles: number; avgSpeed: number; congestionIndex: number; delayReduction: number };
  congestionByZone: Array<{ zone: string; level: number }>;
}
export interface OperationRecord {
  id: string; action: string; target: string; status: OperationStatus; actor: string; role: Role;
  createdAt: string; updatedAt: string; reviewedBy?: string;
  executionMode: "planning_only" | "controller"; error?: string;
}

const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const TRAFFIC_CACHE_MS = 15_000;
const MAX_OPERATION_RECORDS = 10_000;
const users: Array<SessionUser & { passwordHash: string }> = [
  { email: "admin@flowai.in", name: "Admin", role: "city_admin", roleLabel: "City Administrator", passwordHash: "f470ceb8165d87cd4962d71174791c6a:a712b181c08821db6c401eef5400cad57524415cabbf8f17050664f944aa9a7ae4d17aa1fb9358b75fd46e7d3006a513144bd043c552f38b72e1d2a68e5e32cd" },
  { email: "tanay@flowai.in", name: "Tanay Patil", role: "traffic_engineer", roleLabel: "Traffic Engineer", passwordHash: "068ca00b1b92dca2aa47acaa4c1cec3b:c11be6d6fd2dd2d845ff00b424ca1f6adecf10dad30421cd9721980d5449bbd9dc76c1fe569375b4be829b13d6aadbc0ddb0b15f48ebb3410b647a969a7abc8f" },
  { email: "demo@flowai.in", name: "Demo User", role: "observer", roleLabel: "Observer", passwordHash: "783db7b0145a4dd6860d5c9f4240517f:d424be36b66ec7de9bfb5e6995169240236f4ac24ca715519377763f707ec1b705687b8f46313258c06216ec4fbf38d4fdd1dca2ea695008f0d5ca28d84d0551" },
];

const demoSnapshot = (): TrafficSnapshot => ({
  generatedAt: new Date().toISOString(), source: "demo", sourceLabel: "Calibrated demonstration dataset",
  stats: { totalVehicles: 41_200_000, avgSpeed: 17.6, congestionIndex: 56.5, delayReduction: 14.8 },
  congestionByZone: [{ zone: "North", level: 69 }, { zone: "South", level: 88 }, { zone: "East", level: 52 }, { zone: "West", level: 84 }, { zone: "Central", level: 96 }],
});
const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));
const isTrafficSnapshot = (value: unknown): value is TrafficSnapshot => {
  if (!value || typeof value !== "object") return false;
  const snapshot = value as Partial<TrafficSnapshot>;
  return typeof snapshot.generatedAt === "string"
    && snapshot.stats !== undefined
    && Number.isFinite(snapshot.stats.totalVehicles)
    && Number.isFinite(snapshot.stats.avgSpeed)
    && Number.isFinite(snapshot.stats.congestionIndex)
    && Number.isFinite(snapshot.stats.delayReduction)
    && Array.isArray(snapshot.congestionByZone)
    && snapshot.congestionByZone.every((zone) => typeof zone?.zone === "string" && Number.isFinite(zone.level));
};

const parseCookies = (header = "") => Object.fromEntries(header.split(";").map((item) => item.trim()).filter(Boolean).map((item) => {
  const separator = item.indexOf("="); return [decodeURIComponent(item.slice(0, separator)), decodeURIComponent(item.slice(separator + 1))];
}));
const safeUser = ({ passwordHash: _passwordHash, ...user }: typeof users[number]): SessionUser => user;
const verifyPassword = (password: string, stored: string) => {
  const [salt, expectedHex] = stored.split(":"); const actual = crypto.scryptSync(password, salt, 64); const expected = Buffer.from(expectedHex, "hex");
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
};

export function createApiApp(options: { dataDirectory?: string } = {}) {
  const app = express();
  const dataDirectory = options.dataDirectory ?? path.resolve(process.cwd(), "data");
  const operationsFile = path.join(dataDirectory, "operations.json");
  const sessions = new Map<string, SessionRecord>();
  const loginAttempts = new Map<string, { count: number; resetAt: number }>();
  let storageQueue = Promise.resolve();
  let trafficCache: { snapshot: TrafficSnapshot; expiresAt: number } | null = null;

  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [id, session] of sessions) if (session.expiresAt <= now) sessions.delete(id);
    for (const [key, attempt] of loginAttempts) if (attempt.resetAt <= now) loginAttempts.delete(key);
  }, 15 * 60_000);
  cleanupTimer.unref();

  const readOperations = async (): Promise<OperationRecord[]> => {
    try { return JSON.parse(await fs.readFile(operationsFile, "utf8")) as OperationRecord[]; }
    catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return []; throw error; }
  };
  const writeOperations = async (records: OperationRecord[]) => {
    await fs.mkdir(dataDirectory, { recursive: true });
    const tempFile = `${operationsFile}.${crypto.randomUUID()}.tmp`;
    await fs.writeFile(tempFile, JSON.stringify(records, null, 2), "utf8");
    await fs.rename(tempFile, operationsFile);
  };
  const mutateOperations = <T>(mutation: (records: OperationRecord[]) => T | Promise<T>) => {
    const task = storageQueue.then(async () => { const records = await readOperations(); const result = await mutation(records); await writeOperations(records); return result; });
    storageQueue = task.then(() => undefined, () => undefined); return task;
  };
  const sessionFromRequest = (request: Request) => {
    const sessionId = parseCookies(request.headers.cookie).flowai_session; if (!sessionId) return null;
    const session = sessions.get(sessionId); if (!session || session.expiresAt <= Date.now()) { sessions.delete(sessionId); return null; }
    session.expiresAt = Date.now() + SESSION_TTL_MS; return session;
  };
  const requireSession = (request: Request, response: Response, next: NextFunction) => {
    const session = sessionFromRequest(request); if (!session) return response.status(401).json({ error: "Authentication required" }); response.locals.session = session; next();
  };
  const requireCsrf = (request: Request, response: Response, next: NextFunction) => {
    const session = response.locals.session as SessionRecord; const cookieToken = parseCookies(request.headers.cookie).flowai_csrf; const headerToken = request.header("x-csrf-token");
    if (!cookieToken || !headerToken || cookieToken !== session.csrfToken || headerToken !== session.csrfToken) return response.status(403).json({ error: "Request verification failed" }); next();
  };
  const requireOperator = (_request: Request, response: Response, next: NextFunction) => {
    if ((response.locals.session as SessionRecord).user.role === "observer") return response.status(403).json({ error: "Observer accounts cannot execute operations" }); next();
  };
  const requireAdmin = (_request: Request, response: Response, next: NextFunction) => {
    if ((response.locals.session as SessionRecord).user.role !== "city_admin") return response.status(403).json({ error: "City administrator approval is required" }); next();
  };

  const getTrafficSnapshot = async (): Promise<TrafficSnapshot> => {
    if (trafficCache && trafficCache.expiresAt > Date.now()) return trafficCache.snapshot;
    const providerUrl = process.env.TRAFFIC_PROVIDER_URL?.trim();
    if (!providerUrl) {
      const snapshot = demoSnapshot();
      trafficCache = { snapshot, expiresAt: Date.now() + TRAFFIC_CACHE_MS };
      return snapshot;
    }

    try {
      const url = new URL(providerUrl);
      if (process.env.NODE_ENV === "production" && url.protocol !== "https:") throw new Error("Production traffic provider must use HTTPS");
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4_000);
      const providerResponse = await fetch(url, {
        signal: controller.signal,
        headers: process.env.TRAFFIC_PROVIDER_TOKEN ? { Authorization: `Bearer ${process.env.TRAFFIC_PROVIDER_TOKEN}` } : undefined,
      }).finally(() => clearTimeout(timeout));
      if (!providerResponse.ok) throw new Error(`Traffic provider returned ${providerResponse.status}`);
      const payload: unknown = await providerResponse.json();
      if (!isTrafficSnapshot(payload)) throw new Error("Traffic provider returned an invalid payload");
      const snapshot: TrafficSnapshot = { ...payload, source: "live", sourceLabel: payload.sourceLabel || "Configured traffic provider" };
      trafficCache = { snapshot, expiresAt: Date.now() + TRAFFIC_CACHE_MS };
      return snapshot;
    } catch (error) {
      console.error(JSON.stringify({ level: "error", event: "traffic_provider_failed", message: error instanceof Error ? error.message : "Unknown provider error" }));
      const snapshot = { ...demoSnapshot(), sourceLabel: "Demonstration fallback · live provider unavailable" };
      trafficCache = { snapshot, expiresAt: Date.now() + TRAFFIC_CACHE_MS };
      return snapshot;
    }
  };
  const dispatchController = async (_operation: OperationRecord, command: "execute" | "rollback") => {
    return { status: command === "execute" ? "approved" as const : "rolled_back" as const, mode: "planning_only" as const };
  };

  app.disable("x-powered-by");
  app.set("trust proxy", process.env.TRUST_PROXY === "true" ? 1 : false);
  app.use((request, response, next) => {
    const incoming = request.header("x-request-id");
    const requestId = incoming && /^[a-zA-Z0-9._-]{8,64}$/.test(incoming) ? incoming : crypto.randomUUID();
    const startedAt = performance.now();
    response.locals.requestId = requestId;
    response.setHeader("X-Request-ID", requestId);
    response.once("finish", () => {
      if (process.env.FLOWAI_LOG_REQUESTS === "true") console.log(JSON.stringify({ level: "info", event: "http_request", requestId, method: request.method, path: request.path, status: response.statusCode, durationMs: Number((performance.now() - startedAt).toFixed(1)) }));
    });
    next();
  });
  app.use(express.json({ limit: "32kb", strict: true }));
  app.use((request, response, next) => { if (!request.path.startsWith("/api")) return next(); response.set({ "Cache-Control": "no-store", "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'", "Referrer-Policy": "no-referrer", "X-Content-Type-Options": "nosniff", "X-Frame-Options": "DENY" }); next(); });
  app.get("/api/health", (_request, response) => response.json({
    status: "ok", time: new Date().toISOString(), uptimeSeconds: Math.round(process.uptime()),
    version: process.env.APP_VERSION ?? "development",
    traffic: { configured: Boolean(process.env.TRAFFIC_PROVIDER_URL), lastCheck: { at: new Date().toISOString(), status: process.env.TRAFFIC_PROVIDER_URL ? "live" : "demo", message: process.env.TRAFFIC_PROVIDER_URL ? "External provider configured" : "Internal demonstration engine active" } },
    controller: { configured: false }, storage: { status: "ready", engine: "durable-json" },
  }));
  app.get("/api/ready", async (_request, response) => {
    try {
      await fs.mkdir(dataDirectory, { recursive: true });
      await fs.access(dataDirectory, fs.constants.R_OK | fs.constants.W_OK);
      response.json({ status: "ready", time: new Date().toISOString() });
    } catch {
      response.status(503).json({ status: "not_ready", error: "Storage is unavailable" });
    }
  });
  app.post("/api/auth/login", (request, response) => {
    const key = request.ip || "unknown"; const attempt = loginAttempts.get(key);
    if (attempt && attempt.resetAt > Date.now() && attempt.count >= 8) return response.status(429).json({ error: "Too many sign-in attempts. Please wait and try again." });
    const email = typeof request.body?.email === "string" ? request.body.email.trim().toLowerCase() : ""; const password = typeof request.body?.password === "string" ? request.body.password : ""; const account = users.find((user) => user.email === email);
    if (!account || !verifyPassword(password, account.passwordHash)) { loginAttempts.set(key, { count: attempt && attempt.resetAt > Date.now() ? attempt.count + 1 : 1, resetAt: Date.now() + 15 * 60_000 }); return response.status(401).json({ error: "Incorrect email or password" }); }
    loginAttempts.delete(key); const sessionId = crypto.randomBytes(32).toString("base64url"); const csrfToken = crypto.randomBytes(24).toString("base64url"); const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    sessions.set(sessionId, { user: safeUser(account), csrfToken, expiresAt: Date.now() + SESSION_TTL_MS });
    response.setHeader("Set-Cookie", [`flowai_session=${sessionId}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL_MS / 1000}${secure}`, `flowai_csrf=${csrfToken}; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL_MS / 1000}${secure}`]); return response.json({ user: safeUser(account) });
  });
  app.get("/api/session", requireSession, (_request, response) => response.json({ user: (response.locals.session as SessionRecord).user }));
  app.post("/api/auth/logout", requireSession, requireCsrf, (request, response) => { sessions.delete(parseCookies(request.headers.cookie).flowai_session); response.setHeader("Set-Cookie", ["flowai_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0", "flowai_csrf=; SameSite=Strict; Path=/; Max-Age=0"]); response.status(204).end(); });
  app.get("/api/traffic/snapshot", requireSession, async (_request, response) => response.json(await getTrafficSnapshot()));
  app.get("/api/traffic/stream", requireSession, async (request, response) => {
    response.set({ "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive" });
    response.flushHeaders();
    let closed = false;
    const sendSnapshot = async () => {
      if (closed) return;
      try { response.write(`event: snapshot\ndata: ${JSON.stringify(await getTrafficSnapshot())}\n\n`); }
      catch { response.write(`event: provider-error\ndata: {"message":"Traffic update unavailable"}\n\n`); }
    };
    response.write("retry: 5000\n\n");
    await sendSnapshot();
    const timer = setInterval(sendSnapshot, TRAFFIC_CACHE_MS);
    request.once("close", () => { closed = true; clearInterval(timer); response.end(); });
  });
  app.get("/api/predictions", requireSession, async (request, response) => {
    const snapshot = await getTrafficSnapshot(); const rawHour = Number(request.query.hour ?? new Date().getHours()); const hour = clamp(Number.isFinite(rawHour) ? rawHour : new Date().getHours(), 0, 23);
    const weather = ["clear", "rain", "heavy_rain", "smog"].includes(String(request.query.weather)) ? String(request.query.weather) : "clear";
    const peak = hour >= 8 && hour <= 11 || hour >= 17 && hour <= 21; const weatherFactor = weather === "heavy_rain" ? 1.28 : weather === "rain" ? 1.14 : weather === "smog" ? 1.08 : 1; const demandFactor = (peak ? 1.18 : 0.88) * weatherFactor;
    response.json({ generatedAt: new Date().toISOString(), horizonMinutes: 60, confidence: snapshot.source === "live" ? 86 : 64, inputSource: snapshot.source, forecast: { congestionIndex: Number(clamp(snapshot.stats.congestionIndex * demandFactor).toFixed(1)), avgSpeed: Number(Math.max(5, snapshot.stats.avgSpeed / demandFactor).toFixed(1)) }, factors: [peak ? "Peak-hour demand" : "Off-peak demand", weather === "clear" ? "Clear weather" : "Weather disruption", snapshot.source === "live" ? "Live flow input" : "Demonstration input"] });
  });

  app.post("/api/operations", requireSession, requireCsrf, requireOperator, async (request, response) => {
    const action = typeof request.body?.action === "string" ? request.body.action.trim().slice(0, 120) : ""; const target = typeof request.body?.target === "string" ? request.body.target.trim().slice(0, 160) : "";
    if (!action || !target) return response.status(400).json({ error: "Action and target are required" });
    const session = response.locals.session as SessionRecord; const now = new Date().toISOString();
    const record: OperationRecord = { id: crypto.randomUUID(), action, target, status: session.user.role === "city_admin" ? "approved" : "pending_approval", actor: session.user.email, role: session.user.role, createdAt: now, updatedAt: now, executionMode: "planning_only" };
    if (session.user.role === "city_admin") { try { const result = await dispatchController(record, "execute"); record.status = result.status; record.executionMode = result.mode; record.reviewedBy = session.user.email; } catch (error) { record.status = "failed"; record.error = error instanceof Error ? error.message : "Controller request failed"; } }
    await mutateOperations((records) => { records.push(record); if (records.length > MAX_OPERATION_RECORDS) records.splice(0, records.length - MAX_OPERATION_RECORDS); }); response.status(202).json({ operation: record });
  });
  app.post("/api/operations/:id/approve", requireSession, requireCsrf, requireAdmin, async (request, response) => {
    const reviewer = (response.locals.session as SessionRecord).user.email;
    const operation = await mutateOperations(async (records) => { const record = records.find((item) => item.id === request.params.id); if (!record || record.status !== "pending_approval") return null; try { const result = await dispatchController(record, "execute"); record.status = result.status; record.executionMode = result.mode; } catch (error) { record.status = "failed"; record.error = error instanceof Error ? error.message : "Controller request failed"; } record.reviewedBy = reviewer; record.updatedAt = new Date().toISOString(); return record; });
    if (!operation) return response.status(409).json({ error: "Operation is not awaiting approval" }); response.json({ operation });
  });
  app.post("/api/operations/:id/reject", requireSession, requireCsrf, requireAdmin, async (request, response) => {
    const reviewer = (response.locals.session as SessionRecord).user.email;
    const operation = await mutateOperations((records) => { const record = records.find((item) => item.id === request.params.id); if (!record || record.status !== "pending_approval") return null; record.status = "rejected"; record.reviewedBy = reviewer; record.updatedAt = new Date().toISOString(); return record; });
    if (!operation) return response.status(409).json({ error: "Operation is not awaiting approval" }); response.json({ operation });
  });
  app.post("/api/operations/:id/rollback", requireSession, requireCsrf, requireAdmin, async (request, response) => {
    const reviewer = (response.locals.session as SessionRecord).user.email;
    const operation = await mutateOperations(async (records) => { const record = records.find((item) => item.id === request.params.id); if (!record || !["approved", "executed"].includes(record.status)) return null; try { const result = await dispatchController(record, "rollback"); record.status = result.status; record.executionMode = result.mode; record.error = undefined; } catch (error) { record.status = "failed"; record.error = error instanceof Error ? error.message : "Rollback failed"; } record.reviewedBy = reviewer; record.updatedAt = new Date().toISOString(); return record; });
    if (!operation) return response.status(409).json({ error: "Operation cannot be rolled back" }); response.json({ operation });
  });
  app.get("/api/audit", requireSession, requireOperator, async (_request, response) => response.json({ records: (await readOperations()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 100) }));
  app.use("/api", (_request, response) => response.status(404).json({ error: "API endpoint not found" }));
  app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
    if (error instanceof SyntaxError && "body" in error) return response.status(400).json({ error: "Request body must contain valid JSON" });
    console.error(JSON.stringify({ level: "error", event: "unhandled_request_error", requestId: response.locals.requestId, message: error instanceof Error ? error.message : "Unknown error" }));
    return response.status(500).json({ error: "Unexpected server error", requestId: response.locals.requestId });
  });
  return app;
}
