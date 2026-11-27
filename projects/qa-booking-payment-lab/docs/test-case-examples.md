# Detailed manual test case examples

## TC-BOOK-001 - Valid booking creates PENDING_PAYMENT

- **Priority:** P0
- **Technique:** Positive path and state transition
- **Preconditions:** Clean mock server, offer has >=1 available seat
- **Test data:** offer `DEMO-FLIGHT-001`, `An Nguyen`, `an@example.test`

| Step | Action | Expected result |
| --- | --- | --- |
| 1 | GET `/api/offers` | Returns HTTP 200 with offer ID and seats available |
| 2 | POST `/api/bookings` with offer ID and valid passenger | Returns HTTP 201 with UUID booking ID |
| 3 | Read response `status`, `amount`, `currency` | `PENDING_PAYMENT`, `1250000`, `VND` |
| 4 | GET `/api/bookings/{id}` | Same ID and booking status as step 3 |
| 5 | GET `/api/offers` | Seats available decreased by exactly 1 |

## TC-BOOK-015 - Booking fails when inventory is sold out

- **Priority:** P0; **Technique:** Boundary value / negative
- **Preconditions:** New mock server with capacity=3
- **Steps:** Create three valid bookings; attempt fourth with valid passenger.
- **Expected:** Fourth request returns HTTP 409 `offer_sold_out`, inventory remains 0, no additional reservation is created.

## TC-PAY-001 - Valid PAID webhook confirms booking

- **Priority:** P0; **Technique:** Positive + state transition
- **Preconditions:** Booking exists in `PENDING_PAYMENT`
- **Test data:** Unique event ID, exact booking amount, status `PAID`; HMAC signed with synthetic local secret.
- **Steps:** Build webhook JSON; sign raw bytes; POST to `/api/payments/webhook`; GET booking status.
- **Expected:** First callback returns HTTP 200 and `processed=true`; booking becomes `CONFIRMED`.

## TC-PAY-003 - Bad signature is rejected

- **Priority:** P0; **Technique:** Negative / integrity
- **Preconditions:** Pending booking exists
- **Steps:** POST otherwise valid webhook with invalid `x-demo-signature`.
- **Expected:** HTTP 401 `invalid_signature`, booking remains `PENDING_PAYMENT` and stock unchanged.

## TC-PAY-005 - Duplicate event is idempotent

- **Priority:** P0; **Technique:** Event idempotency
- **Preconditions:** Pending booking exists
- **Steps:** Send signed `PAID` webhook; resend **identical raw body and signature**.
- **Expected:** Initial event applied, replay returns HTTP 200 with `duplicate=true`, no second transition or extra reservation change.

## TC-BOOK-020 - Synthetic refund after paid status

- **Priority:** P0; **Technique:** State transition
- **Preconditions:** Booking is `CONFIRMED`
- **Steps:** POST `/api/bookings/{id}/refund`; GET booking; GET offer.
- **Expected:** `REFUNDED`; available seats restored to 3 per **demo-only** rule; no real payment gateway is called.

## General test-case template

```markdown
# TC-MODULE-XXX - <Scenario name>
Priority: P0/P1/P2 | Type: smoke/regression/negative | Requirement: BR-XX
Preconditions: <State, data, environment>
Test Data: <Synthetic values only>
Steps:
1. <Atomic action>
2. <Atomic action>
Expected:
1. <Observable result with API code, UI state or database validation>
2. <Observable result>
Actual / Evidence: <Run timestamp, log or screenshot>
Status: PASS / FAIL / BLOCKED / NOT RUN
Defect ID: <If any>
```