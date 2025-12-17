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

        <!-- Cancel Confirmation Modal -->
        <div v-if="showCancelModal" class="modal-overlay" @click="closeCancelModal">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h3>Cancel Booking</h3>
                    <button @click="closeCancelModal" class="close-btn">×</button>
                </div>
                <div class="modal-body">
                    <div class="warning-icon">⚠️</div>
                    <p class="modal-question">Are you sure you want to cancel this booking?</p>
                    <div class="booking-summary" v-if="selectedBooking">
                        <div class="summary-row">
                            <span class="label">Booking Reference:</span>
                            <span class="value">{{ selectedBooking.reference }}</span>
                        </div>
                        <div class="summary-row">
                            <span class="label">Route:</span>
                            <span class="value">{{ selectedBooking.origin }} → {{ selectedBooking.destination }}</span>
                        </div>
                        <div class="summary-row">
                            <span class="label">Total Amount:</span>
                            <span class="value price">${{ selectedBooking.total }}</span>
                        </div>
                    </div>
                    <p class="refund-notice">You will receive a full refund within 3-5 business days.</p>
                </div>
                <div class="modal-footer">
                    <button @click="closeCancelModal" class="btn-secondary" :disabled="cancelLoading">Keep Booking</button>
                    <button @click="confirmCancel" class="btn-danger" :disabled="cancelLoading">
                        <span v-if="!cancelLoading">Cancel Booking</span>
                        <span v-else class="loading-text">
                            <span class="spinner-small"></span>
                            Cancelling...
                        </span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Success Modal -->
        <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal">
            <div class="modal-content success-modal" @click.stop>
                <div class="modal-header">
                    <h3>Booking Cancelled</h3>
                    <button @click="closeSuccessModal" class="close-btn">×</button>
                </div>
                <div class="modal-body">
                    <div class="success-icon">✓</div>
                    <p class="success-message">Your booking has been cancelled successfully.</p>
                    <p class="refund-info">Refund will be processed within 3-5 business days to your original payment method.</p>
                </div>
                <div class="modal-footer">
                    <button @click="closeSuccessModal" class="btn-primary">OK</button>
                </div>
            </div>
        </div>

        <!-- Error Modal -->
        <div v-if="showErrorModal" class="modal-overlay" @click="closeErrorModal">
            <div class="modal-content error-modal" @click.stop>
                <div class="modal-header">
                    <h3>Error</h3>
                    <button @click="closeErrorModal" class="close-btn">×</button>
                </div>
                <div class="modal-body">
                    <div class="error-icon">⨯</div>
                    <p class="error-message">{{ errorMessage }}</p>
                </div>
                <div class="modal-footer">
                    <button @click="closeErrorModal" class="btn-primary">Close</button>
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
const showCancelModal = ref(false)
const selectedBooking = ref(null)
const cancelLoading = ref(false)
const showSuccessModal = ref(false)
const showErrorModal = ref(false)
const errorMessage = ref('')

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
            reference: booking.booking_reference || `BK${booking.id}`,
            status: booking.status.toLowerCase(),
            origin: booking.flight?.origin || 'N/A',
            destination: booking.flight?.destination || 'N/A',
            departDate: booking.flight?.departure_time,
            returnDate: null,
            airline: booking.flight?.airline || 'N/A',
            flightNumber: booking.flight?.flight_number || 'N/A',
            passengers: booking.passengers?.length || 1,
            total: parseFloat(booking.total_price),
            seatNumber: booking.seat_number
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
        query: {
            bookingRef: booking.reference,
            bookingId: booking.id,
            origin: booking.origin,
            destination: booking.destination,
            departDate: booking.departDate,
            passengers: booking.passengers,
            total: booking.total,
            airline: booking.airline,
            flightNumber: booking.flightNumber,
            seatNumber: booking.seatNumber,
            status: booking.status
        }
    })
}

const manageBooking = (booking) => {
    if (booking.status === 'cancelled') {
        errorMessage.value = 'This booking is already cancelled'
        showErrorModal.value = true
        return
    }
    selectedBooking.value = booking
    showCancelModal.value = true
}

const confirmCancel = async () => {
    if (!selectedBooking.value) return
    
    cancelLoading.value = true
    try {
        await bookingAPI.cancel(selectedBooking.value.id)
        showCancelModal.value = false
        showSuccessModal.value = true
        // Refresh bookings list
        await fetchBookings()
    } catch (error) {
        console.error('Error cancelling booking:', error)
        errorMessage.value = error.response?.data?.message || 'Failed to cancel booking. Please try again or contact support.'
        showCancelModal.value = false
        showErrorModal.value = true
    } finally {
        cancelLoading.value = false
    }
}

const closeCancelModal = () => {
    showCancelModal.value = false
    selectedBooking.value = null
}

const closeSuccessModal = () => {
    showSuccessModal.value = false
    selectedBooking.value = null
}

const closeErrorModal = () => {
    showErrorModal.value = false
    errorMessage.value = ''
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
}

.modal-content {
    background: white;
    border-radius: 16px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: translateY(-50px) scale(0.9);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.modal-header {
    padding: 24px 24px 16px;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #202124;
}

.close-btn {
    background: none;
    border: none;
    font-size: 28px;
    color: #5f6368;
    cursor: pointer;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.2s;
}

.close-btn:hover {
    background: #f1f3f4;
}

.modal-body {
    padding: 24px;
    text-align: center;
}

.warning-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.success-icon {
    font-size: 56px;
    color: #34a853;
    background: #e6f4ea;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    font-weight: bold;
}

.error-icon {
    font-size: 56px;
    color: #ea4335;
    background: #fce8e6;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
}

.modal-question {
    font-size: 16px;
    font-weight: 500;
    color: #202124;
    margin-bottom: 20px;
}

.booking-summary {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 16px;
    margin: 20px 0;
    text-align: left;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #e0e0e0;
}

.summary-row:last-child {
    border-bottom: none;
}

.summary-row .label {
    color: #5f6368;
    font-size: 14px;
}

.summary-row .value {
    color: #202124;
    font-weight: 500;
    font-size: 14px;
}

.summary-row .value.price {
    color: #1967d2;
    font-size: 16px;
    font-weight: 600;
}

.refund-notice {
    color: #34a853;
    font-size: 14px;
    margin-top: 12px;
    font-weight: 500;
}

.success-message {
    font-size: 18px;
    font-weight: 500;
    color: #202124;
    margin-bottom: 12px;
}

.refund-info {
    color: #5f6368;
    font-size: 14px;
}

.error-message {
    font-size: 16px;
    color: #ea4335;
    font-weight: 500;
}

.modal-footer {
    padding: 16px 24px 24px;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
}

.btn-secondary,
.btn-primary,
.btn-danger {
    padding: 10px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
}

.btn-secondary {
    background: #f1f3f4;
    color: #5f6368;
}

.btn-secondary:hover:not(:disabled) {
    background: #e8eaed;
}

.btn-primary {
    background: #1967d2;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background: #1557b0;
}

.btn-danger {
    background: #ea4335;
    color: white;
    min-width: 140px;
}

.btn-danger:hover:not(:disabled) {
    background: #d33426;
}

.btn-secondary:disabled,
.btn-primary:disabled,
.btn-danger:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.loading-text {
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.spinner-small {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
