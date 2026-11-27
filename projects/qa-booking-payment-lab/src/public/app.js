'use strict';

const elements = {
  form: document.querySelector('#booking-form'),
  offerPrice: document.querySelector('[data-testid="offer-price"]'),
  available: document.querySelector('[data-testid="seats-available"]'),
  status: document.querySelector('[data-testid="booking-status"]'),
  statusPill: document.querySelector('#status-pill'),
  id: document.querySelector('[data-testid="booking-id"]'),
  feedback: document.querySelector('[data-testid="feedback"]'),
  paySuccess: document.querySelector('#pay-success'),
  payFailed: document.querySelector('#pay-failed'),
  cancel: document.querySelector('#cancel-booking'),
  refund: document.querySelector('#refund-booking'),
  create: document.querySelector('#create-booking'),
};

let offer = null;
let currentBooking = null;
let busy = false;

function notify(message, type = '') {
  elements.feedback.textContent = message;
  elements.feedback.className = `feedback ${type}`.trim();
}

async function request(route, options) {
  const response = await fetch(route, options);
  const payload = await response.json();
  if (!response.ok) throw new Error(`${payload.error || 'request_failed'} (HTTP ${response.status})`);
  return payload;
}

function post(route, data = {}) {
  return request(route, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
}

function renderStatus() {
  const status = currentBooking?.status || 'NOT CREATED';
  elements.status.textContent = status.replaceAll('_', ' ');
  elements.id.textContent = currentBooking?.id || '—';
  elements.statusPill.textContent = currentBooking ? 'TRACKING' : 'IDLE';
  elements.statusPill.classList.toggle('active', Boolean(currentBooking));
  elements.paySuccess.disabled = busy || status !== 'PENDING_PAYMENT';
  elements.payFailed.disabled = busy || status !== 'PENDING_PAYMENT';
  elements.cancel.disabled = busy || !['PENDING_PAYMENT', 'PAYMENT_FAILED'].includes(status);
  elements.refund.disabled = busy || status !== 'CONFIRMED';
  elements.create.disabled = busy;
}

async function refreshOffer() {
  offer = (await request('/api/offers')).offers[0];
  elements.offerPrice.textContent = `${offer.amount.toLocaleString('en-US')} ${offer.currency}`;
  elements.available.textContent = `${offer.seatsAvailable} seats left`;
}

async function withBusy(task) {
  if (busy) return;
  busy = true;
  renderStatus();
  try {
    await task();
  } catch (error) {
    notify(`Test operation failed: ${error.message}`, 'error');
  } finally {
    busy = false;
    renderStatus();
  }
}

elements.form.addEventListener('submit', event => {
  event.preventDefault();
  withBusy(async () => {
    const fields = new FormData(elements.form);
    const passenger = {
      firstName: String(fields.get('firstName') || '').trim(),
      lastName: String(fields.get('lastName') || '').trim(),
      email: String(fields.get('email') || '').trim(),
    };
    if (!passenger.firstName || !passenger.lastName || !passenger.email) {
      notify('All passenger fields are required.', 'error');
      return;
    }
    currentBooking = await post('/api/bookings', { offerId: offer.id, passenger });
    notify('Booking created. Verify PENDING_PAYMENT, then simulate a payment or cancellation.', 'success');
    await refreshOffer();
  });
});

async function changeBooking(action, status) {
  await withBusy(async () => {
    if (!currentBooking) return;
    if (action === 'payment') {
      await post('/api/demo/payments', { bookingId: currentBooking.id, status });
    } else {
      await post(`/api/bookings/${encodeURIComponent(currentBooking.id)}/${action}`);
    }
    currentBooking = await request(`/api/bookings/${encodeURIComponent(currentBooking.id)}`);
    await refreshOffer();
    notify(`Booking status is now ${currentBooking.status}. No real transaction was made.`, 'success');
  });
}

elements.paySuccess.addEventListener('click', () => changeBooking('payment', 'PAID'));
elements.payFailed.addEventListener('click', () => changeBooking('payment', 'FAILED'));
elements.cancel.addEventListener('click', () => changeBooking('cancel'));
elements.refund.addEventListener('click', () => changeBooking('refund'));

refreshOffer().then(renderStatus).catch(error => notify(`Unable to load the mock offer: ${error.message}`, 'error'));
renderStatus();
