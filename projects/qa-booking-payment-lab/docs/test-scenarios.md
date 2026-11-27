# Manual test scenarios and exploratory charters

Each row is independently reviewable even without an automation script. Test case steps in [`test-case-examples.md`](test-case-examples.md) demonstrate the full template.

| Scenario ID | Priority | Module | Scenario and expected outcome | Technique |
| --- | --- | --- | --- | --- |
| SC-OFF-01 | P0 | Offers | Valid offer includes ID, VND fare and seats >=0 | Contract |
| SC-OFF-02 | P1 | Offers | Simulated partner 503 surfaces an appropriate error | Negative |
| SC-OFF-03 | P1 | Offers | Invalid partner response maps to 502 | Negative |
| SC-BOOK-01 | P0 | Booking | Valid passenger creates pending booking and holds a seat | Positive / E2E |
| SC-BOOK-02 | P0 | Booking | Amount injected by user is ignored by server | Security / contract |
| SC-BOOK-03 | P1 | Booking | Missing first/last names rejected | Equivalence classes |
| SC-BOOK-04 | P1 | Booking | Name lengths 0, 1, 60, 61 behave as specified | BVA |
| SC-BOOK-05 | P1 | Booking | Invalid email rejected without a booking | Equivalence classes |
| SC-BOOK-06 | P1 | Booking | Unknown offer and booking ID return 404 | Negative |
| SC-BOOK-07 | P0 | Inventory | Capacity limit blocks fourth booking | BVA / business rule |
| SC-BOOK-08 | P0 | Inventory | Cancellation releases exactly one seat | State transition |
| SC-BOOK-09 | P0 | Inventory | Duplicate cancellation does not release extra seats | Negative / idempotency |
| SC-BOOK-10 | P1 | Booking | Confirmed booking cannot be cancelled | State transition |
| SC-PAY-01 | P0 | Payments | Signed PAID event confirms pending booking | Positive |
| SC-PAY-02 | P0 | Payments | Signed FAILED event marks failed payment | State transition |
| SC-PAY-03 | P0 | Payments | Invalid HMAC blocks settlement | Security / negative |
| SC-PAY-04 | P0 | Payments | Missing signature blocks settlement | Security / negative |
| SC-PAY-05 | P0 | Payments | Exact replay does not change state twice | Idempotency |
| SC-PAY-06 | P0 | Payments | Same event ID with changed payload returns conflict | Negative |
| SC-PAY-07 | P0 | Payments | Under/overpayment rejects settlement | BVA / financial |
| SC-PAY-08 | P1 | Payments | Callback for missing booking rejected | Negative |
| SC-PAY-09 | P1 | Payments | Out-of-order event after confirmed/cancelled rejected | State transition |
| SC-PAY-10 | P1 | Payments | Payment failure and cancel maintain capacity | Multi-step |
| SC-REF-01 | P0 | Refund | Synthetic refund only after confirmed status | State transition |
| SC-REF-02 | P0 | Refund | Refunded booking returns to available stock (demo rule) | Business |
| SC-UI-01 | P1 | UI | Offer displays route, price and current availability | Exploratory |
| SC-UI-02 | P1 | UI | Empty required fields show actionable feedback | Negative / usability |
| SC-UI-03 | P1 | UI | Buttons enable only for permitted state changes | State transition |
| SC-UI-04 | P1 | UI | Booking ID and status remain readable on narrow screen | Responsive |
| SC-UI-05 | P2 | UI | Keyboard navigation and status feedback are usable | Accessibility exploratory |
| SC-DOC-01 | P1 | QA process | Test report matches actual suite result without fake passes | Evidence |
| SC-DOC-02 | P1 | QA process | Defect includes steps, expected vs actual, evidence | Process |

## Smoke suite selection

`TC-API-001`, `TC-OFF-001`, `TC-BOOK-001`, `TC-PAY-001`, `TC-PARTNER-001` provide quick API contract and golden-path confidence. Smoke does **not** replace full regression and is not sufficient for real money operations.

## Exploratory testing charter

As a QC engineer, explore how a user might recover from partial form completion, invalid email, a blocked payment button, a failed callback, browser back/navigation, and zero availability. Record assumptions and observations; do not mark exploratory charters as automated passes unless run manually and evidenced.