# QA workflow - from requirement to release evidence

This is a **documented personal workflow**, inspired by generic software testing practice, not a copy of any employer's internal SOP.

1. **Requirement intake:** Read story and acceptance criteria. Identify roles, dependencies, state transitions, data contracts and business risks.
2. **Risk review:** Prioritize pricing, payment, booking persistence, authorization assumptions, duplicate callbacks and inconsistent inventory.
3. **Test design:** Write scenarios, decision tables, boundary values, positive/negative test cases and synthetic data. Link to BR IDs.
4. **Preparation:** Verify environment, mock partner responses, test isolation and readiness; never use customer credentials.
5. **Smoke:** Verify health, offer, booking and signed payment path. Block regression on a critical smoke failure.
6. **Functional and integration:** Validate endpoint codes/body, state changes, payment status transitions, cancellation/refund and error contracts.
7. **Regression:** Run API/domain suite and, on a browser-ready machine, Playwright journeys; classify failures as product bugs, test bugs or environment blockers.
8. **Defect management:** Record actual vs expected, evidence, impact, reproduce, triage with owner and retest after fix.
9. **Reporting:** Consolidate pass/fail/not-run, critical blockers, evidence, residual risks and release readiness.
10. **Continuous improvement:** Update scripts, fixtures and rules only after review; use AI tools for acceleration but verify every generated assertion.

## Two-member QC team coordination - how to explain professional experience

In professional QA work (not in this solo demo), coordinating two QC members can cover test distribution by module, reviewing scenario completeness, supporting blockers, consolidating progress, and helping PM/BA/Dev prioritize release risks. Do not imply that two people worked on this fictional personal repository.

## Definition of Done for a test case

- Clear scenario and BR link.
- Repeatable preconditions and isolated test data.
- Atomic steps and measurable expected results.
- Outcome captured with timestamp, environment and evidence.
- Defect ID linked if failed; blocked/not run are not counted as passed.