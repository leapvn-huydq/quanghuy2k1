# Security, privacy and scope policy

This repository is an **original personal mock**, not a reproduction of an employer/client platform. It contains invented names, flight offer, routes, synthetic email addresses and fake amounts. No payment processor, airline, travel booking or external API is contacted.

Do not add:

- URLs for customer UAT/production, live airline/provider endpoints or internal dashboards.
- Real user credentials, cookies, API keys, customer PII, booking IDs or transaction evidence.
- Employer-owned source code, screenshots, internal test cases or proprietary workflows.
- GitHub Actions schedule targeting real environments or destructive production operations.

AI-assisted development is permitted in this fictional exercise, but verify generated scripts against `docs/requirements.md`, preserve test failure evidence and never invent passing results. `CLAUDE.md` and `.cursor/` are text guides; they do not cause any real automation on their own. Do not run an AI/MCP browser against a third-party or employer system without explicit authorization and approved test accounts.

Demo HMAC secret is synthetic; production payment integrations need secure secret management, replay windows, audit, authn/authz, fraud protection and a real gateway sandbox. The `POST /api/demo/payments` endpoint exists only to demonstrate UI flows and must not be deployed publicly.