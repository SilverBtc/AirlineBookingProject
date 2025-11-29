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
            <div class="detail-item">
              <div class="detail-label">Passengers</div>
              <div class="detail-value">{{ passengers }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Total Paid</div>
              <div class="detail-value total-amount">${{ total }}</div>
            </div>
          </div>
        </section>


      </div>

      <div class="action-buttons">
        <button @click="goToHome" class="home-button">
          Book Another Flight
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const bookingRef = ref(route.query.bookingRef || '')
const origin = ref(route.query.origin || '')
const destination = ref(route.query.destination || '')
const departDate = ref(route.query.departDate || '')
const passengers = ref(route.query.passengers || 1)
const total = ref(route.query.total || 0)
const email = ref(route.query.email || '')

const copied = ref(false)

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

onMounted(() => {
  // If no booking reference, redirect to home
  if (!bookingRef.value) {
    router.push({ name: 'home' })
  }
})
</script>