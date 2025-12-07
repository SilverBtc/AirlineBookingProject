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

const router = useRouter()
const route = useRoute()

const bookingRef = ref(route.query.bookingRef || '')
const origin = ref(route.query.origin || '')
const destination = ref(route.query.destination || '')
const departDate = ref(route.query.departDate || '')
const passengers = ref(route.query.passengers || 1)
const total = ref(route.query.total || 0)
const email = ref(route.query.email || '')
const fromBooking = ref(route.query.fromBooking === 'true')

const copied = ref(false)
const redirectCountdown = ref(5)

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

onMounted(() => {
    // If no booking reference, redirect to home
    if (!bookingRef.value) {
        router.push({ name: 'home' })
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