# QA Automation Portfolio - Booking & Payment Quality Lab

**Duong Quang Huy** | QA/QC Engineer | Manual QA, API Testing, Playwright, CI and AI-enabled QC workflows

> **Independent personal project.** This repository is a fictional QA testing sandbox. It does not use, copy, connect to, or represent any client/company website, system, source code, test account or production data.

## Project description

A local-only travel booking sandbox, built from scratch for **end-to-end quality assurance practice**. It includes a realistic but simplified booking lifecycle, mock partner responses, synthetic payment callbacks with HMAC validation, an interactive browser UI, **55 verified automated API/domain tests**, **8 Playwright browser scenarios**, and QA deliverables from requirement analysis through release sign-off. AI workflow examples show how Cursor, Claude Code, rules, skills and MCP can assist a human QC engineer without replacing validation.

**Suggested GitHub repository description:**

> Personal QA Automation portfolio: Playwright UI + Node.js API tests, booking/payment webhook mocks, 55 verified tests, manual QA docs, CI and Cursor/Claude workflows.

### At a glance

| Category | Implementation |
| --- | --- |
| Scope | Fictional flight booking, payment callback, refund/cancel and partner API failure testing |
| Manual QA | Business rules, test plan, scenario matrix, test case catalog, risk analysis, defect and release documents |
| API and domain regression | **55/55 PASS**, executed with Node.js built-in test runner (local verification) |
| UI automation | **8 Playwright test scripts**, separate browser suite; run on a machine/CI with an allowed browser |
| Technologies | JavaScript, Node.js 20+, Playwright, REST/JSON, HMAC SHA-256, GitHub Actions |
| AI workflow | Cursor project rules, two reusable Cursor skills, Claude Code instructions, MCP example (no secrets) |
| Infrastructure | Localhost HTTP API and in-memory storage; no external APIs, credentials or paid services |

## Visual demo

Start the service with `npm start`, then open **http://127.0.0.1:3100**. It has a deliberately fictional airline offer, a passenger form, and controls to simulate payment confirmation, failure, cancellation and refunds. Each action updates booking state and seat availability through the API.

This app is **not deployed online**. A GitHub source repository does not automatically host a dynamic Node.js API. A production deployment would require a separate hosting decision, configuration and security review.

## Project architecture

```text
Web browser (vanilla JS + CSS)
      |
      v
Node.js REST API on 127.0.0.1
      |
      +--> Offer simulator (success / invalid response / unavailable)
      +--> Booking domain (capacity, validation, lifecycle)
      +--> Synthetic payment webhook (HMAC, duplicate protection)
      +--> Local demo payment controls (no actual money)
      |
      v
In-memory Maps (reset on every server restart)

Test layers:
  Node.js API tests --> local HTTP endpoints + response contracts
  Domain unit tests --> validation, HMAC and state rules
  Playwright UI tests --> browser journey, status, form validation
  GitHub Actions --> syntax check, API report, browser test workflow
```

Read [System architecture and business rules](docs/architecture.md) for the state-transition diagram and detailed design.

## Quick start

Requirements: **Node.js 20+**; API tests have **no external package dependency**.

```bash
# Run local mock app
npm start
# Open http://127.0.0.1:3100

# Run the complete verified API/domain regression offline
npm run test:api

# Run a smoke subset
npm run test:smoke

# Generate machine-readable and text execution reports
npm run test:report

# Validate JavaScript syntax
npm run lint
```

**UI automation requires Playwright** and a browser runtime:

```bash
npm install
npx playwright install chromium
npm run test:ui
```

For environments where Chromium is installed separately, set `CHROMIUM_EXECUTABLE` to the executable path and run `npm run test:ui`. No actual airline/payment provider is called. Playwright test scripts run a fresh ephemeral server per test, so test data does not leak between scenarios.

GitHub Actions is defined under [`.github/workflows/ci.yml`](.github/workflows/ci.yml) and is **not scheduled**; it runs on pushes, pull requests and manual invocation, using only the synthetic test system.

## Manual QA documentation

| Artifact | Purpose |
| --- | --- |
| [HTTP API contract](docs/openapi-summary.md) | Endpoints, example payload and error codes |
| [Requirements and business rules](docs/requirements.md) | Functional rules, validations, failure states, assumptions |
| [Test plan](docs/test-plan.md) | Scope, approach, environment, entry/exit criteria, risks |
| [Test scenario catalog](docs/test-scenarios.md) | Manual scenario coverage for booking, payments, inventory, negative paths |
| [Automated case matrix](docs/test-case-matrix.md) | ID and intent of every automated check |
| [Detailed sample test cases](docs/test-case-examples.md) | Preconditions, test data, steps and expected results |
| [Traceability](docs/traceability.md) | Requirement-to-test mapping |
| [Test execution report](docs/test-execution-report.md) | Verified status, limitations, defects and release recommendation |
| [Defect template](docs/defect-template.md) | Reproduction, expected/actual, evidence, severity and priority |
| [Release readiness checklist](docs/release-readiness.md) | QA sign-off evidence and open-risk review |
| [Automation strategy](docs/automation-strategy.md) | Scope selection, CI design and maintainability |

## AI-enabled QA workflow

This portfolio deliberately includes **human-reviewed instructions**, not a claim that AI can approve every change or test customer production systems without checks.

- [Cursor rules](.cursor/rules/qa-workflow.mdc): requirements analysis, test design, execution and reporting standards.
- [Cursor skill - QA test designer](.cursor/skills/qa-test-designer/SKILL.md): turn rules into a scenario matrix and atomic test cases.
- [Cursor skill - QC test runner](.cursor/skills/qa-test-runner/SKILL.md): select an existing suite, run locally, attach evidence and draft a factual summary.
- [Claude Code guide](CLAUDE.md): project structure and safety constraints for AI-assisted coding/debugging.
- [MCP example](.cursor/mcp.json.example): optional, placeholder configuration; no tokens, servers, credentials or customer endpoints.
- [QA operating workflow](docs/qa-workflow.md): from story/acceptance criteria through smoke, regression and release readiness.

## How this demonstrates my experience

This original demo translates areas from my QA work into a **safe and shareable learning project**: scenario design, regression and negative testing, booking/payment state logic, mocked integrations, browser/API automation, CI and documentation. It does not make the client's proprietary code public.

- [Resume-ready project description (English)](docs/cv-project-description.md)
- [Interview Q&A / how to explain the project (Vietnamese)](docs/interview-guide-vi.md)
- [Security and confidentiality scope](docs/safety.md)

## Limitations (intentional)

- No production payments, actual ticket issuance, airline inventory, real customer data or external integrations.
- No persistent database or production-ready authentication; every test runs against an in-memory sandbox.
- Refund is a **synthetic status transition**, not a gateway refund or bank transfer.
- This is a teaching/portfolio system, not a commerce platform.
- Only the 55 Node.js API/domain checks have been independently verified in the current working environment. UI browser checks require an environment without Chromium URL-blocking policy and should be run before claiming they passed.

## Author and contact

**Duong Quang Huy** - QA/QC Engineer, Ho Chi Minh City, Vietnam  
GitHub: [@leapvn-huydq](https://github.com/leapvn-huydq)  
Email: [duonghuy0304@gmail.com](mailto:duonghuy0304@gmail.com)

---

*Original fictional project. Built to demonstrate testing method, not access to any client code or live production system.*