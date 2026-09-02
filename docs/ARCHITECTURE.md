# FlowAI architecture

## Runtime

The React application is compiled into static assets and served by the Express
process that also owns authentication and `/api` routes. The server stores
sessions in memory and audit operations in an atomically replaced JSON file.
Production deployments should run one application replica per writable data
volume until sessions and audit records are moved to shared durable stores.

## Traffic data contract

When `TRAFFIC_PROVIDER_URL` is configured, FlowAI performs a read-only HTTPS GET
with an optional bearer token. The provider must return:

```json
{
  "generatedAt": "2026-01-01T00:00:00.000Z",
  "source": "live",
  "sourceLabel": "Provider name",
  "coverageSegments": 1200,
  "stats": {
    "totalVehicles": 100000,
    "avgSpeed": 24.5,
    "congestionIndex": 51.2,
    "delayReduction": 12.4
  },
  "congestionByZone": [{ "zone": "Central", "level": 72 }]
}
```

Provider responses are validated, cached for 15 seconds, and streamed to signed-in
clients with server-sent events. A failure falls back to clearly labelled demo
data; it never implies that demonstration readings are live.

## Trust boundaries

- Authentication, role checks, CSRF checks, and operation persistence are server-side.
- Observers cannot submit operations; engineers require administrative approval.
- Signal actions remain planning-only. Connecting physical infrastructure requires
  a separate authorized integration and safety review.
- Production traffic-provider URLs must use HTTPS.

## Operational endpoints

- `/api/health` reports process, provider, controller, and storage metadata.
- `/api/ready` verifies that the durable-data directory is readable and writable.
- Every response includes `X-Request-ID`; JSON request logging is enabled with
  `FLOWAI_LOG_REQUESTS=true`.
