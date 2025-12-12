<template>
    <div class="my-bookings">
        <div class="page-header">
            <h1>My trips</h1>
        </div>

        <div class="bookings-container">
            <div v-if="!isLoggedIn" class="login-prompt">
                <div class="prompt-card">
                    <h2>Sign in to see your trips</h2>
                    <p>View and manage your flight bookings</p>
                    <button @click="goToLogin" class="login-btn">Sign in</button>
                </div>
            </div>

            <div v-else-if="loading" class="loading-container">
                <div class="loading-spinner"></div>
                <p class="loading-text">Loading your bookings...</p>
            </div>

            <div v-else-if="bookings.length === 0" class="no-bookings">
                <div class="empty-state">
                    <h2>No trips yet</h2>
                    <p>When you book a flight, you'll see it here</p>
                    <button @click="goToSearch" class="search-btn">Search flights</button>
                </div>
            </div>

            <div v-else class="bookings-list">
                <div v-for="booking in bookings" :key="booking.id" class="booking-card">
                    <div class="booking-header">
                        <div class="booking-ref">
                            <span class="ref-label">Booking reference</span>
                            <span class="ref-number">{{ booking.reference }}</span>
                        </div>
                        <div :class="['status-badge', booking.status]">
                            {{ booking.status }}
                        </div>
                    </div>

                    <div class="booking-details">
                        <div class="route-section">
                            <div class="route">
                                <div class="city">{{ booking.origin }}</div>
                                <div class="arrow">→</div>
                                <div class="city">{{ booking.destination }}</div>
                            </div>
                            <div class="dates">
                                {{ formatDate(booking.departDate) }}
                                <span v-if="booking.returnDate"> - {{ formatDate(booking.returnDate) }}</span>
                            </div>
                        </div>

                        <div class="flight-info">
                            <div class="info-item">
                                <span class="label">Airline</span>
                                <span class="value">{{ booking.airline }}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Flight</span>
                                <span class="value">{{ booking.flightNumber }}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Passengers</span>
                                <span class="value">{{ booking.passengers }}</span>
                            </div>
                            <div class="info-item">
                                <span class="label">Total</span>
                                <span class="value price">${{ booking.total }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="booking-actions">
                        <button @click="viewDetails(booking)" class="btn-secondary">View details</button>
                        <button @click="manageBooking(booking)" class="btn-primary">Manage booking</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { bookingAPI } from '../services/api'

const router = useRouter()

const isLoggedIn = ref(false)
const bookings = ref([])
const loading = ref(false)

const checkAuth = () => {
    const user = localStorage.getItem('user')
    isLoggedIn.value = !!user
}

const fetchBookings = async () => {
    if (!isLoggedIn.value) return

    loading.value = true
    try {
        const response = await bookingAPI.getMyBookings()
        bookings.value = response.data.map(booking => ({
            id: booking.id,
            reference: booking.id,
            status: booking.status.toLowerCase(),
            origin: booking.flight?.origin || 'N/A',
            destination: booking.flight?.destination || 'N/A',
            departDate: booking.flight?.departure_time,
            returnDate: null,
            airline: booking.flight?.airline || 'N/A',
            flightNumber: booking.flight?.flight_number || 'N/A',
            passengers: 1,
            total: parseFloat(booking.total_price)
        }))
    } catch (error) {
        console.error('Error fetching bookings:', error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    checkAuth()
    fetchBookings()
})

const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

const goToLogin = () => {
    router.push({ name: 'login' })
}

const goToSearch = () => {
    router.push({ name: 'home' })
}

const viewDetails = (booking) => {
    router.push({
        name: 'confirmation',
        query: { bookingRef: booking.reference }
    })
}

const manageBooking = (booking) => {
    alert(`Manage booking: ${booking.reference}`)
}
</script>
