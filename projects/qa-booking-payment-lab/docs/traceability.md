# Requirements traceability matrix (RTM)

Trace each fictional business rule to test coverage. A test listed here is not necessarily executed; see [test execution report](test-execution-report.md).

| Requirement | Risk / expected behavior | Automated checks | Manual scenarios |
| --- | --- | --- | --- |
| BR-01 | Offer contract and seats | TC-OFF-001, TC-PARTNER-001, TC-UI-001 | SC-OFF-01 |
| BR-02 | Passenger validation and offer ID | TC-BOOK-003, 005-012, TC-UNIT-001/002, TC-UI-008 | SC-BOOK-03/04/05/06 |
| BR-03 | Server controls fare and currency | TC-BOOK-004 | SC-BOOK-02 |
| BR-04 | Pending booking and stock reservation | TC-BOOK-001/002, TC-UI-003 | SC-BOOK-01 |
| BR-05 | Sold-out inventory blocks bookings | TC-BOOK-015 | SC-BOOK-07 |
| BR-06 | Cancellation returns capacity once | TC-BOOK-016/017, TC-UNIT-007, TC-UI-007 | SC-BOOK-08/09 |
| BR-07 | PAID -> CONFIRMED | TC-PAY-001/016, TC-UI-004 | SC-PAY-01 |
| BR-08 | FAILED -> PAYMENT_FAILED | TC-PAY-002/015/017, TC-UI-006 | SC-PAY-02/10 |
| BR-09 | HMAC signature validation | TC-PAY-003/004, TC-UNIT-003/004 | SC-PAY-03/04 |
| BR-10 | Duplicate event handling | TC-PAY-005/006 | SC-PAY-05/06 |
| BR-11 | Exact amount validation | TC-PAY-007/008/009 | SC-PAY-07 |
| BR-12 | Valid status transitions | TC-PAY-013/014, TC-BOOK-017/018 | SC-PAY-09, SC-BOOK-10 |
| BR-13 | Refund only after confirmation | TC-BOOK-019/020, TC-UI-005 | SC-REF-01/02 |
| BR-14 | Appropriate HTTP failure codes | TC-BOOK-011/012/013/014/021/022, TC-PAY-010/011/012/018/019 | SC-BOOK-06 |
| BR-15 | Partner mock failure handling | TC-PARTNER-001/002/003/004 | SC-OFF-02/03 |
| BR-16 | UI input and action behavior | TC-UI-001..008 | SC-UI-01..05 |
| BR-17 | Synthetic data only | Repository content review / local-only data fixture | SC-DOC-01 |
| BR-18 | Isolated and safe test execution | TC-API-001, TC-UNIT-006, GitHub workflow review | SC-DOC-02 |

## Traceability review checklist

- Every acceptance criterion has at least one linked test or documented coverage gap.
- High-risk payment/stock rules have negative as well as positive coverage.
- Test data is fake, repeatable and isolated.
- Test results specify executed vs authored vs blocked.
- New or changed rules require updating the matrix and affected tests, not just the README.