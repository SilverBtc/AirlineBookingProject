<template>
  <div class="flight-results">
    <div class="results-header">
      <div class="search-summary">
        <h2>{{ origin }} → {{ destination }}</h2>
        <p>{{ departDate }} {{ returnDate ? `- ${returnDate}` : '' }} • {{ passengers }} {{ passengers === 1 ? 'Passenger' : 'Passengers' }}</p>
      </div>
      <button @click="modifySearch" class="modify-button">Modify Search</button>
    </div>

    <div class="results-container">


      <div class="results-main">
        <div class="sort-bar">
          <div class="results-count">{{ filteredFlights.length }} flights found</div>
          <div class="sort-options">
            <label>Sort by:</label>
            <select v-model="sortBy">
              <option value="price">Lowest Price</option>
              <option value="duration">Shortest Duration</option>
              <option value="departure">Departure Time</option>
              <option value="arrival">Arrival Time</option>
            </select>
          </div>
        </div>

        <div class="flights-list">
          <div
            v-for="flight in sortedFlights"
            :key="flight.id"
            class="flight-card"
          >
            <div class="flight-info">
              <div class="airline-logo">
                <div class="logo-placeholder">{{ flight.airline.substring(0, 2) }}</div>
                <div class="airline-name">{{ flight.airline }}</div>
              </div>

              <div class="flight-details">
                <div class="flight-time">
                  <div class="time-info">
                    <div class="time">{{ flight.departureTime }}</div>
                    <div class="airport">{{ flight.originCode }}</div>
                  </div>
                  
                  <div class="flight-path">
                    <div class="duration">{{ flight.duration }}</div>
                    <div class="path-line">
                      <div class="line"></div>
                      <div class="stops">{{ flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}` }}</div>
                    </div>
                  </div>

                  <div class="time-info">
                    <div class="time">{{ flight.arrivalTime }}</div>
                    <div class="airport">{{ flight.destinationCode }}</div>
                  </div>
                </div>

                <div class="flight-meta">
                  <span class="flight-number">{{ flight.flightNumber }}</span>
                  <span v-if="flight.stops === 0" class="badge direct">Direct Flight</span>
                  <span v-if="flight.refundable" class="badge refundable">Refundable</span>
                </div>
              </div>

              <div class="flight-price">
                <div class="price">${{ flight.price }}</div>
                <div class="price-label">per person</div>
                <button @click="selectFlight(flight)" class="select-button">
                  Select Flight
                </button>
              </div>
            </div>

            <div v-if="expandedFlight === flight.id" class="flight-expanded">
              <div class="expanded-details">
                <h4>Flight Details</h4>
                <div class="detail-row">
                  <span>Aircraft:</span>
                  <span>{{ flight.aircraft }}</span>
                </div>
                <div class="detail-row">
                  <span>Cabin Class:</span>
                  <span>{{ travelClass }}</span>
                </div>
                <div class="detail-row">
                  <span>Baggage:</span>
                  <span>{{ flight.baggage }}</span>
                </div>
                <div class="detail-row">
                  <span>Seat Selection:</span>
                  <span>{{ flight.seatSelection }}</span>
                </div>
              </div>
            </div>

            <button @click="toggleExpanded(flight.id)" class="details-toggle">
              {{ expandedFlight === flight.id ? '▲ Hide Details' : '▼ Show Details' }}
            </button>
          </div>
        </div>

        <div v-if="filteredFlights.length === 0" class="no-results">
          <h3>No flights found</h3>
          <p>Try adjusting your filters or search criteria</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const origin = ref(route.query.origin || '')
const destination = ref(route.query.destination || '')
const departDate = ref(route.query.departDate || '')
const returnDate = ref(route.query.returnDate || '')
const passengers = ref(parseInt(route.query.passengers) || 1)
const travelClass = ref(route.query.travelClass || 'economy')

const expandedFlight = ref(null)
const sortBy = ref('price')



// Mock flight data
const flights = ref([
  {
    id: 1,
    airline: 'American Airlines',
    flightNumber: 'AA 101',
    originCode: 'JFK',
    destinationCode: 'LHR',
    departureTime: '08:00',
    arrivalTime: '20:30',
    duration: '7h 30m',
    stops: 0,
    price: 650,
    refundable: true,
    aircraft: 'Boeing 777-300ER',
    baggage: '2 checked bags included',
    seatSelection: 'Free'
  },
  {
    id: 2,
    airline: 'Delta',
    flightNumber: 'DL 204',
    originCode: 'JFK',
    destinationCode: 'LHR',
    departureTime: '10:30',
    arrivalTime: '22:45',
    duration: '7h 15m',
    stops: 0,
    price: 580,
    refundable: false,
    aircraft: 'Airbus A350-900',
    baggage: '2 checked bags included',
    seatSelection: '$25'
  },
  {
    id: 3,
    airline: 'British Airways',
    flightNumber: 'BA 117',
    originCode: 'JFK',
    destinationCode: 'LHR',
    departureTime: '18:00',
    arrivalTime: '06:15+1',
    duration: '7h 15m',
    stops: 0,
    price: 720,
    refundable: true,
    aircraft: 'Boeing 787-9',
    baggage: '2 checked bags included',
    seatSelection: 'Free'
  },
  {
    id: 4,
    airline: 'United',
    flightNumber: 'UA 932',
    originCode: 'JFK',
    destinationCode: 'LHR',
    departureTime: '14:25',
    arrivalTime: '03:10+1',
    duration: '8h 45m',
    stops: 1,
    price: 450,
    refundable: false,
    aircraft: 'Boeing 767-300',
    baggage: '1 checked bag included',
    seatSelection: '$35'
  },
  {
    id: 5,
    airline: 'Lufthansa',
    flightNumber: 'LH 405',
    originCode: 'JFK',
    destinationCode: 'LHR',
    departureTime: '22:30',
    arrivalTime: '12:45+1',
    duration: '9h 15m',
    stops: 1,
    price: 520,
    refundable: false,
    aircraft: 'Airbus A330-300',
    baggage: '2 checked bags included',
    seatSelection: 'Free'
  },
  {
    id: 6,
    airline: 'Emirates',
    flightNumber: 'EK 201',
    originCode: 'JFK',
    destinationCode: 'LHR',
    departureTime: '06:30',
    arrivalTime: '20:15',
    duration: '13h 45m',
    stops: 1,
    price: 890,
    refundable: true,
    aircraft: 'Airbus A380-800',
    baggage: '2 checked bags included',
    seatSelection: 'Free'
  },
  {
    id: 7,
    airline: 'Air France',
    flightNumber: 'AF 008',
    originCode: 'JFK',
    destinationCode: 'LHR',
    departureTime: '11:45',
    arrivalTime: '01:30+1',
    duration: '8h 45m',
    stops: 1,
    price: 495,
    refundable: false,
    aircraft: 'Boeing 777-200',
    baggage: '2 checked bags included',
    seatSelection: '$20'
  }
])

const filteredFlights = computed(() => {
  return flights.value
})

const sortedFlights = computed(() => {
  const sorted = [...filteredFlights.value]
  
  switch (sortBy.value) {
    case 'price':
      return sorted.sort((a, b) => a.price - b.price)
    case 'duration':
      return sorted.sort((a, b) => {
        const getDuration = (str) => {
          const [hours, mins] = str.replace('h', '').replace('m', '').split(' ')
          return parseInt(hours) * 60 + parseInt(mins)
        }
        return getDuration(a.duration) - getDuration(b.duration)
      })
    case 'departure':
      return sorted.sort((a, b) => a.departureTime.localeCompare(b.departureTime))
    case 'arrival':
      return sorted.sort((a, b) => a.arrivalTime.localeCompare(b.arrivalTime))
    default:
      return sorted
  }
})

const toggleExpanded = (flightId) => {
  expandedFlight.value = expandedFlight.value === flightId ? null : flightId
}

const selectFlight = (flight) => {
  router.push({
    name: 'booking',
    query: {
      flightId: flight.id,
      origin: origin.value,
      destination: destination.value,
      departDate: departDate.value,
      returnDate: returnDate.value,
      passengers: passengers.value,
      price: flight.price
    }
  })
}

const modifySearch = () => {
  router.push({ name: 'home' })
}
</script>
