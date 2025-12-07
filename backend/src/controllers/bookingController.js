// src/controllers/bookingController.js
const bookingModel = require('../models/bookingModel');
const paymentModel = require('../models/paymentModel');
const flightModel = require('../models/flightModel');

async function createBooking(req, res) {
    try {
        const userId = req.user.id; // passenger
        const {
            flight_id,
            seat_number,
            passengers,
            contact_info,
            payment_info,
            total_price
        } = req.body;

        // Validation
        if (!flight_id || !seat_number) {
            return res.status(400).json({ message: 'Missing flight_id or seat_number' });
        }

        if (!payment_info || !payment_info.cardNumber) {
            return res.status(400).json({ message: 'Missing payment information' });
        }

        if (!contact_info || !contact_info.email) {
            return res.status(400).json({ message: 'Missing contact information' });
        }

        // Vérifier que le vol existe
        const flight = await flightModel.getFlightById(flight_id);
        if (!flight) return res.status(404).json({ message: 'Flight not found' });

        // Utiliser le prix fourni ou calculer à partir du vol
        const finalPrice = total_price || flight.base_price;

        // 1. Créer la réservation
        const booking = await bookingModel.createBooking({
            user_id: userId,
            flight_id,
            seat_number,
            total_price: finalPrice
        });

        // 2. Créer un paiement PENDING
        const payment = await paymentModel.createPayment({
            booking_id: booking.id,
            amount: finalPrice,
            currency: 'USD',
            payment_method: payment_info.method.toUpperCase() || 'CARD'
        });

        // 3. Simuler un paiement réussi (en production, intégrer Stripe/PayPal)
        const transaction_reference = 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        await paymentModel.markPaymentCompleted(payment.id, transaction_reference);

        // 4. Confirmer la réservation
        const confirmedBooking = await bookingModel.confirmBooking(booking.id);

        // 5. Retourner la réservation confirmée avec référence
        res.status(201).json({
            success: true,
            booking: {
                ...confirmedBooking,
                booking_reference: `BK${booking.id}${Date.now().toString().slice(-6)}`,
                passengers,
                contact_info
            },
            payment: {
                ...payment,
                status: 'COMPLETED',
                transaction_reference
            }
        });
    } catch (err) {
        console.error('createBooking error', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

async function getBooking(req, res) {
    try {
        const { id } = req.params;
        const booking = await bookingModel.getBookingById(id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // A passenger can only see their own bookings
        if (req.user.role === 'PASSENGER' && booking.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        res.json(booking);
    } catch (err) {
        console.error('getBooking error', err);
        res.status(500).json({ message: 'Server error' });
    }
}

async function cancelBooking(req, res) {
    try {
        const { id } = req.params;
        const booking = await bookingModel.getBookingById(id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // A passenger can only cancel their own booking
        if (req.user.role === 'PASSENGER' && booking.user_id !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const cancelled = await bookingModel.cancelBooking(id);
        // Mark the payment as refunded
        await paymentModel.markPaymentRefunded(id);

        res.json({ message: 'Booking cancelled and refunded', booking: cancelled });
    } catch (err) {
        console.error('cancelBooking error', err);
        res.status(500).json({ message: 'Server error' });
    }
}

// STAFF: modify booking (flight change, seat change)
async function updateBookingByStaff(req, res) {
    try {
        const { id } = req.params;
        const { flight_id, seat_number } = req.body;

        const booking = await bookingModel.getBookingById(id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        const updated = await bookingModel.updateBookingByStaff(id, { flight_id, seat_number });
        res.json({ message: 'Booking updated by staff', booking: updated });
    } catch (err) {
        console.error('updateBookingByStaff error', err);
        res.status(500).json({ message: 'Server error' });
    }
}

async function getMyBookings(req, res) {
    try {
        const userId = req.user.id;
        const bookings = await bookingModel.getBookingsByUserId(userId);
        res.json(bookings);
    } catch (err) {
        console.error('getMyBookings error', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}

module.exports = {
    createBooking,
    getBooking,
    getMyBookings,
    cancelBooking,
    updateBookingByStaff
};
