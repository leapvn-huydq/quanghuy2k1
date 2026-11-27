---
name: qa-test-runner
description: Safely run and report local synthetic QA smoke, API/domain regression and optional Playwright browser scenarios, with accurate evidence and failure triage.
---

# QC test runner

1. Confirm target is this localhost-only mock. Do not run against third-party/customer UAT or production.
2. Choose the smallest relevant suite: `npm run test:smoke`, `npm run test:api`, or `npm run test:ui` if the browser is available.
3. Run `npm run lint` before changes; for API regression also run `npm run test:report` to capture actual summary.
4. On failure, collect test ID, exact assertion, HTTP status/response, environment and reproduction steps. Do **not** rewrite expected behavior to hide it.
5. Mark blocked/not-run clearly if Chromium or Playwright is unavailable; do not turn a blocked test into a pass.
6. Update `docs/test-execution-report.md` with verified counts, date, evidence and risks after review.
7. Create a defect using `docs/defect-template.md` for reproducible product gaps. Separate product bug from test/tool/environment issue.
8. Report which tests **actually ran**. AI or MCP can assist exploration only with human approval and without real credentials.
