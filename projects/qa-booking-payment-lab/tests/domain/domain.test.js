'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { OFFER, ApiError, DemoBookingDomain, isName, isEmail, signPayload, verifySignature } = require('../../src/domain');
const person = { firstName: 'An', lastName: 'Nguyen', email: 'an@example.test' };

test('TC-UNIT-001 | reject invalid names', () => {
  assert.equal(isName('A'), true); assert.equal(isName('A'.repeat(60)), true);
  assert.equal(isName(''), false); assert.equal(isName(10), false); assert.equal(isName('a'.repeat(61)), false);
});
test('TC-UNIT-002 | email validation rejects malformed addresses', () => {
  assert.equal(isEmail('an@example.test'), true); assert.equal(isEmail('none'), false);
  assert.equal(isEmail('x'.repeat(120) + '@example.test'), false);
});
test('TC-UNIT-003 | HMAC SHA-256 payload signature round-trip', () => {
  const raw = JSON.stringify({ example: 1 });
  const hash = signPayload(raw, 'secret');
  assert.equal(hash.length, 64); assert.equal(verifySignature(raw, hash, 'secret'), true);
  assert.equal(verifySignature(raw + 'x', hash, 'secret'), false);
});
test('TC-UNIT-004 | malformed or absent signature rejected', () => {
  assert.equal(verifySignature('{}', 'xx', 'secret'), false);
  assert.equal(verifySignature('{}', null, 'secret'), false);
});
test('TC-UNIT-005 | domain starts at full capacity', () => {
  const domain = new DemoBookingDomain();
  assert.equal(domain.getOffer().seatsAvailable, OFFER.capacity);
});
test('TC-UNIT-006 | independent domain instances have isolated booking state', () => {
  const a = new DemoBookingDomain(); const b = new DemoBookingDomain();
  a.createBooking({ offerId: OFFER.id, passenger: person });
  assert.equal(a.getOffer().seatsAvailable, OFFER.capacity - 1);
  assert.equal(b.getOffer().seatsAvailable, OFFER.capacity);
});
test('TC-UNIT-007 | cancellation releases capacity once', () => {
  const d = new DemoBookingDomain(); const b = d.createBooking({ offerId: OFFER.id, passenger: person });
  d.cancelBooking(b.id); assert.equal(d.getOffer().seatsAvailable, OFFER.capacity);
  assert.throws(() => d.cancelBooking(b.id), err => err instanceof ApiError && err.status === 409);
  assert.equal(d.getOffer().seatsAvailable, OFFER.capacity);
});
test('TC-UNIT-008 | unknown booking never changes state', () => {
  const d = new DemoBookingDomain();
  assert.throws(() => d.getBooking('missing'), err => err.status === 404);
  assert.equal(d.bookings.size, 0);
});
