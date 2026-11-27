---
name: qa-test-designer
description: Create risk-based manual test scenarios and automation-ready test cases from fictional booking/payment requirements in this portfolio. Use when a BR changes or test coverage is requested.
---

# QA test designer

1. Read `docs/requirements.md` and identify the exact `BR-XX` plus assumptions.
2. Draft a scenario matrix with priority, valid/invalid data classes, boundaries, state transitions and integration failures.
3. Convert selected scenarios into atomic test cases: ID, objective, preconditions, test data, steps and measurable expected results.
4. Select smoke/regression candidates based on business risk and stable observability, not code convenience.
5. Update `docs/test-scenarios.md`, `docs/test-case-examples.md` and `docs/traceability.md` as appropriate.
6. Verify all names, fares, events and URLs are synthetic. Never copy from customer systems.
7. Present unanswered business questions separately; do not fabricate acceptance criteria.
