import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createApiApp } from "./app.ts";

const preferredPort = Number(process.env.PORT ?? 3000);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = express();
app.disable("x-powered-by");

app.use((_request, response, next) => {
  response.set({
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  });
  if (process.env.NODE_ENV === "production") {
    response.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self'; worker-src 'self' blob:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
  }
  next();
});

app.use(createApiApp());

const serveBuiltApp = process.env.NODE_ENV === "production" || process.env.FLOWAI_SERVE_DIST === "true";

if (serveBuiltApp) {
  app.use(express.static(path.join(root, "dist"), { maxAge: "1h", etag: true }));
  app.get("*", (_request, response) => response.sendFile(path.join(root, "dist", "index.html")));
} else {
  // The app uses Node watch mode, so a separate Vite HMR socket is unnecessary.
  process.env.DISABLE_HMR = "true";
  const { createServer } = await import("vite");
  const vite = await createServer({
    root,
    configLoader: "runner",
    server: {
      middlewareMode: true,
      // Node's watch mode restarts the server after edits. Keeping Vite's
      // separate WebSocket disabled avoids collisions with stale dev sessions.
      hmr: false,
    },
    appType: "spa",
  });
  app.use(vite.middlewares);
}

const explicitPort = process.env.PORT !== undefined;
const maxFallbacks = explicitPort ? 0 : 10;
let activeServer: ReturnType<typeof app.listen> | null = null;

const listen = (port: number, fallbackCount = 0) => {
  const server = app.listen(port, "0.0.0.0");
  activeServer = server;
  server.once("listening", () => {
    console.log(`FlowAI is ready at http://localhost:${port}`);
  });
  server.once("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE" && fallbackCount < maxFallbacks) {
      const nextPort = port + 1;
      console.warn(`Port ${port} is busy. Trying ${nextPort}...`);
      listen(nextPort, fallbackCount + 1);
      return;
    }
    console.error(error.code === "EADDRINUSE"
      ? `Port ${port} is already in use. Stop the other server or set a different PORT.`
      : error);
    process.exitCode = 1;
  });
};

listen(preferredPort);

const shutdown = (signal: string) => {
  console.log(JSON.stringify({ level: "info", event: "shutdown", signal }));
  if (!activeServer) return process.exit(0);
  activeServer.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));
