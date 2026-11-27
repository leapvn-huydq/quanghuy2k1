'use strict';

const assert = require('node:assert/strict');
const { createHmac } = require('node:crypto');
const { createAppServer } = require('../../src/server');

const SECRET = 'synthetic-local-test-secret';
const PASSENGER = Object.freeze({ firstName: 'An', lastName: 'Nguyen', email: 'an@example.test' });

async function withServer(run) {
  const { server } = createAppServer({ webhookSecret: SECRET });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try { return await run(base); }
  finally { await new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve())); }
}

function post(base, route, data, headers = {}) {
  return fetch(base + route, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(data) });
}

async function postRaw(base, route, raw, headers = {}) {
  return fetch(base + route, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: raw });
}

async function createBooking(base, passenger = PASSENGER, data = {}) {
  const response = await post(base, '/api/bookings', { offerId: 'DEMO-FLIGHT-001', passenger, ...data });
  assert.equal(response.status, 201, `Expected booking 201 but got ${response.status}`);
  return response.json();
}

function signatureFor(raw) { return createHmac('sha256', SECRET).update(raw, 'utf8').digest('hex'); }

async function webhook(base, event, signature) {
  const raw = typeof event === 'string' ? event : JSON.stringify(event);
  return postRaw(base, '/api/payments/webhook', raw, { 'x-demo-signature': signature === undefined ? signatureFor(raw) : signature });
}

async function lookup(base, id) {
  const response = await fetch(base + `/api/bookings/${encodeURIComponent(id)}`);
  assert.equal(response.status, 200);
  return response.json();
}

module.exports = { SECRET, PASSENGER, withServer, post, postRaw, createBooking, signatureFor, webhook, lookup };
