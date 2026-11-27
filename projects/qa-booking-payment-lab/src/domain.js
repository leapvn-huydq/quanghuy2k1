'use strict';

const { randomUUID, createHash, createHmac, timingSafeEqual } = require('node:crypto');

const OFFER = Object.freeze({
  id: 'DEMO-FLIGHT-001',
  origin: 'SGN',
  destination: 'HAN',
  carrier: 'SAMPLE AIR',
  departureDate: '2027-03-15',
  currency: 'VND',
  amount: 1250000,
  capacity: 3,
});

class ApiError extends Error {
  constructor(status, code, message = code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function isName(value) {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= 60;
}

function isEmail(value) {
  return typeof value === 'string' && value.length <= 120 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function signPayload(raw, secret) {
  return createHmac('sha256', secret).update(raw, 'utf8').digest('hex');
}

function verifySignature(raw, receivedSignature, secret) {
  if (typeof receivedSignature !== 'string' || !/^[a-f0-9]{64}$/i.test(receivedSignature)) return false;
  const expected = Buffer.from(signPayload(raw, secret), 'hex');
  const received = Buffer.from(receivedSignature, 'hex');
  return received.length === expected.length && timingSafeEqual(expected, received);
}

class DemoBookingDomain {
  constructor() {
    this.bookings = new Map();
    this.events = new Map();
    this.availableSeats = OFFER.capacity;
  }

  getOffer() {
    return { ...OFFER, seatsAvailable: this.availableSeats };
  }

  publicBooking(booking) {
    return {
      id: booking.id,
      offerId: booking.offerId,
      passenger: { ...booking.passenger },
      amount: booking.amount,
      currency: booking.currency,
      status: booking.status,
    };
  }

  getBooking(id) {
    const found = this.bookings.get(id);
    if (!found) throw new ApiError(404, 'booking_not_found');
    return this.publicBooking(found);
  }

  createBooking(payload) {
    if (payload === null || typeof payload !== 'object' || Array.isArray(payload)) {
      throw new ApiError(400, 'invalid_request');
    }
    const passenger = payload.passenger;
    if (!passenger || typeof passenger !== 'object' || Array.isArray(passenger) ||
        !isName(passenger.firstName) || !isName(passenger.lastName) || !isEmail(passenger.email)) {
      throw new ApiError(400, 'invalid_passenger');
    }
    if (payload.offerId !== OFFER.id) throw new ApiError(404, 'offer_not_found');
    if (this.availableSeats < 1) throw new ApiError(409, 'offer_sold_out');

    // Prices are always server-controlled. Client-supplied amounts are ignored.
    const booking = {
      id: randomUUID(),
      offerId: OFFER.id,
      passenger: {
        firstName: passenger.firstName.trim(),
        lastName: passenger.lastName.trim(),
        email: passenger.email.trim().toLowerCase(),
      },
      amount: OFFER.amount,
      currency: OFFER.currency,
      status: 'PENDING_PAYMENT',
      seatReserved: true,
    };
    this.availableSeats -= 1;
    this.bookings.set(booking.id, booking);
    return this.publicBooking(booking);
  }

  releaseSeat(booking) {
    if (booking.seatReserved) {
      this.availableSeats += 1;
      booking.seatReserved = false;
    }
  }

  cancelBooking(id) {
    const booking = this.bookings.get(id);
    if (!booking) throw new ApiError(404, 'booking_not_found');
    if (!['PENDING_PAYMENT', 'PAYMENT_FAILED'].includes(booking.status)) {
      throw new ApiError(409, 'invalid_status_transition');
    }
    booking.status = 'CANCELLED';
    this.releaseSeat(booking);
    return this.publicBooking(booking);
  }

  refundBooking(id) {
    const booking = this.bookings.get(id);
    if (!booking) throw new ApiError(404, 'booking_not_found');
    if (booking.status !== 'CONFIRMED') throw new ApiError(409, 'invalid_status_transition');
    booking.status = 'REFUNDED';
    this.releaseSeat(booking);
    return this.publicBooking(booking);
  }

  processPaymentEvent(event, raw) {
    if (!event || typeof event !== 'object' || Array.isArray(event) ||
        typeof event.eventId !== 'string' || !/^[a-zA-Z0-9_-]{1,64}$/.test(event.eventId) ||
        typeof event.bookingId !== 'string' ||
        !['PAID', 'FAILED'].includes(event.status) || !Number.isSafeInteger(event.amount)) {
      throw new ApiError(400, 'invalid_payment_event');
    }
    const hash = createHash('sha256').update(raw, 'utf8').digest('hex');
    if (this.events.has(event.eventId)) {
      if (this.events.get(event.eventId) !== hash) throw new ApiError(409, 'event_id_conflict');
      return { processed: false, duplicate: true };
    }
    const booking = this.bookings.get(event.bookingId);
    if (!booking) throw new ApiError(404, 'booking_not_found');
    if (event.amount !== booking.amount) throw new ApiError(422, 'amount_mismatch');
    if (booking.status !== 'PENDING_PAYMENT') throw new ApiError(409, 'invalid_status_transition');
    booking.status = event.status === 'PAID' ? 'CONFIRMED' : 'PAYMENT_FAILED';
    if (event.status === 'FAILED') this.releaseSeat(booking);
    this.events.set(event.eventId, hash);
    return { processed: true, duplicate: false, bookingStatus: booking.status };
  }
}

module.exports = { OFFER, ApiError, DemoBookingDomain, isName, isEmail, signPayload, verifySignature };
