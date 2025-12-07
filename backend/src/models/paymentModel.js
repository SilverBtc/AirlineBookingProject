// src/models/paymentModel.js
const supabase = require('../config/supabaseClient');

async function createPayment({ booking_id, amount, currency, payment_method }) {
    const { data, error } = await supabase
        .from('payments')
        .insert([{ booking_id, amount, currency, payment_method, status: 'PENDING' }])
        .select()
        .single();

    if (error) {
        console.error('createPayment error', error);
        throw error;
    }
    return data;
}

async function markPaymentCompleted(id, transaction_reference) {
    const { data, error } = await supabase
        .from('payments')
        .update({ status: 'COMPLETED', transaction_reference })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('markPaymentCompleted error', error);
        throw error;
    }
    return data;
}

async function markPaymentRefunded(booking_id) {
    const { error } = await supabase
        .from('payments')
        .update({ status: 'REFUNDED' })
        .eq('booking_id', booking_id)
        .eq('status', 'COMPLETED');

    if (error) {
        console.error('markPaymentRefunded error', error);
        throw error;
    }
}

module.exports = {
    createPayment,
    markPaymentCompleted,
    markPaymentRefunded
};
