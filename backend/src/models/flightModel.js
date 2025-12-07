// src/models/flightModel.js
const supabase = require('../config/supabaseClient');

async function getAllFlights({ origin, destination, date }) {
    let query = supabase
        .from('flights')
        .select('*')
        .eq('status', 'SCHEDULED')
        .order('departure_time', { ascending: true });

    if (origin) {
        // search by airport code only
        query = query.eq('origin_code', origin.toUpperCase());
    }
    if (destination) {
        // search by airport code only
        query = query.eq('destination_code', destination.toUpperCase());
    }
    if (date) {
        // date in format '2025-12-01'
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        query = query
            .gte('departure_time', startDate.toISOString())
            .lte('departure_time', endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) {
        console.error('getAllFlights error', error);
        throw error;
    }

    return data;
}

async function getDestinations() {
    const { data, error } = await supabase
        .from('flights')
        .select('origin, origin_code, destination, destination_code')
        .eq('status', 'SCHEDULED');

    if (error) {
        console.error('getDestinations error', error);
        throw error;
    }

    // Extract unique destinations
    const airportsMap = new Map();

    data.forEach(flight => {
        if (!airportsMap.has(flight.origin_code)) {
            airportsMap.set(flight.origin_code, {
                code: flight.origin_code,
                city: flight.origin,
                label: `${flight.origin} (${flight.origin_code})`
            });
        }
        if (!airportsMap.has(flight.destination_code)) {
            airportsMap.set(flight.destination_code, {
                code: flight.destination_code,
                city: flight.destination,
                label: `${flight.destination} (${flight.destination_code})`
            });
        }
    });

    return Array.from(airportsMap.values()).sort((a, b) => a.city.localeCompare(b.city));
}

async function getFlightById(id) {
    const { data, error } = await supabase
        .from('flights')
        .select('*')
        .eq('id', id)
        .maybeSingle();

    if (error) {
        console.error('getFlightById error', error);
        throw error;
    }
    return data;
}

module.exports = {
    getAllFlights,
    getFlightById,
    getDestinations
};
