import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import type { Server } from "node:http";
import { createApiApp } from "./app.ts";

const start = async () => {
  const dataDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "flowai-test-"));
  const app = createApiApp({ dataDirectory });
  const server = await new Promise<Server>((resolve) => {
    const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
  });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Test server did not start");
  return { baseUrl: `http://127.0.0.1:${address.port}`, dataDirectory, server };
};

const login = async (baseUrl: string, email: string, password: string) => {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const cookies = response.headers.getSetCookie();
  return {
    response,
    cookie: cookies.map((value) => value.split(";")[0]).join("; "),
    csrf: cookies.find((value) => value.startsWith("flowai_csrf="))?.split(";")[0].split("=")[1] ?? "",
  };
};

test("health endpoint responds without authentication", async (t) => {
  const context = await start();
  t.after(() => context.server.close());
  t.after(() => fs.rm(context.dataDirectory, { recursive: true, force: true }));
  const response = await fetch(`${context.baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).status, "ok");
});

test("readiness verifies writable storage and responses include a request id", async (t) => {
  const context = await start();
  t.after(() => context.server.close());
  t.after(() => fs.rm(context.dataDirectory, { recursive: true, force: true }));
  const response = await fetch(`${context.baseUrl}/api/ready`, { headers: { "X-Request-ID": "flowai-test-request" } });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-request-id"), "flowai-test-request");
  assert.equal((await response.json()).status, "ready");
});

test("malformed JSON is rejected as a client error", async (t) => {
  const context = await start();
  t.after(() => context.server.close());
  t.after(() => fs.rm(context.dataDirectory, { recursive: true, force: true }));
  const response = await fetch(`${context.baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{",
  });
  assert.equal(response.status, 400);
  assert.equal((await response.json()).error, "Request body must contain valid JSON");
});

test("authentication creates a server session and rejects invalid credentials", async (t) => {
  const context = await start();
  t.after(() => context.server.close());
  t.after(() => fs.rm(context.dataDirectory, { recursive: true, force: true }));
  const invalid = await login(context.baseUrl, "admin@flowai.in", "wrong");
  assert.equal(invalid.response.status, 401);
  const valid = await login(context.baseUrl, "admin@flowai.in", "flowai123");
  assert.equal(valid.response.status, 200);
  const session = await fetch(`${context.baseUrl}/api/session`, { headers: { Cookie: valid.cookie } });
  assert.equal(session.status, 200);
  assert.equal((await session.json()).user.role, "city_admin");
});

test("operations require CSRF protection and persist an audit record", async (t) => {
  const context = await start();
  t.after(() => context.server.close());
  t.after(() => fs.rm(context.dataDirectory, { recursive: true, force: true }));
  const auth = await login(context.baseUrl, "tanay@flowai.in", "tanay123");
  const body = JSON.stringify({ action: "Apply signal plan", target: "Saki Naka Junction" });
  const blocked = await fetch(`${context.baseUrl}/api/operations`, { method: "POST", headers: { Cookie: auth.cookie, "Content-Type": "application/json" }, body });
  assert.equal(blocked.status, 403);
  const accepted = await fetch(`${context.baseUrl}/api/operations`, { method: "POST", headers: { Cookie: auth.cookie, "Content-Type": "application/json", "X-CSRF-Token": auth.csrf }, body });
  assert.equal(accepted.status, 202);
  const audit = await fetch(`${context.baseUrl}/api/audit`, { headers: { Cookie: auth.cookie } });
  assert.equal(audit.status, 200);
  assert.equal((await audit.json()).records.length, 1);
});

test("observer role cannot execute city operations", async (t) => {
  const context = await start();
  t.after(() => context.server.close());
  t.after(() => fs.rm(context.dataDirectory, { recursive: true, force: true }));
  const auth = await login(context.baseUrl, "demo@flowai.in", "demo123");
  const response = await fetch(`${context.baseUrl}/api/operations`, {
    method: "POST",
    headers: { Cookie: auth.cookie, "Content-Type": "application/json", "X-CSRF-Token": auth.csrf },
    body: JSON.stringify({ action: "Apply signal plan", target: "Test junction" }),
  });
  assert.equal(response.status, 403);
});



test("administrator can approve and roll back an engineer request", async (t) => {
  const context = await start();
  t.after(() => context.server.close());
  t.after(() => fs.rm(context.dataDirectory, { recursive: true, force: true }));
  const engineer = await login(context.baseUrl, "tanay@flowai.in", "tanay123");
  const submitted = await fetch(`${context.baseUrl}/api/operations`, {
    method: "POST",
    headers: { Cookie: engineer.cookie, "Content-Type": "application/json", "X-CSRF-Token": engineer.csrf },
    body: JSON.stringify({ action: "Apply signal plan", target: "Test corridor" }),
  });
  const operation = (await submitted.json()).operation;
  assert.equal(operation.status, "pending_approval");

  const admin = await login(context.baseUrl, "admin@flowai.in", "flowai123");
  const approved = await fetch(`${context.baseUrl}/api/operations/${operation.id}/approve`, {
    method: "POST", headers: { Cookie: admin.cookie, "X-CSRF-Token": admin.csrf },
  });
  assert.equal((await approved.json()).operation.status, "approved");
  const rolledBack = await fetch(`${context.baseUrl}/api/operations/${operation.id}/rollback`, {
    method: "POST", headers: { Cookie: admin.cookie, "X-CSRF-Token": admin.csrf },
  });
  assert.equal((await rolledBack.json()).operation.status, "rolled_back");
});

test("prediction endpoint reports confidence and a one-hour forecast", async (t) => {
  const context = await start();
  t.after(() => context.server.close());
  t.after(() => fs.rm(context.dataDirectory, { recursive: true, force: true }));
  const auth = await login(context.baseUrl, "admin@flowai.in", "flowai123");
  const response = await fetch(`${context.baseUrl}/api/predictions?hour=9&weather=rain`, { headers: { Cookie: auth.cookie } });
  const prediction = await response.json();
  assert.equal(response.status, 200);
  assert.equal(prediction.horizonMinutes, 60);
  assert.equal(prediction.confidence, 64);
  assert.ok(prediction.forecast.congestionIndex > 0);
});

test("authenticated clients receive a real-time traffic event", async (t) => {
  const context = await start();
  t.after(() => context.server.close());
  t.after(() => fs.rm(context.dataDirectory, { recursive: true, force: true }));
  const auth = await login(context.baseUrl, "admin@flowai.in", "flowai123");
  const controller = new AbortController();
  const response = await fetch(`${context.baseUrl}/api/traffic/stream`, { headers: { Cookie: auth.cookie }, signal: controller.signal });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /text\/event-stream/);
  const chunk = await response.body?.getReader().read();
  controller.abort();
  assert.match(new TextDecoder().decode(chunk?.value), /event: snapshot/);
});
