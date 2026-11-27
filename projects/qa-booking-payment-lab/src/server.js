'use strict';

const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { ApiError, DemoBookingDomain, signPayload, verifySignature } = require('./domain');

const MAX_BODY_BYTES = 32 * 1024;
const PUBLIC_FILES = Object.freeze({
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/app.js': ['app.js', 'application/javascript; charset=utf-8'],
  '/styles.css': ['styles.css', 'text/css; charset=utf-8'],
});

function send(res, status, data) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(data));
}

async function readBody(req) {
  const chunks = [];
  let length = 0;
  for await (const chunk of req) {
    length += chunk.length;
    if (length > MAX_BODY_BYTES) throw new ApiError(413, 'request_too_large');
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  try { return { raw, json: JSON.parse(raw) }; }
  catch { throw new ApiError(400, 'invalid_json'); }
}

function createAppServer({ webhookSecret = 'DEMO_ONLY_CHANGE_ME' } = {}) {
  const domain = new DemoBookingDomain();
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://127.0.0.1');
      if (req.method === 'GET' && PUBLIC_FILES[url.pathname]) {
        const [file, mime] = PUBLIC_FILES[url.pathname];
        const content = await fs.readFile(path.join(__dirname, 'public', file));
        res.writeHead(200, { 'content-type': mime, 'cache-control': 'no-store' });
        return res.end(content);
      }
      if (req.method === 'GET' && url.pathname === '/health') {
        return send(res, 200, { status: 'ok', system: 'synthetic-qa-booking-demo' });
      }
      if (req.method === 'GET' && url.pathname === '/api/offers') {
        const scenario = url.searchParams.get('scenario') || 'success';
        if (scenario === 'unavailable') throw new ApiError(503, 'partner_unavailable');
        if (scenario === 'invalid') throw new ApiError(502, 'invalid_partner_response');
        if (scenario !== 'success') throw new ApiError(400, 'unsupported_mock_scenario');
        return send(res, 200, { offers: [domain.getOffer()] });
      }
      if (req.method === 'POST' && url.pathname === '/api/bookings') {
        const { json } = await readBody(req);
        return send(res, 201, domain.createBooking(json));
      }
      const bookingMatch = /^\/api\/bookings\/([a-zA-Z0-9-]+)$/.exec(url.pathname);
      if (req.method === 'GET' && bookingMatch) {
        return send(res, 200, domain.getBooking(bookingMatch[1]));
      }
      const cancelMatch = /^\/api\/bookings\/([a-zA-Z0-9-]+)\/cancel$/.exec(url.pathname);
      if (req.method === 'POST' && cancelMatch) {
        return send(res, 200, domain.cancelBooking(cancelMatch[1]));
      }
      const refundMatch = /^\/api\/bookings\/([a-zA-Z0-9-]+)\/refund$/.exec(url.pathname);
      if (req.method === 'POST' && refundMatch) {
        return send(res, 200, domain.refundBooking(refundMatch[1]));
      }
      if (req.method === 'POST' && url.pathname === '/api/payments/webhook') {
        const { raw, json } = await readBody(req);
        if (!verifySignature(raw, req.headers['x-demo-signature'], webhookSecret)) {
          throw new ApiError(401, 'invalid_signature');
        }
        return send(res, 200, domain.processPaymentEvent(json, raw));
      }
      // Local demo-only convenience endpoint: mimics a trusted payment sandbox,
      // never handles money, is never deployed to production and does not expose the secret.
      if (req.method === 'POST' && url.pathname === '/api/demo/payments') {
        const { json } = await readBody(req);
        if (!json || typeof json.bookingId !== 'string' || !['PAID', 'FAILED'].includes(json.status)) {
          throw new ApiError(400, 'invalid_demo_payment');
        }
        const booking = domain.getBooking(json.bookingId);
        const event = { eventId: `demo_${randomUUID()}`, bookingId: json.bookingId, amount: booking.amount, status: json.status };
        const raw = JSON.stringify(event);
        // Use the exact production-like event path, including an HMAC, internally.
        const signature = signPayload(raw, webhookSecret);
        if (!verifySignature(raw, signature, webhookSecret)) throw new ApiError(500, 'signature_self_check_failed');
        return send(res, 200, domain.processPaymentEvent(event, raw));
      }
      throw new ApiError(404, 'route_not_found');
    } catch (error) {
      if (error instanceof ApiError) return send(res, error.status, { error: error.code });
      return send(res, 500, { error: 'internal_error' });
    }
  });
  return { server, domain };
}

function run() {
  const port = Number(process.env.PORT || 3100);
  const { server } = createAppServer({ webhookSecret: process.env.DEMO_WEBHOOK_SECRET || 'local-demo-test-only' });
  server.listen(port, '127.0.0.1', () => {
    console.log(`Synthetic booking demo: http://127.0.0.1:${server.address().port}`);
    console.log('This server binds to localhost only; it performs no external API calls.');
  });
}

if (require.main === module) run();
module.exports = { createAppServer, readBody };
