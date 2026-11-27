'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { withServer } = require('../helpers/test-server');
const tc = (id, name, fn) => test(`${id} | ${name}`, () => withServer(fn));

tc('TC-PARTNER-001', 'success response contains valid mock offer', async base => {
  const res = await fetch(base + '/api/offers?scenario=success');
  assert.equal(res.status, 200); assert.equal((await res.json()).offers[0].id, 'DEMO-FLIGHT-001');
});
tc('TC-PARTNER-002', 'partner unavailable surfaces a 503', async base => {
  const res = await fetch(base + '/api/offers?scenario=unavailable');
  assert.equal(res.status, 503); assert.equal((await res.json()).error, 'partner_unavailable');
});
tc('TC-PARTNER-003', 'invalid partner response surfaces a 502', async base => {
  const res = await fetch(base + '/api/offers?scenario=invalid');
  assert.equal(res.status, 502); assert.equal((await res.json()).error, 'invalid_partner_response');
});
tc('TC-PARTNER-004', 'unknown mock scenario is rejected with 400', async base => {
  const res = await fetch(base + '/api/offers?scenario=timeout');
  assert.equal(res.status, 400); assert.equal((await res.json()).error, 'unsupported_mock_scenario');
});
