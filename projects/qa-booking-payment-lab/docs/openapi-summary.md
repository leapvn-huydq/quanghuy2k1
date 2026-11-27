# HTTP API contract reference

Base URL: `http://127.0.0.1:3100` when started with `npm start`. Automated API tests create isolated ephemeral ports. All requests and responses use JSON unless serving static assets.

| Method | Path | Request | Success | Error scenarios |
| --- | --- | --- | --- | --- |
| GET | `/health` | - | 200 `{status, system}` | - |
| GET | `/api/offers` | `?scenario=success` | 200 `{offers:[...]}` | 503 `partner_unavailable`, 502 `invalid_partner_response`, 400 unknown scenario |
| POST | `/api/bookings` | `{offerId, passenger:{firstName,lastName,email}}` | 201 with `id, amount, currency, status` | 400 invalid, 404 offer, 409 sold out, 413 large body |
| GET | `/api/bookings/:id` | - | 200 booking | 404 not found |
| POST | `/api/bookings/:id/cancel` | `{}` | 200 with status CANCELLED | 404 not found, 409 transition |
| POST | `/api/bookings/:id/refund` | `{}` | 200 with status REFUNDED | 404 not found, 409 transition |
| POST | `/api/payments/webhook` | Signed event with `eventId, bookingId, amount, status` | 200 `{processed,duplicate,bookingStatus?}` | 401 signature, 400 event, 404 booking, 409 replay conflict/transition, 422 amount |
| POST | `/api/demo/payments` | `{bookingId,status}` | 200 processing result | 400 invalid, 404 not found, 409 transition |

## Example request

```bash
curl -X POST http://127.0.0.1:3100/api/bookings \
  -H 'content-type: application/json' \
  -d '{"offerId":"DEMO-FLIGHT-001","passenger":{"firstName":"An","lastName":"Nguyen","email":"an@example.test"}}'
```

## Webhook signature

For a real request to `/api/payments/webhook`, calculate HMAC SHA-256 over the **exact serialized raw JSON bytes** using the synthetic `DEMO_WEBHOOK_SECRET` for the local server and provide hex digest in `x-demo-signature`. Tests use helper `tests/helpers/test-server.js` to sign events deterministically. The UI's `/api/demo/payments` helper simulates this internally for educational demonstrations; it does not contact a payment gateway.

## Response policy

- HTTP status correctly indicates success/error, with `{error: '<code>'}` for errors.
- IDs are random UUIDs and not associated with real customer bookings.
- No auth, persistence or multi-tenant isolation is implemented, by design; bind localhost only.