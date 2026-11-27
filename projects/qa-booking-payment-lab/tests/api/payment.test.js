'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { withServer, createBooking, post, webhook, lookup } = require('../helpers/test-server');
const tc = (id, name, fn) => test(`${id} | ${name}`, () => withServer(fn));
const event = (b, id, status = 'PAID', amount = b.amount) => ({ eventId: id, bookingId: b.id, amount, status });

tc('TC-PAY-001', 'valid signed PAID webhook confirms booking', async base => {
  const b = await createBooking(base); const res = await webhook(base, event(b, 'paid-1'));
  assert.equal(res.status, 200); assert.deepEqual(await res.json(), { processed: true, duplicate: false, bookingStatus: 'CONFIRMED' });
  assert.equal((await lookup(base, b.id)).status, 'CONFIRMED');
});
tc('TC-PAY-002', 'valid signed FAILED webhook marks payment failed', async base => {
  const b = await createBooking(base); const res = await webhook(base, event(b, 'fail-1', 'FAILED'));
  assert.equal(res.status, 200); assert.equal((await lookup(base, b.id)).status, 'PAYMENT_FAILED');
});
tc('TC-PAY-003', 'invalid HMAC signature rejects payment without changing booking', async base => {
  const b = await createBooking(base); const res = await webhook(base, event(b, 'bad-sign'), 'wrong');
  assert.equal(res.status, 401); assert.equal((await lookup(base, b.id)).status, 'PENDING_PAYMENT');
});
tc('TC-PAY-004', 'missing HMAC signature is rejected', async base => {
  const b = await createBooking(base);
  const res = await post(base, '/api/payments/webhook', event(b, 'no-sign'));
  assert.equal(res.status, 401);
});
tc('TC-PAY-005', 'duplicate webhook event is idempotent', async base => {
  const b = await createBooking(base), e = event(b, 'evt-duplicate');
  assert.equal((await webhook(base, e)).status, 200);
  const replay = await webhook(base, e);
  assert.equal(replay.status, 200); assert.deepEqual(await replay.json(), { processed: false, duplicate: true });
});
tc('TC-PAY-006', 'same event ID with different payload is conflict', async base => {
  const b = await createBooking(base);
  await webhook(base, event(b, 'event-reused'));
  const res = await webhook(base, event(b, 'event-reused', 'FAILED'));
  assert.equal(res.status, 409); assert.equal((await res.json()).error, 'event_id_conflict');
});
tc('TC-PAY-007', 'underpayment is rejected without changing state', async base => {
  const b = await createBooking(base);
  const res = await webhook(base, event(b, 'underpaid', 'PAID', b.amount - 1));
  assert.equal(res.status, 422); assert.equal((await lookup(base, b.id)).status, 'PENDING_PAYMENT');
});
tc('TC-PAY-008', 'overpayment is rejected without changing state', async base => {
  const b = await createBooking(base);
  const res = await webhook(base, event(b, 'overpaid', 'PAID', b.amount + 1));
  assert.equal(res.status, 422); assert.equal((await lookup(base, b.id)).status, 'PENDING_PAYMENT');
});
tc('TC-PAY-009', 'noninteger amount is invalid', async base => {
  const b = await createBooking(base);
  const res = await webhook(base, event(b, 'amount-string', 'PAID', String(b.amount)));
  assert.equal(res.status, 400);
});
tc('TC-PAY-010', 'unknown booking is rejected', async base => {
  const res = await webhook(base, { eventId: 'unknown-booking', bookingId: 'none', status: 'PAID', amount: 1250000 });
  assert.equal(res.status, 404);
});
tc('TC-PAY-011', 'unknown payment status is rejected', async base => {
  const b = await createBooking(base);
  const res = await webhook(base, event(b, 'invalid-status', 'PROCESSING'));
  assert.equal(res.status, 400);
});
tc('TC-PAY-012', 'invalid event ID is rejected', async base => {
  const b = await createBooking(base);
  const res = await webhook(base, event(b, 'bad event id'));
  assert.equal(res.status, 400);
});
tc('TC-PAY-013', 'second distinct payment callback after confirmed is rejected', async base => {
  const b = await createBooking(base);
  await webhook(base, event(b, 'one-confirm'));
  const res = await webhook(base, event(b, 'two-confirm', 'FAILED'));
  assert.equal(res.status, 409);
});
tc('TC-PAY-014', 'payment cannot confirm cancelled booking', async base => {
  const b = await createBooking(base);
  await post(base, `/api/bookings/${b.id}/cancel`, {});
  const res = await webhook(base, event(b, 'after-cancel'));
  assert.equal(res.status, 409);
});
tc('TC-PAY-015', 'failed payment releases seat and allows cancellation', async base => {
  const b = await createBooking(base);
  await webhook(base, event(b, 'fail-then-cancel', 'FAILED'));
  assert.equal((await post(base, `/api/bookings/${b.id}/cancel`, {})).status, 200);
  assert.equal((await lookup(base, b.id)).status, 'CANCELLED');
});
tc('TC-PAY-016', 'synthetic payment simulator confirms booking', async base => {
  const b = await createBooking(base);
  const res = await post(base, '/api/demo/payments', { bookingId: b.id, status: 'PAID' });
  assert.equal(res.status, 200); assert.equal((await lookup(base, b.id)).status, 'CONFIRMED');
});
tc('TC-PAY-017', 'synthetic payment simulator handles failed payment', async base => {
  const b = await createBooking(base);
  const res = await post(base, '/api/demo/payments', { bookingId: b.id, status: 'FAILED' });
  assert.equal(res.status, 200); assert.equal((await lookup(base, b.id)).status, 'PAYMENT_FAILED');
});
tc('TC-PAY-018', 'synthetic payment simulator validates payload', async base => {
  const res = await post(base, '/api/demo/payments', { bookingId: 'none', status: 'INVALID' });
  assert.equal(res.status, 400);
});
tc('TC-PAY-019', 'synthetic payment simulator rejects unknown booking', async base => {
  const res = await post(base, '/api/demo/payments', { bookingId: 'none', status: 'PAID' });
  assert.equal(res.status, 404);
});
