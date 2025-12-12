<template>
    <div class="seat-selection-page">
        <div class="seat-selection-container">
            <div class="selection-header">
                <button @click="goBack" class="back-btn">← Back to Flights</button>
                <h1>Select Your Seats</h1>
                <p class="subtitle">{{ passengersCount }} passenger{{ passengersCount > 1 ? 's' : '' }} • {{ travelClass }}</p>
            </div>

            <div class="selection-content">
                <div class="seat-map-section">
                    <SeatMap 
                        v-model="selectedSeats" 
                        :passengersCount="passengersCount"
                        :travelClass="travelClass"
                        :occupiedSeats="occupiedSeats"
                        @update:seatPrice="updateSeatPrice"
                    />
                </div>

                <aside class="selection-summary">
                    <h3>Booking Summary</h3>
                    
                    <div class="summary-section">
                        <h4>Flight Details</h4>
                        <div class="flight-info">
                            <div class="info-row">
                                <span>Route:</span>
                                <span class="value">{{ origin }} → {{ destination }}</span>
                            </div>
                            <div class="info-row">
                                <span>Date:</span>
                                <span class="value">{{ departDate }}</span>
                            </div>
                            <div class="info-row">
                                <span>Class:</span>
                                <span class="value capitalize">{{ travelClass }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="summary-section">
                        <h4>Selected Seats</h4>
                        <div class="seats-list">
                            <div v-if="selectedSeats.length === 0" class="no-seats">
                                No seats selected
                            </div>
                            <div v-for="(seat, index) in selectedSeats" :key="seat" class="seat-item">
                                <span class="seat-label">Passenger {{ index + 1 }}:</span>
                                <span class="seat-number">{{ seat }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="summary-section">
                        <h4>Price Breakdown</h4>
                        <div class="price-rows">
                            <div class="price-row">
                                <span>Base Fare ({{ passengersCount }}x):</span>
                                <span>${{ basePrice }}</span>
                            </div>
                            <div v-if="seatPrice > 0" class="price-row">
                                <span>Seat Selection:</span>
                                <span>${{ seatPrice.toFixed(2) }}</span>
                            </div>
                            <div class="price-row">
                                <span>Taxes & Fees:</span>
                                <span>${{ taxes }}</span>
                            </div>
                            <div class="price-divider"></div>
                            <div class="price-row total">
                                <span>Total:</span>
                                <span>${{ totalPrice.toFixed(2) }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="selection-warning" v-if="selectedSeats.length !== passengersCount">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="#ff9800" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>Please select {{ passengersCount }} seat{{ passengersCount > 1 ? 's' : '' }}</span>
                    </div>

                    <button 
                        @click="proceedToBooking" 
                        class="proceed-btn"
                        :disabled="selectedSeats.length !== passengersCount"
                    >
                        Continue to Booking
                    </button>
                </aside>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SeatMap from './SeatMap.vue'
import { flightAPI } from '../services/api'

const router = useRouter()
const route = useRoute()

const flightId = ref(route.query.flightId)
const returnFlightId = ref(route.query.returnFlightId)
const origin = ref(route.query.origin || '')
const destination = ref(route.query.destination || '')
const departDate = ref(route.query.departDate || '')
const returnDate = ref(route.query.returnDate || '')
const passengersCount = ref(parseInt(route.query.passengers) || 1)
const basePrice = ref(parseFloat(route.query.price) || 0)
const travelClass = ref(route.query.travelClass || 'economy')

const selectedSeats = ref([])
const seatPrice = ref(0)
const occupiedSeats = ref([])

const taxes = computed(() => {
    return Math.round((basePrice.value + seatPrice.value) * 0.15)
})

const totalPrice = computed(() => {
    return basePrice.value + seatPrice.value + taxes.value
})

const updateSeatPrice = (price) => {
    seatPrice.value = price
}

const loadOccupiedSeats = async () => {
    try {
        if (!flightId.value) {
            console.warn('No flight ID provided')
            return
        }
        
        const response = await flightAPI.getOccupiedSeats(flightId.value)
        occupiedSeats.value = response.data || []
    } catch (error) {
        console.error('Error loading occupied seats:', error)
        // Si erreur, garder la liste vide plutôt que d'afficher une erreur à l'utilisateur
        occupiedSeats.value = []
    }
}

const goBack = () => {
    router.back()
}

const proceedToBooking = () => {
    if (selectedSeats.value.length !== passengersCount.value) {
        alert(`Please select exactly ${passengersCount.value} seat${passengersCount.value > 1 ? 's' : ''}`)
        return
    }

    router.push({
        name: 'booking',
        query: {
            flightId: flightId.value,
            returnFlightId: returnFlightId.value,
            origin: origin.value,
            destination: destination.value,
            departDate: departDate.value,
            returnDate: returnDate.value,
            passengers: passengersCount.value,
            price: totalPrice.value.toFixed(2),
            seats: selectedSeats.value.join(','),
            seatPrice: seatPrice.value.toFixed(2)
        }
    })
}

onMounted(() => {
    loadOccupiedSeats()
})
</script>

<style scoped>
.seat-selection-page {
    min-height: 100vh;
    background: #f8f9fa;
    padding: 20px;
}

.seat-selection-container {
    max-width: 1400px;
    margin: 0 auto;
}

.selection-header {
    margin-bottom: 30px;
}

.back-btn {
    background: white;
    border: 1px solid #dadce0;
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    color: #5f6368;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 20px;
}

.back-btn:hover {
    background: #f8f9fa;
    border-color: #5B9BD5;
    color: #5B9BD5;
}

.selection-header h1 {
    font-size: 32px;
    color: #202124;
    margin-bottom: 8px;
}

.selection-header .subtitle {
    font-size: 16px;
    color: #5f6368;
}

.selection-content {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 30px;
}

.seat-map-section {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.selection-summary {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    height: fit-content;
    position: sticky;
    top: 20px;
}

.selection-summary h3 {
    font-size: 20px;
    color: #202124;
    margin-bottom: 20px;
}

.summary-section {
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e0e0e0;
}

.summary-section:last-of-type {
    border-bottom: none;
}

.summary-section h4 {
    font-size: 14px;
    color: #5f6368;
    margin-bottom: 12px;
    font-weight: 600;
}

.flight-info,
.price-rows {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.info-row,
.price-row {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
}

.info-row span:first-child,
.price-row span:first-child {
    color: #5f6368;
}

.info-row .value {
    font-weight: 500;
    color: #202124;
}

.capitalize {
    text-transform: capitalize;
}

.seats-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.no-seats {
    font-size: 14px;
    color: #9e9e9e;
    font-style: italic;
    text-align: center;
    padding: 12px;
}

.seat-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 12px;
    background: #f8f9fa;
    border-radius: 6px;
    font-size: 14px;
}

.seat-label {
    color: #5f6368;
}

.seat-number {
    font-weight: 600;
    color: #1967d2;
}

.price-divider {
    height: 1px;
    background: #e0e0e0;
    margin: 8px 0;
}

.price-row.total {
    font-size: 18px;
    font-weight: 600;
    color: #1967d2;
}

.selection-warning {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    background: #fff3e0;
    border: 1px solid #ff9800;
    border-radius: 8px;
    margin-bottom: 16px;
}

.selection-warning span {
    font-size: 13px;
    color: #e65100;
    font-weight: 500;
}

.proceed-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #5B9BD5 0%, #2B7CB8 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.proceed-btn:hover:not(:disabled) {
    box-shadow: 0 4px 12px rgba(43, 124, 184, 0.3);
    transform: translateY(-2px);
}

.proceed-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #9e9e9e;
}

@media (max-width: 1200px) {
    .selection-content {
        grid-template-columns: 1fr;
    }

    .selection-summary {
        position: static;
    }
}
</style>
