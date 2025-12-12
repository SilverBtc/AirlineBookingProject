<template>
    <div class="flight-results">
        <div class="results-top">
            <!-- Progress Steps for Roundtrip -->
            <div v-if="tripType === 'roundtrip'" class="trip-steps">
                <div :class="['trip-step', { active: step === 1, completed: step === 2 }]">
                    <div class="step-number">1</div>
                    <div class="step-info">
                        <div class="step-label">Select Outbound Flight</div>
                        <div class="step-route">{{ origin }} → {{ destination }}</div>
                        <div class="step-date">{{ formatDate(departDate) }}</div>
                    </div>
                </div>
                <div class="step-arrow">→</div>
                <div :class="['trip-step', { active: step === 2 }]">
                    <div class="step-number">2</div>
                    <div class="step-info">
                        <div class="step-label">Select Return Flight</div>
                        <div class="step-route">{{ destination }} → {{ origin }}</div>
                        <div class="step-date">{{ formatDate(returnDate) }}</div>
                    </div>
                </div>
            </div>

            <div class="search-summary">
                <button @click="step === 2 ? backToOutbound() : modifySearch()" class="back-btn">←</button>
                <div class="route-info">
                    <h2 v-if="step === 1">{{ origin }} → {{ destination }}</h2>
                    <h2 v-else>{{ destination }} → {{ origin }}</h2>
                    <p v-if="step === 1">{{ formatDate(departDate) }} • {{ passengers }} traveler{{ passengers > 1 ? 's'
                        : '' }}</p>
                    <p v-else>{{ formatDate(returnDate) }} • {{ passengers }} traveler{{ passengers > 1 ? 's' : '' }}
                    </p>
                </div>
            </div>

            <!-- Selected Outbound Flight Summary (shown in step 2) -->
            <div v-if="step === 2 && selectedOutboundFlight" class="selected-flight-summary">
                <div class="summary-header">
                    <div class="summary-badge">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M13.3334 4L6.00002 11.3333L2.66669 8" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <span>Outbound Flight Selected</span>
                    </div>
                    <button @click="backToOutbound" class="change-btn">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path
                                d="M8.16669 3.5L10.5 5.83333L8.16669 8.16667M10.3334 5.83333H5.83335C4.63335 5.83333 3.66669 6.8 3.66669 8V10.5"
                                stroke="currentColor" stroke-width="1.2" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                        Change
                    </button>
                </div>
                <div class="summary-flight-card">
                    <div class="summary-left">
                        <div class="summary-airline-logo">{{ selectedOutboundFlight.airline.substring(0,
                            2).toUpperCase() }}</div>
                        <div class="summary-airline-info">
                            <div class="summary-airline-name">{{ selectedOutboundFlight.airline }}</div>
                            <div class="summary-flight-number">{{ selectedOutboundFlight.flightNumber }}</div>
                        </div>
                    </div>
                    <div class="summary-middle">
                        <div class="summary-time-block">
                            <div class="summary-time">{{ selectedOutboundFlight.departureTime }}</div>
                            <div class="summary-code">{{ selectedOutboundFlight.originCode }}</div>
                        </div>
                        <div class="summary-duration">
                            <div class="summary-duration-line"></div>
                            <div class="summary-duration-text">{{ selectedOutboundFlight.duration }}</div>
                        </div>
                        <div class="summary-time-block">
                            <div class="summary-time">{{ selectedOutboundFlight.arrivalTime }}</div>
                            <div class="summary-code">{{ selectedOutboundFlight.destinationCode }}</div>
                        </div>
                    </div>
                    <div class="summary-right">
                        <div class="summary-price-amount">${{ selectedOutboundFlight.price.toFixed(2) }}</div>
                        <div class="summary-price-label">per person</div>
                    </div>
                </div>
            </div>

            <div class="filter-chips">
                <button :class="['chip', { active: sortBy === 'best' }]" @click="sortBy = 'best'">
                    Best
                </button>
                <button :class="['chip', { active: sortBy === 'price' }]" @click="sortBy = 'price'">
                    Cheapest
                </button>
                <button :class="['chip', { active: sortBy === 'duration' }]" @click="sortBy = 'duration'">
                    Quickest
                </button>
            </div>
        </div>

        <div class="results-container">
            <!-- Loading State -->
            <div v-if="loading" class="loading-container">
                <div class="loading-spinner"></div>
                <p>Searching for flights...</p>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="error-container">
                <p class="error-message">{{ error }}</p>
                <button @click="fetchFlights" class="retry-btn">Retry</button>
            </div>

            <!-- Flights List -->
            <div v-else class="flights-list">
                <div v-for="flight in sortedFlights" :key="flight.id" class="flight-card" @click="selectFlight(flight)">
                    <div class="flight-main">
                        <div class="airline-info">
                            <div class="airline-logo-circle">{{ flight.airline.substring(0, 2).toUpperCase() }}</div>
                            <div class="airline-name">{{ flight.airline }}</div>
                        </div>

                        <div class="flight-times">
                            <div class="time-block">
                                <div class="time">{{ flight.departureTime }}</div>
                                <div class="airport">{{ flight.originCode }}</div>
                            </div>

                            <div class="flight-middle">
                                <div class="duration">{{ flight.duration }}</div>
                                <div class="timeline">
                                    <div class="line"></div>
                                    <div class="stops-dot" v-if="flight.stops > 0"></div>
                                </div>
                                <div class="stops-info">{{ flight.stops === 0 ? 'Nonstop' : `${flight.stops}
                                    stop${flight.stops > 1 ? 's' : ''}` }}</div>
                            </div>

                            <div class="time-block">
                                <div class="time">{{ flight.arrivalTime }}</div>
                                <div class="airport">{{ flight.destinationCode }}</div>
                            </div>
                        </div>

                        <div class="flight-price-section">
                            <div class="price-amount">${{ flight.price.toFixed(2) }}</div>
                            <div class="price-type">{{ travelClass }}</div>
                        </div>
                    </div>

                    <div v-if="flight.stops === 0" class="flight-badges">
                        <span class="badge-green">Nonstop</span>
                    </div>

                    <div v-if="expandedFlight === flight.id" class="flight-details-expanded">
                        <div class="detail-section">
                            <h4>Flight details</h4>
                            <div class="detail-item">
                                <span class="detail-label">Aircraft</span>
                                <span>{{ flight.aircraft }}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Baggage</span>
                                <span>{{ flight.baggage }}</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Flight number</span>
                                <span>{{ flight.flightNumber }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="!loading && !error && filteredFlights.length === 0" class="no-results">
                    <p>No flights found</p>
                    <button @click="modifySearch">Change search</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { flightAPI } from '../services/api'

const router = useRouter()
const route = useRoute()

const origin = ref(route.query.origin || '')
const destination = ref(route.query.destination || '')
const departDate = ref(route.query.departDate || '')
const returnDate = ref(route.query.returnDate || '')
const passengers = ref(parseInt(route.query.passengers) || 1)
const travelClass = ref(route.query.travelClass || 'economy')

const expandedFlight = ref(null)
const sortBy = ref('best')
const flights = ref([])
const returnFlights = ref([])
const loading = ref(false)
const error = ref(null)
const tripType = ref(route.query.tripType || 'oneway')
const selectedOutboundFlight = ref(null)
const step = ref(1) // 1 = select outbound, 2 = select return

const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

const formatFlightData = (flight) => {
    const departureTime = new Date(flight.departure_time)
    const arrivalTime = new Date(flight.arrival_time)

    return {
        id: flight.id,
        airline: flight.airline,
        flightNumber: flight.flight_number,
        originCode: flight.origin_code,
        destinationCode: flight.destination_code,
        departureTime: departureTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        arrivalTime: arrivalTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        duration: flight.duration,
        stops: flight.stops,
        price: parseFloat(flight.base_price),
        refundable: flight.refundable,
        aircraft: flight.aircraft || 'N/A',
        baggage: flight.baggage || 'Check airline policy',
        seatSelection: flight.seat_selection || 'Check airline policy'
    }
}

const fetchFlights = async () => {
    loading.value = true
    error.value = null

    try {
        const params = {
            origin: origin.value,
            destination: destination.value,
            date: departDate.value,
            returnDate: returnDate.value,
            tripType: tripType.value
        }

        const response = await flightAPI.search(params)

        // Handle response based on trip type
        if (response.data.tripType === 'roundtrip' && response.data.return) {
            flights.value = response.data.outbound.map(formatFlightData)
            returnFlights.value = response.data.return.map(formatFlightData)
            step.value = 1 // Start with outbound flight selection
        } else {
            // oneway
            flights.value = response.data.outbound.map(formatFlightData)
            returnFlights.value = []
        }

        // If no flights found
        if (flights.value.length === 0) {
            console.warn('No flights found in database')
        }
    } catch (err) {
        console.error('Error fetching flights:', err)
        error.value = 'Erreur lors du chargement des vols.'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchFlights()
})

const filteredFlights = computed(() => {
    // Show outbound flights if step 1, or return flights if step 2
    return step.value === 1 ? flights.value : returnFlights.value
})

const selectOutboundFlight = (flight) => {
    if (tripType.value === 'roundtrip') {
        selectedOutboundFlight.value = flight
        step.value = 2 // Move to return flight selection
        window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
        // One way, go directly to booking
        goToBooking(flight)
    }
}

const selectReturnFlight = (flight) => {
    // Go to booking with both flights
    goToBooking(selectedOutboundFlight.value, flight)
}

const goToBooking = (outboundFlight, returnFlight = null) => {
    const totalPrice = (outboundFlight.price + (returnFlight?.price || 0)).toFixed(2)
    router.push({
        name: 'booking',
        query: {
            flightId: outboundFlight.id,
            returnFlightId: returnFlight?.id,
            origin: origin.value,
            destination: destination.value,
            departDate: departDate.value,
            returnDate: returnDate.value,
            passengers: passengers.value,
            price: totalPrice,
            travelClass: travelClass.value
        }
    })
}

const backToOutbound = () => {
    step.value = 1
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

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
    if (step.value === 1) {
        selectOutboundFlight(flight)
    } else {
        selectReturnFlight(flight)
    }
}

const modifySearch = () => {
    router.push({ name: 'home' })
}
</script>
