# Automated test case matrix

This document is generated from runnable test definitions using `node scripts/generate-case-matrix.js`. It indexes **authored** cases; verified pass counts are stated only in [the execution report](test-execution-report.md).

## API core / booking (24)

| ID | Scenario / assertion | Requirement | Source |
| --- | --- | --- | --- |
| TC-API-001 | health reports local healthy demo | BR-18 | `tests/api/booking.test.js` |
| TC-OFF-001 | offer API contract includes fare, currency and capacity | BR-01 | `tests/api/booking.test.js` |
| TC-BOOK-001 | create booking reserves seat and uses PENDING_PAYMENT | BR-02 / BR-04 | `tests/api/booking.test.js` |
| TC-BOOK-002 | fetch returns only requested booking | BR-02 / BR-04 | `tests/api/booking.test.js` |
| TC-BOOK-003 | trim names and normalize email | BR-02 / BR-04 | `tests/api/booking.test.js` |
| TC-BOOK-004 | client cannot set fare or currency | BR-02 / BR-04 | `tests/api/booking.test.js` |
| TC-BOOK-005 | reject missing passenger | BR-02 / BR-04 | `tests/api/booking.test.js` |
| TC-BOOK-006 | reject blank first name | BR-02 / BR-04 | `tests/api/booking.test.js` |
| TC-BOOK-007 | reject non-string name | BR-02 / BR-04 | `tests/api/booking.test.js` |
| TC-BOOK-008 | reject name longer than 60 characters (boundary) | BR-02 / BR-04 | `tests/api/booking.test.js` |
| TC-BOOK-009 | accept name exactly 60 characters (boundary) | BR-02 / BR-04 | `tests/api/booking.test.js` |
| TC-BOOK-010 | reject invalid email format | BR-02 / BR-04 | `tests/api/booking.test.js` |
| TC-BOOK-011 | reject unknown offer ID | BR-02 / BR-04 | `tests/api/booking.test.js` |
| TC-BOOK-012 | reject non-object JSON body | BR-02 / BR-04 | `tests/api/booking.test.js` |
| TC-BOOK-013 | reject malformed JSON | BR-02 / BR-04 | `tests/api/booking.test.js` |
| TC-BOOK-014 | missing booking returns 404 | BR-02 / BR-04 | `tests/api/booking.test.js` |
| TC-BOOK-015 | sold out after finite capacity is consumed | BR-02 / BR-04 | `tests/api/booking.test.js` |
| TC-BOOK-016 | cancel pending booking restores seat | BR-02 / BR-04 | `tests/api/booking.test.js` |
| TC-BOOK-017 | cancelled booking cannot be cancelled twice | BR-02 / BR-04 | `tests/api/booking.test.js` |
| TC-BOOK-018 | confirmed booking cannot be cancelled | BR-02 / BR-04 | `tests/api/booking.test.js` |
| TC-BOOK-019 | refund requires confirmed state | BR-02 / BR-04 | `tests/api/booking.test.js` |
| TC-BOOK-020 | refund confirmed booking and restore availability per demo rule | BR-02 / BR-04 | `tests/api/booking.test.js` |
| TC-BOOK-021 | unknown route responds 404 | BR-02 / BR-04 | `tests/api/booking.test.js` |
| TC-BOOK-022 | large request payload is rejected | BR-02 / BR-04 | `tests/api/booking.test.js` |

## Payment and webhook (19)

| ID | Scenario / assertion | Requirement | Source |
| --- | --- | --- | --- |
| TC-PAY-001 | valid signed PAID webhook confirms booking | BR-07 / BR-09 | `tests/api/payment.test.js` |
| TC-PAY-002 | valid signed FAILED webhook marks payment failed | BR-07 / BR-09 | `tests/api/payment.test.js` |
| TC-PAY-003 | invalid HMAC signature rejects payment without changing booking | BR-07 / BR-09 | `tests/api/payment.test.js` |
| TC-PAY-004 | missing HMAC signature is rejected | BR-07 / BR-09 | `tests/api/payment.test.js` |
| TC-PAY-005 | duplicate webhook event is idempotent | BR-07 / BR-09 | `tests/api/payment.test.js` |
| TC-PAY-006 | same event ID with different payload is conflict | BR-07 / BR-09 | `tests/api/payment.test.js` |
| TC-PAY-007 | underpayment is rejected without changing state | BR-07 / BR-09 | `tests/api/payment.test.js` |
| TC-PAY-008 | overpayment is rejected without changing state | BR-07 / BR-09 | `tests/api/payment.test.js` |
| TC-PAY-009 | noninteger amount is invalid | BR-07 / BR-09 | `tests/api/payment.test.js` |
| TC-PAY-010 | unknown booking is rejected | BR-07 / BR-09 | `tests/api/payment.test.js` |
| TC-PAY-011 | unknown payment status is rejected | BR-07 / BR-09 | `tests/api/payment.test.js` |
| TC-PAY-012 | invalid event ID is rejected | BR-07 / BR-09 | `tests/api/payment.test.js` |
| TC-PAY-013 | second distinct payment callback after confirmed is rejected | BR-07 / BR-09 | `tests/api/payment.test.js` |
| TC-PAY-014 | payment cannot confirm cancelled booking | BR-07 / BR-09 | `tests/api/payment.test.js` |
| TC-PAY-015 | failed payment releases seat and allows cancellation | BR-07 / BR-09 | `tests/api/payment.test.js` |
| TC-PAY-016 | synthetic payment simulator confirms booking | BR-07 / BR-09 | `tests/api/payment.test.js` |
| TC-PAY-017 | synthetic payment simulator handles failed payment | BR-07 / BR-09 | `tests/api/payment.test.js` |
| TC-PAY-018 | synthetic payment simulator validates payload | BR-07 / BR-09 | `tests/api/payment.test.js` |
| TC-PAY-019 | synthetic payment simulator rejects unknown booking | BR-07 / BR-09 | `tests/api/payment.test.js` |

## Partner integration (4)

| ID | Scenario / assertion | Requirement | Source |
| --- | --- | --- | --- |
| TC-PARTNER-001 | success response contains valid mock offer | BR-15 | `tests/api/partner.test.js` |
| TC-PARTNER-002 | partner unavailable surfaces a 503 | BR-15 | `tests/api/partner.test.js` |
| TC-PARTNER-003 | invalid partner response surfaces a 502 | BR-15 | `tests/api/partner.test.js` |
| TC-PARTNER-004 | unknown mock scenario is rejected with 400 | BR-15 | `tests/api/partner.test.js` |

## Domain unit (8)

| ID | Scenario / assertion | Requirement | Source |
| --- | --- | --- | --- |
| TC-UNIT-001 | reject invalid names | BR-02 / BR-09 | `tests/domain/domain.test.js` |
| TC-UNIT-002 | email validation rejects malformed addresses | BR-02 / BR-09 | `tests/domain/domain.test.js` |
| TC-UNIT-003 | HMAC SHA-256 payload signature round-trip | BR-02 / BR-09 | `tests/domain/domain.test.js` |
| TC-UNIT-004 | malformed or absent signature rejected | BR-02 / BR-09 | `tests/domain/domain.test.js` |
| TC-UNIT-005 | domain starts at full capacity | BR-02 / BR-09 | `tests/domain/domain.test.js` |
| TC-UNIT-006 | independent domain instances have isolated booking state | BR-02 / BR-09 | `tests/domain/domain.test.js` |
| TC-UNIT-007 | cancellation releases capacity once | BR-02 / BR-09 | `tests/domain/domain.test.js` |
| TC-UNIT-008 | unknown booking never changes state | BR-02 / BR-09 | `tests/domain/domain.test.js` |

## Playwright UI (8)

| ID | Scenario / assertion | Requirement | Source |
| --- | --- | --- | --- |
| TC-UI-001 | loads offer, fare and available capacity | BR-16 | `tests/ui/booking-flow.test.js` |
| TC-UI-002 | required fields show meaningful validation feedback | BR-16 | `tests/ui/booking-flow.test.js` |
| TC-UI-003 | create booking shows ID and PENDING_PAYMENT | BR-16 | `tests/ui/booking-flow.test.js` |
| TC-UI-004 | successful simulated payment confirms and enables refund | BR-16 | `tests/ui/booking-flow.test.js` |
| TC-UI-005 | refund changes booking to REFUNDED and restores seat | BR-16 | `tests/ui/booking-flow.test.js` |
| TC-UI-006 | failed payment can be cancelled | BR-16 | `tests/ui/booking-flow.test.js` |
| TC-UI-007 | cancel pending booking restores seat | BR-16 | `tests/ui/booking-flow.test.js` |
| TC-UI-008 | backend rejects invalid email and UI reports response | BR-16 | `tests/ui/booking-flow.test.js` |

**Total automated scenarios authored: 63.** API/domain pass result and UI execution status are tracked separately.