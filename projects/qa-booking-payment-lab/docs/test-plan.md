# QA Test Plan - Synthetic Booking and Payment

**Plan ID:** TP-QA-PORTFOLIO-001  
**Version:** 1.0  
**Author:** Duong Quang Huy  
**Product:** Local fictional booking and payment application  
**Test strategy:** Risk-first manual + automated regression

## Objectives

Verify that core booking and payment lifecycles meet acceptance criteria, invalid inputs and out-of-order events fail safely, inventory state remains consistent, and the app is testable through both API and UI layers. Demonstrate repeatable QA artifacts and practical reporting.

## In scope

Booking validation and offer inventory; positive/negative API contracts; payment HMAC verification; duplicate webhooks; amount mismatch; cancellation and fictional refund; partner success/503/502 simulations; UI behavior; test evidence and release readiness.

## Out of scope

Actual flight search/issuance, real eSIM/hotel integrations, real payment gateway, customer identity, production data, real multi-user concurrency, load/performance testing, penetration testing and distributed persistence.

## Test design techniques

- **Equivalence Partitioning:** valid/invalid name, email, offer and webhook values.
- **Boundary Value Analysis:** first/last-name lengths 0, 1, 60 and 61; seating capacity.
- **Decision Table:** payment status x signature x amount x existing booking/status.
- **State Transition Testing:** PENDING_PAYMENT -> CONFIRMED, FAILED, CANCELLED; CONFIRMED -> REFUNDED.
- **Risk-based Regression:** money-related, booking-state and duplicate event paths first.
- **Exploratory Testing:** browser feedback, disabled buttons, messaging and negative-path usability.

## Environments and test data

| Item | Value |
| --- | --- |
| API host | `127.0.0.1` with OS-assigned ephemeral test port |
| Optional interactive UI | `http://127.0.0.1:3100` |
| Data | `An Nguyen`, `an@example.test`, offer `DEMO-FLIGHT-001` |
| Currency / price | VND 1,250,000, fictional |
| Inventory | 3 seats, reset for each isolated server |
| Browser | Chromium via Playwright (separate suite) |
| Test runner | `node:test` for API/unit, Playwright API for browser |

## Entry criteria

Application starts successfully on loopback; test data exists in mock; requirements, expected outcomes and scope are documented; any required Playwright browser is available for UI suite.

## Exit criteria

- All P0 money and booking-state tests pass; no unresolved P0/P1 defect.
- Recorded API test results are reproducible.
- UI regression is run and passing where a browser is available; otherwise, the report explicitly marks it as not executed.
- Known limitations, evidence, and residual risks are documented.

## Defect process

Record test ID, environment, priority/severity, preconditions, steps, expected/actual, evidence, logs, suspected impact and retest outcome. Track status as New -> Triaged -> In Progress -> Fixed -> Retest -> Closed/Reopened. A failing test must not be modified to match a regression without reviewing the business requirement.

## Risk register

| Risk | Impact | Control |
| --- | --- | --- |
| Callback replay or double settlement | High | HMAC, idempotency and transition tests |
| Wrong amount or currency | High | Server-controlled pricing, mismatch tests |
| Inventory miscount | High | Reservation/cancel/refund capacity assertions |
| Browser not available in environment | Medium | Separate UI suite; record "not executed" honestly |
| AI-generated expected result incorrect | High | Human review against documented requirements |
| Test cross-contamination | Medium | New domain/server for each test |

## Roles

In this personal portfolio, a single author acts as QA analyst, automation implementer and reviewer. This is **not a claim that the personal demo includes a live QC team**. Experience coordinating a two-member QC team belongs to the professional work-history section of the CV.