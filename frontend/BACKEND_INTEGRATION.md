# Backend Integration Guide

## API Endpoints Needed

### 1. Search Flights
**Endpoint:** `POST /api/flights/search`

**Request Body:**
```json
{
  "origin": "New York (JFK)",
  "destination": "London (LHR)",
  "departDate": "2025-12-15",
  "returnDate": "2025-12-22",
  "passengers": 2,
  "travelClass": "economy",
  "tripType": "roundtrip"
}
```

**Response:**
```json
{
  "flights": [
    {
      "id": 1,
      "airline": "American Airlines",
      "flightNumber": "AA 101",
      "originCode": "JFK",
      "destinationCode": "LHR",
      "departureTime": "08:00",
      "arrivalTime": "20:30",
      "duration": "7h 30m",
      "stops": 0,
      "price": 650,
      "refundable": true,
      "aircraft": "Boeing 777-300ER",
      "baggage": "2 checked bags included",
      "seatSelection": "Free"
    }
  ]
}
```

**File to update:** `frontend/src/components/FlightSearch.vue`
- Replace mock data in `searchFlights()` function

---

### 2. Create Booking
**Endpoint:** `POST /api/bookings`

**Request Body:**
```json
{
  "flightId": 1,
  "passengers": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-01-01",
      "gender": "male",
      "email": "john@example.com",
      "phone": "+1234567890",
      "passportNumber": "123456789",
      "nationality": "US"
    }
  ],
  "contactInfo": {
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "paymentInfo": {
    "cardNumber": "4111111111111111",
    "cardName": "John Doe",
    "expiryDate": "12/25",
    "cvv": "123"
  },
  "totalPrice": 650
}
```

**Response:**
```json
{
  "bookingReference": "SKY123ABC456",
  "status": "confirmed",
  "flightDetails": {
    "airline": "American Airlines",
    "flightNumber": "AA 101",
    "departure": "2025-12-15 08:00",
    "arrival": "2025-12-15 20:30"
  }
}
```

**File to update:** `frontend/src/components/BookingForm.vue`
- Replace mock booking in `confirmBooking()` function

---

### 3. User Authentication (Optional)
**Login:** `POST /api/auth/login`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Register:** `POST /api/auth/register`
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**File to update:** `frontend/src/App.vue`
- Add click handlers to Login/Register buttons

---

## Files to Modify

### 1. `frontend/src/components/FlightSearch.vue`
Look for: `// TODO: Replace with API call`

### 2. `frontend/src/components/FlightResults.vue`
Look for: `// Mock flight data - Replace with API data`

### 3. `frontend/src/components/BookingForm.vue`
Look for: `// TODO: Send to backend API`

---

## Setup API Base URL

Create `frontend/src/api/config.js`:
```javascript
export const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000'
```

Install axios:
```bash
cd frontend
npm install axios
```

Create API helper `frontend/src/api/flights.js`:
```javascript
import axios from 'axios'
import { API_BASE_URL } from './config'

export const searchFlights = async (searchParams) => {
  const response = await axios.post(`${API_BASE_URL}/api/flights/search`, searchParams)
  return response.data
}

export const createBooking = async (bookingData) => {
  const response = await axios.post(`${API_BASE_URL}/api/bookings`, bookingData)
  return response.data
}
```
