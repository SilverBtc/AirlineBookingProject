// src/routes/flightRoutes.js
const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');
const { authenticate } = require('../middleware/auth');

router.get('/search', flightController.searchFlights);
router.get('/destinations', flightController.getDestinations);
router.get('/:id', flightController.getFlight);

module.exports = router;
