# Operations runbook

## Start and verify

1. Install with `npm ci`.
2. Copy `.env.example` to `.env` and set only approved provider values.
3. Run `npm run check` before deployment.
4. Start with `npm start` after building, or deploy the provided container.
5. Verify `/api/ready`, then `/api/health`, then sign in with a non-admin account.

## Incident response

- **Provider unavailable:** FlowAI labels and serves demonstration fallback data.
  Confirm provider reachability and credentials; do not treat fallback readings as live.
- **Storage unavailable:** readiness returns 503. Restore write access to the data
  volume before accepting new operations.
- **Port occupied:** development automatically selects the next free port. Production
  should fail deployment health checks until the configured port is available.
- **Suspicious authentication traffic:** preserve request logs, rotate credentials,
  and restart the process to invalidate in-memory sessions.

## Backup and recovery

Back up the mounted `data/` volume. Restore `operations.json` only while the
application is stopped, validate that it is JSON, then start and verify the audit view.
