<template>
    <div class="confirmation-page">
        <div class="confirmation-container">
            <div class="success-animation">
                <div class="checkmark-circle">
                    <div class="checkmark">✓</div>
                </div>
            </div>

            <h1>Booking Confirmed!</h1>
            <p class="confirmation-message">
                Your flight has been successfully booked. A confirmation email has been sent to {{ email }}
            </p>

            <div class="booking-reference">
                <div class="reference-label">Booking Reference</div>
                <div class="reference-code">{{ bookingRef }}</div>
                <button @click="copyReference" class="copy-button">
                    {{ copied ? 'Copied!' : 'Copy Reference' }}
                </button>
            </div>

            <div class="confirmation-details">
                <section class="detail-section">
                    <h2>Flight Information</h2>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <div class="detail-label">Route</div>
                            <div class="detail-value">{{ origin }} → {{ destination }}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Date</div>
                            <div class="detail-value">{{ formatDate(departDate) }}</div>
                        </div>
                        <div class="detail-item" v-if="airline">
                            <div class="detail-label">Airline</div>
                            <div class="detail-value">{{ airline }}</div>
                        </div>
                        <div class="detail-item" v-if="flightNumber">
                            <div class="detail-label">Flight Number</div>
                            <div class="detail-value">{{ flightNumber }}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Passengers</div>
                            <div class="detail-value">{{ passengers }}</div>
                        </div>
                        <div class="detail-item" v-if="seatNumber">
                            <div class="detail-label">Seat(s)</div>
                            <div class="detail-value">{{ seatNumber }}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Status</div>
                            <div class="detail-value">
                                <span :class="['status-badge', status]">{{ status }}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Total Paid</div>
                            <div class="detail-value total-amount">${{ total }}</div>
                        </div>
                    </div>
                </section>
            </div>

            <div class="confirmation-info-box">
                <div class="info-icon">ℹ️</div>
                <div class="info-text">
                    <strong>What's Next?</strong>
                    <p>Please check your email for detailed booking information and e-tickets. You can view and manage
                        your booking anytime from "My Bookings".</p>
                </div>
            </div>

            <div class="action-buttons">
                <button @click="goToBookings" class="primary-action-button">
                    View My Bookings
                </button>
                <button @click="goToHome" class="secondary-action-button">
                    Book Another Flight
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { bookingAPI } from '../services/api'

const router = useRouter()
const route = useRoute()

const bookingRef = ref(route.query.bookingRef || '')
const bookingId = ref(route.query.bookingId || '')
const origin = ref(route.query.origin || '')
const destination = ref(route.query.destination || '')
const departDate = ref(route.query.departDate || '')
const passengers = ref(route.query.passengers || 1)
const total = ref(route.query.total || 0)
const email = ref(route.query.email || '')
const airline = ref(route.query.airline || '')
const flightNumber = ref(route.query.flightNumber || '')
const seatNumber = ref(route.query.seatNumber || '')
const status = ref(route.query.status || 'confirmed')
const fromBooking = ref(route.query.fromBooking === 'true')

const copied = ref(false)
const redirectCountdown = ref(5)
const loading = ref(false)

const fetchBookingDetails = async () => {
    if (!bookingId.value) return
    
    loading.value = true
    try {
        const response = await bookingAPI.getById(bookingId.value)
        const booking = response.data
        
        // Update refs with backend data
        bookingRef.value = booking.booking_reference || `BK${booking.id}`
        origin.value = booking.flight?.origin || origin.value
        destination.value = booking.flight?.destination || destination.value
        departDate.value = booking.flight?.departure_time || departDate.value
        airline.value = booking.flight?.airline || airline.value
        flightNumber.value = booking.flight?.flight_number || flightNumber.value
        seatNumber.value = booking.seat_number || seatNumber.value
        total.value = booking.total_price || total.value
        status.value = booking.status?.toLowerCase() || status.value
    } catch (error) {
        console.error('Error fetching booking details:', error)
    } finally {
        loading.value = false
    }
}

const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const copyReference = async () => {
    try {
        await navigator.clipboard.writeText(bookingRef.value)
        copied.value = true
        setTimeout(() => {
            copied.value = false
        }, 2000)
    } catch (err) {
        alert('Booking reference: ' + bookingRef.value)
    }
}

const goToHome = () => {
    router.push({ name: 'home' })
}

const goToBookings = () => {
    router.push({ name: 'my-bookings' })
}

onMounted(async () => {
    // If no booking reference, redirect to home
    if (!bookingRef.value && !bookingId.value) {
        router.push({ name: 'home' })
        return
    }

    // Fetch full details if we have bookingId but missing other info
    if (bookingId.value && (!origin.value || !destination.value)) {
        await fetchBookingDetails()
    }

    // Auto redirect to bookings after 5 seconds ONLY if coming from booking completion
    if (fromBooking.value) {
        const countdownInterval = setInterval(() => {
            redirectCountdown.value--
            if (redirectCountdown.value <= 0) {
                clearInterval(countdownInterval)
                goToBookings()
            }
        }, 1000)
    }
})
</script>