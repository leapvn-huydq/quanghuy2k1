# Claude Code guidelines - QA Automation Portfolio

This is a **personal fictional QA sandbox**, NOT a customer repository. Never infer or request customer URLs, credentials, private project names or payment account data.

## Architecture and commands

- `src/domain.js`: business rules, states, seat capacity, HMAC and event idempotency.
- `src/server.js`: local-only API and static assets.
- `src/public/`: demo UI, contains no live integration.
- `tests/api/`, `tests/domain/`: 55 verified tests in Node test runner; `npm run test:api`.
- `tests/ui/`: 8 Playwright browser tests; `npm install && npx playwright install chromium && npm run test:ui`.
- `docs/requirements.md`: source of truth for fictional acceptance criteria.
- `docs/test-case-matrix.md`: generated inventory; refresh using `node scripts/generate-case-matrix.js`.
- `docs/test-execution-report.md`: only write verified outcomes, distinguishing API vs browser.

## Quality requirements

1. Understand the requested business rule and relevant `BR-XX` before coding.
2. Prefer adding a new `TC-...` with a measurable expected result and synthetic data.
3. Make test setup isolated; do not share mutated domain state between tests.
4. Do not change expected behavior to force a failing test to pass. Raise and document the discrepancy.
5. Protect signed webhooks, exact amount and idempotent callback behavior.
6. Always run `npm run lint` and `npm run test:api`; run browser tests if browser access is permitted.
7. Document real results (PASS/FAIL/BLOCKED/NOT RUN); never invent percentages or screenshots.
8. Limit browser/CI operations to local synthetic service. No destructive client/production operations.
9. Do not add paid services, external API calls or secret files.
10. Keep Cursor/MCP integrations optional, safe and separate from tests that must run without AI.

## Suggested authoring workflow

`Requirement -> risk -> scenarios -> manual test cases -> automation selection -> implementation -> actual execution -> evidence/report -> code review`

When asked to add a feature, produce: (a) BR update, (b) test scenarios/cases, (c) code/test change, (d) test result, (e) docs update. Validate claims before presenting completion.
