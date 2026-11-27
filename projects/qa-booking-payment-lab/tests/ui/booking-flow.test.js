'use strict';

// Browser automation using the Playwright API with the Node.js test runner.
// The browser uses a fresh local mock server per test; no external websites are contacted.
const test = require('node:test');
const assert = require('node:assert/strict');
const { before, after } = require('node:test');
const { chromium } = require('playwright');
const { withServer } = require('../helpers/test-server');

let browser;
before(async () => {
  browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_EXECUTABLE || undefined,
    args: process.getuid?.() === 0 ? ['--no-sandbox'] : [],
  });
});
after(async () => { if (browser) await browser.close(); });

async function withPage(fn) {
  return withServer(async base => {
    const context = await browser.newContext({ viewport: { width: 1365, height: 930 } });
    const page = await context.newPage();
    try {
      await page.goto(base, { waitUntil: 'networkidle' });
      return await fn(page, base);
    } finally { await context.close(); }
  });
}
async function form(page, input = { first: 'An', last: 'Nguyen', email: 'an@example.test' }) {
  await page.getByTestId('first-name').fill(input.first);
  await page.getByTestId('last-name').fill(input.last);
  await page.getByTestId('email').fill(input.email);
  await page.getByTestId('create-booking').click();
}

async function waitText(page, testId, text) {
  await page.waitForFunction(({ testId, text }) => {
    const target = document.querySelector(`[data-testid=\"${testId}\"]`);
    return Boolean(target && target.textContent.includes(text));
  }, { testId, text }, { timeout: 10000 });
}

const ui = (id, label, fn) => test(`${id} | ${label}`, () => withPage(fn));

ui('TC-UI-001', 'loads offer, fare and available capacity', async page => {
  await waitText(page, 'seats-available', '3 seats left');
  assert.match(await page.getByTestId('offer-price').innerText(), /1,250,000 VND/);
  assert.match(await page.title(), /QA Sandbox/);
});
ui('TC-UI-002', 'required fields show meaningful validation feedback', async page => {
  await page.getByTestId('create-booking').click();
  assert.match(await page.getByTestId('feedback').innerText(), /All passenger fields are required/);
  assert.equal(await page.getByTestId('booking-status').innerText(), 'NOT CREATED');
});
ui('TC-UI-003', 'create booking shows ID and PENDING_PAYMENT', async page => {
  await form(page);
  await waitText(page, 'booking-status', 'PENDING PAYMENT');
  assert.match(await page.getByTestId('booking-id').innerText(), /^[0-9a-f-]{36}$/);
  assert.match(await page.getByTestId('seats-available').innerText(), /2 seats left/);
});
ui('TC-UI-004', 'successful simulated payment confirms and enables refund', async page => {
  await form(page);
  await waitText(page, 'booking-status', 'PENDING PAYMENT');
  await page.getByTestId('pay-success').click();
  await waitText(page, 'booking-status', 'CONFIRMED');
  assert.equal(await page.getByTestId('refund-booking').isEnabled(), true);
  assert.equal(await page.getByTestId('pay-success').isDisabled(), true);
});
ui('TC-UI-005', 'refund changes booking to REFUNDED and restores seat', async page => {
  await form(page);
  await waitText(page, 'booking-status', 'PENDING PAYMENT');
  await page.getByTestId('pay-success').click();
  await waitText(page, 'booking-status', 'CONFIRMED');
  await page.getByTestId('refund-booking').click();
  await waitText(page, 'booking-status', 'REFUNDED');
  assert.match(await page.getByTestId('seats-available').innerText(), /3 seats left/);
});
ui('TC-UI-006', 'failed payment can be cancelled', async page => {
  await form(page);
  await waitText(page, 'booking-status', 'PENDING PAYMENT');
  await page.getByTestId('pay-failed').click();
  await waitText(page, 'booking-status', 'PAYMENT FAILED');
  assert.equal(await page.getByTestId('cancel-booking').isEnabled(), true);
  await page.getByTestId('cancel-booking').click();
  await waitText(page, 'booking-status', 'CANCELLED');
});
ui('TC-UI-007', 'cancel pending booking restores seat', async page => {
  await form(page);
  await waitText(page, 'booking-status', 'PENDING PAYMENT');
  await page.getByTestId('cancel-booking').click();
  await waitText(page, 'booking-status', 'CANCELLED');
  assert.match(await page.getByTestId('seats-available').innerText(), /3 seats left/);
});
ui('TC-UI-008', 'backend rejects invalid email and UI reports response', async page => {
  await form(page, { first: 'An', last: 'Nguyen', email: 'not-email' });
  await waitText(page, 'feedback', 'invalid_passenger');
  assert.equal(await page.getByTestId('booking-status').innerText(), 'NOT CREATED');
});
