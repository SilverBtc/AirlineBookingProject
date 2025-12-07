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

      <div v-else-if="bookings.length === 0" class="no-bookings">
        <div class="empty-state">
          <div class="empty-icon">✈️</div>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isLoggedIn = ref(false)

const checkAuth = () => {
  const user = localStorage.getItem('user')
  isLoggedIn.value = !!user
}

checkAuth()

const bookings = ref([
  {
    id: 1,
    reference: 'SKY123ABC',
    status: 'confirmed',
    origin: 'New York (JFK)',
    destination: 'London (LHR)',
    departDate: '2025-12-20',
    returnDate: '2025-12-28',
    airline: 'American Airlines',
    flightNumber: 'AA 101',
    passengers: 2,
    total: 1300
  },
  {
    id: 2,
    reference: 'SKY456DEF',
    status: 'upcoming',
    origin: 'Los Angeles (LAX)',
    destination: 'Tokyo (HND)',
    departDate: '2026-01-15',
    returnDate: null,
    airline: 'Delta',
    flightNumber: 'DL 204',
    passengers: 1,
    total: 680
  }
])

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
