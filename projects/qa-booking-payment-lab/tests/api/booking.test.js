'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { OFFER } = require('../../src/domain');
const { PASSENGER, withServer, post, postRaw, createBooking, lookup, webhook } = require('../helpers/test-server');

const tc = (id, name, fn) => test(`${id} | ${name}`, () => withServer(fn));

tc('TC-API-001', 'health reports local healthy demo', async base => {
  const res = await fetch(base + '/health'); assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { status: 'ok', system: 'synthetic-qa-booking-demo' });
});
tc('TC-OFF-001', 'offer API contract includes fare, currency and capacity', async base => {
  const res = await fetch(base + '/api/offers');
  assert.equal(res.status, 200);
  const { offers } = await res.json();
  assert.equal(offers.length, 1); assert.equal(offers[0].id, OFFER.id);
  assert.equal(offers[0].amount, OFFER.amount); assert.equal(offers[0].currency, 'VND');
  assert.equal(offers[0].seatsAvailable, OFFER.capacity);
});
tc('TC-BOOK-001', 'create booking reserves seat and uses PENDING_PAYMENT', async base => {
  const booking = await createBooking(base);
  assert.match(booking.id, /^[0-9a-f-]{36}$/); assert.equal(booking.status, 'PENDING_PAYMENT');
  assert.equal(booking.amount, OFFER.amount); assert.equal(booking.currency, 'VND');
  const offer = await (await fetch(base + '/api/offers')).json();
  assert.equal(offer.offers[0].seatsAvailable, OFFER.capacity - 1);
});
tc('TC-BOOK-002', 'fetch returns only requested booking', async base => {
  const booking = await createBooking(base);
  assert.deepEqual(await lookup(base, booking.id), booking);
});
tc('TC-BOOK-003', 'trim names and normalize email', async base => {
  const data = await createBooking(base, { firstName: '  An ', lastName: ' Nguyen  ', email: 'AN@EXAMPLE.TEST' });
  assert.equal(data.passenger.firstName, 'An'); assert.equal(data.passenger.lastName, 'Nguyen'); assert.equal(data.passenger.email, 'an@example.test');
});
tc('TC-BOOK-004', 'client cannot set fare or currency', async base => {
  const b = await createBooking(base, PASSENGER, { amount: 1, currency: 'USD' });
  assert.equal(b.amount, OFFER.amount); assert.equal(b.currency, 'VND');
});
tc('TC-BOOK-005', 'reject missing passenger', async base => {
  const res = await post(base, '/api/bookings', { offerId: OFFER.id });
  assert.equal(res.status, 400); assert.equal((await res.json()).error, 'invalid_passenger');
});
tc('TC-BOOK-006', 'reject blank first name', async base => {
  const res = await post(base, '/api/bookings', { offerId: OFFER.id, passenger: { ...PASSENGER, firstName: ' ' } });
  assert.equal(res.status, 400);
});
tc('TC-BOOK-007', 'reject non-string name', async base => {
  const res = await post(base, '/api/bookings', { offerId: OFFER.id, passenger: { ...PASSENGER, lastName: 100 } });
  assert.equal(res.status, 400);
});
tc('TC-BOOK-008', 'reject name longer than 60 characters (boundary)', async base => {
  const res = await post(base, '/api/bookings', { offerId: OFFER.id, passenger: { ...PASSENGER, firstName: 'A'.repeat(61) } });
  assert.equal(res.status, 400);
});
tc('TC-BOOK-009', 'accept name exactly 60 characters (boundary)', async base => {
  const b = await createBooking(base, { ...PASSENGER, firstName: 'A'.repeat(60) });
  assert.equal(b.passenger.firstName.length, 60);
});
tc('TC-BOOK-010', 'reject invalid email format', async base => {
  const res = await post(base, '/api/bookings', { offerId: OFFER.id, passenger: { ...PASSENGER, email: 'not-email' } });
  assert.equal(res.status, 400);
});
tc('TC-BOOK-011', 'reject unknown offer ID', async base => {
  const res = await post(base, '/api/bookings', { offerId: 'DOES-NOT-EXIST', passenger: PASSENGER });
  assert.equal(res.status, 404); assert.equal((await res.json()).error, 'offer_not_found');
});
tc('TC-BOOK-012', 'reject non-object JSON body', async base => {
  const res = await post(base, '/api/bookings', ['invalid']);
  assert.equal(res.status, 400); assert.equal((await res.json()).error, 'invalid_request');
});
tc('TC-BOOK-013', 'reject malformed JSON', async base => {
  const res = await postRaw(base, '/api/bookings', '{broken');
  assert.equal(res.status, 400); assert.equal((await res.json()).error, 'invalid_json');
});
tc('TC-BOOK-014', 'missing booking returns 404', async base => {
  const res = await fetch(base + '/api/bookings/never-existed');
  assert.equal(res.status, 404); assert.equal((await res.json()).error, 'booking_not_found');
});
tc('TC-BOOK-015', 'sold out after finite capacity is consumed', async base => {
  for (let i = 0; i < OFFER.capacity; i++) await createBooking(base);
  const res = await post(base, '/api/bookings', { offerId: OFFER.id, passenger: PASSENGER });
  assert.equal(res.status, 409); assert.equal((await res.json()).error, 'offer_sold_out');
});
tc('TC-BOOK-016', 'cancel pending booking restores seat', async base => {
  const b = await createBooking(base);
  const res = await post(base, `/api/bookings/${b.id}/cancel`, {});
  assert.equal(res.status, 200); assert.equal((await res.json()).status, 'CANCELLED');
  assert.equal((await (await fetch(base + '/api/offers')).json()).offers[0].seatsAvailable, OFFER.capacity);
});
tc('TC-BOOK-017', 'cancelled booking cannot be cancelled twice', async base => {
  const b = await createBooking(base);
  await post(base, `/api/bookings/${b.id}/cancel`, {});
  const res = await post(base, `/api/bookings/${b.id}/cancel`, {});
  assert.equal(res.status, 409); assert.equal((await res.json()).error, 'invalid_status_transition');
});
tc('TC-BOOK-018', 'confirmed booking cannot be cancelled', async base => {
  const b = await createBooking(base);
  await webhook(base, { eventId: 'confirmed', bookingId: b.id, amount: b.amount, status: 'PAID' });
  const res = await post(base, `/api/bookings/${b.id}/cancel`, {});
  assert.equal(res.status, 409);
});
tc('TC-BOOK-019', 'refund requires confirmed state', async base => {
  const b = await createBooking(base);
  const res = await post(base, `/api/bookings/${b.id}/refund`, {});
  assert.equal(res.status, 409);
});
tc('TC-BOOK-020', 'refund confirmed booking and restore availability per demo rule', async base => {
  const b = await createBooking(base);
  await webhook(base, { eventId: 'paid-refund', bookingId: b.id, amount: b.amount, status: 'PAID' });
  const res = await post(base, `/api/bookings/${b.id}/refund`, {});
  assert.equal(res.status, 200); assert.equal((await res.json()).status, 'REFUNDED');
  assert.equal((await (await fetch(base + '/api/offers')).json()).offers[0].seatsAvailable, OFFER.capacity);
});
tc('TC-BOOK-021', 'unknown route responds 404', async base => {
  const res = await fetch(base + '/api/secret');
  assert.equal(res.status, 404); assert.equal((await res.json()).error, 'route_not_found');
});
tc('TC-BOOK-022', 'large request payload is rejected', async base => {
  const res = await post(base, '/api/bookings', { offerId: OFFER.id, passenger: { ...PASSENGER, filler: 'Z'.repeat(35000) } });
  assert.equal(res.status, 413); assert.equal((await res.json()).error, 'request_too_large');
});
