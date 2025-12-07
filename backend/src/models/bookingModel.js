// src/models/bookingModel.js
const supabase = require('../config/supabaseClient');
const flightModel = require('./flightModel');

async function createBooking({ user_id, flight_id, seat_number, total_price }) {
    const { data, error } = await supabase
        .from('bookings')
        .insert([{ user_id, flight_id, seat_number, total_price, status: 'PENDING_PAYMENT' }])
        .select()
        .single();

    if (error) {
        console.error('createBooking error', error);
        throw error;
    }

    return data;
}

async function getBookingById(id) {
    const { data: booking, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .maybeSingle();

    if (error) {
        console.error('getBookingById error', error);
        throw error;
    }
    if (!booking) return null;

    const flight = await flightModel.getFlightById(booking.flight_id);

    return {
        ...booking,
        flight
    };
}

async function confirmBooking(id) {
    const { data, error } = await supabase
        .from('bookings')
        .update({ status: 'CONFIRMED' })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('confirmBooking error', error);
        throw error;
    }
    return data;
}

async function cancelBooking(id) {
    const { data, error } = await supabase
        .from('bookings')
        .update({ status: 'CANCELLED' })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('cancelBooking error', error);
        throw error;
    }
    return data;
}

async function updateBookingByStaff(id, { flight_id, seat_number }) {
    const updateData = {};
    if (flight_id !== undefined) updateData.flight_id = flight_id;
    if (seat_number !== undefined) updateData.seat_number = seat_number;

    const { data, error } = await supabase
        .from('bookings')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('updateBookingByStaff error', error);
        throw error;
    }

    const flight = await flightModel.getFlightById(data.flight_id);

    return {
        ...data,
        flight
    };
}

async function getBookingsByUserId(user_id) {
    const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('getBookingsByUserId error', error);
        throw error;
    }

    // Enrichir chaque réservation avec les détails du vol
    const enrichedBookings = await Promise.all(
        bookings.map(async (booking) => {
            const flight = await flightModel.getFlightById(booking.flight_id);
            return {
                ...booking,
                flight
            };
        })
    );

    return enrichedBookings;
}

module.exports = {
    createBooking,
    getBookingById,
    getBookingsByUserId,
    confirmBooking,
    cancelBooking,
    updateBookingByStaff
};
