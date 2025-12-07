// src/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/bookingController');
const { authenticate, authorize } = require('../middleware/auth');

// Passenger: create a booking (with payment)
router.post('/', authenticate, authorize(['PASSENGER']), bookingController.createBooking);

// Get all bookings for current user
router.get('/my-bookings', authenticate, bookingController.getMyBookings);

// View a booking (passenger = only their own, staff = all)
router.get('/:id', authenticate, bookingController.getBooking);

// Cancel and refund
router.post('/:id/cancel', authenticate, bookingController.cancelBooking);

// Staff: modify the booking (change flight / info)
router.put(
    '/:id/staff-update',
    authenticate,
    authorize(['STAFF']),
    bookingController.updateBookingByStaff
);

module.exports = router;
