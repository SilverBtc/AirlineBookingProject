// src/controllers/flightController.js
const flightModel = require('../models/flightModel');

async function searchFlights(req, res) {
    try {
        const { origin, destination, date, returnDate, tripType } = req.query;

        // outbound flights
        const outboundFlights = await flightModel.getAllFlights({ origin, destination, date });

        // If roundtrip and returnDate provided, search return flights
        if (tripType === 'roundtrip' && returnDate) {
            const returnFlights = await flightModel.getAllFlights({
                origin: destination,
                destination: origin,
                date: returnDate
            });

            // Return both sets of flights
            res.json({
                outbound: outboundFlights,
                return: returnFlights,
                tripType: 'roundtrip'
            });
        } else {
            // One-way trip
            res.json({
                outbound: outboundFlights,
                tripType: 'oneway'
            });
        }
    } catch (err) {
        console.error('searchFlights error', err);
        res.status(500).json({ message: 'Server error' });
    }
}

async function getFlight(req, res) {
    try {
        const { id } = req.params;
        const flight = await flightModel.getFlightById(id);
        if (!flight) return res.status(404).json({ message: 'Flight not found' });
        res.json(flight);
    } catch (err) {
        console.error('getFlight error', err);
        res.status(500).json({ message: 'Server error' });
    }
}

async function getDestinations(req, res) {
    try {
        const destinations = await flightModel.getDestinations();
        res.json(destinations);
    } catch (err) {
        console.error('getDestinations error', err);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    searchFlights,
    getFlight,
    getDestinations
};
