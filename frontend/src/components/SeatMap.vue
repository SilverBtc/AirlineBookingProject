<template>
    <div class="seat-map-container">
        <div class="seat-map-header">
            <h3>Select Your Seats</h3>
            <p>{{ selectedSeats.length }} of {{ passengersCount }} seat(s) selected</p>
            <p class="seat-pricing-info" v-if="totalSeatPrice > 0">Seat selection fee: ${{ totalSeatPrice }}</p>
            <button @click="assignRandomSeats" class="random-seats-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 2V14M2 8H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Assign Free Random Seats
            </button>
        </div>

        <div class="seat-legend">
            <div class="legend-item">
                <div class="seat-icon available"></div>
                <span>Economy (Free)</span>
            </div>
            <div class="legend-item">
                <div class="seat-icon selected"></div>
                <span>Selected</span>
            </div>
            <div class="legend-item">
                <div class="seat-icon occupied"></div>
                <span>Occupied</span>
            </div>
            <div class="legend-item">
                <div class="seat-icon extra-legroom"></div>
                <span>Extra Legroom (+$15)</span>
            </div>
            <div class="legend-item">
                <div class="seat-icon premium-economy"></div>
                <span>Premium Economy (+$35)</span>
            </div>
            <div class="legend-item">
                <div class="seat-icon business-class"></div>
                <span>Business Class (+$50)</span>
            </div>
            <div class="legend-item">
                <div class="seat-icon first-class"></div>
                <span>First Class (+$75)</span>
            </div>
        </div>

        <div class="airplane-container">
            <div class="cockpit">
                <div class="cockpit-front"></div>
            </div>

            <div class="cabin">
                <!-- First Class (Rows 1-2) -->
                <div class="class-section">
                    <div class="section-label">First Class</div>
                    <div v-for="row in firstClassRows" :key="row" class="seat-row first-class">
                        <div class="row-number">{{ row }}</div>
                        <div class="seats-group left">
                            <button type="button" v-for="seat in ['A', 'C']" :key="`${row}${seat}`"
                                :class="getSeatClass(row, seat)" @click="selectSeat(row, seat)"
                                :disabled="isSeatOccupied(row, seat)" 
                                :aria-label="`Seat ${row}${seat} - First Class - $75`">
                                {{ seat }}
                            </button>
                        </div>
                        <div class="aisle"></div>
                        <div class="seats-group right">
                            <button type="button" v-for="seat in ['D', 'F']" :key="`${row}${seat}`"
                                :class="getSeatClass(row, seat)" @click="selectSeat(row, seat)"
                                :disabled="isSeatOccupied(row, seat)" 
                                :aria-label="`Seat ${row}${seat} - First Class - $75`">
                                {{ seat }}
                            </button>
                        </div>
                        <div class="row-number">{{ row }}</div>
                    </div>
                </div>

                <div class="class-divider"></div>

                <div class="class-section">
                    <div class="section-label">Business Class</div>
                    <div v-for="row in businessClassRows" :key="row" class="seat-row business">
                        <div class="row-number">{{ row }}</div>
                        <div class="seats-group left">
                            <button type="button" v-for="seat in ['A', 'C']" :key="`${row}${seat}`"
                                :class="getSeatClass(row, seat)" @click="selectSeat(row, seat)"
                                :disabled="isSeatOccupied(row, seat)" 
                                :aria-label="`Seat ${row}${seat} - Business Class - $50`">
                                {{ seat }}
                            </button>
                        </div>
                        <div class="aisle"></div>
                        <div class="seats-group right">
                            <button type="button" v-for="seat in ['D', 'F']" :key="`${row}${seat}`"
                                :class="getSeatClass(row, seat)" @click="selectSeat(row, seat)"
                                :disabled="isSeatOccupied(row, seat)" 
                                :aria-label="`Seat ${row}${seat} - Business Class - $50`">
                                {{ seat }}
                            </button>
                        </div>
                        <div class="row-number">{{ row }}</div>
                    </div>
                </div>

                <div class="class-divider"></div>

                <div class="class-section">
                    <div class="section-label">Premium Economy</div>
                    <div v-for="row in premiumEconomyRows" :key="row" class="seat-row premium-economy">
                        <div class="row-number">{{ row }}</div>
                        <div class="seats-group left">
                            <button type="button" v-for="seat in ['A', 'B', 'C']" :key="`${row}${seat}`"
                                :class="getSeatClass(row, seat)" @click="selectSeat(row, seat)"
                                :disabled="isSeatOccupied(row, seat)" 
                                :aria-label="`Seat ${row}${seat} - Premium Economy - $35`">
                                {{ seat }}
                            </button>
                        </div>
                        <div class="aisle"></div>
                        <div class="seats-group right">
                            <button type="button" v-for="seat in ['D', 'E', 'F']" :key="`${row}${seat}`"
                                :class="getSeatClass(row, seat)" @click="selectSeat(row, seat)"
                                :disabled="isSeatOccupied(row, seat)" 
                                :aria-label="`Seat ${row}${seat} - Premium Economy - $35`">
                                {{ seat }}
                            </button>
                        </div>
                        <div class="row-number">{{ row }}</div>
                    </div>
                </div>

                <div class="class-divider"></div>

                <!-- Economy Class (Rows 6-29) -->
                <div class="class-section">
                    <div class="section-label">Economy Class</div>
                    <div v-for="row in economyRows" :key="row" class="seat-row economy">
                        <div class="row-number">{{ row }}</div>
                        <div class="seats-group left">
                            <button type="button" v-for="seat in ['A', 'B', 'C']" :key="`${row}${seat}`"
                                :class="getSeatClass(row, seat)" @click="selectSeat(row, seat)"
                                :disabled="isSeatOccupied(row, seat)" :aria-label="`Seat ${row}${seat}`">
                                {{ seat }}
                            </button>
                        </div>
                        <div class="aisle"></div>
                        <div class="seats-group right">
                            <button type="button" v-for="seat in ['D', 'E', 'F']" :key="`${row}${seat}`"
                                :class="getSeatClass(row, seat)" @click="selectSeat(row, seat)"
                                :disabled="isSeatOccupied(row, seat)" :aria-label="`Seat ${row}${seat}`">
                                {{ seat }}
                            </button>
                        </div>
                        <div class="row-number">{{ row }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    modelValue: {
        type: Array,
        default: () => []
    },
    passengersCount: {
        type: Number,
        required: true
    },
    travelClass: {
        type: String,
        default: 'economy'
    },
    occupiedSeats: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['update:modelValue', 'update:seatPrice'])

const selectedSeats = ref([...props.modelValue])

const firstClassRows = [1, 2]
const businessClassRows = [3, 4, 5]
const premiumEconomyRows = [6, 7, 8]
const economyRows = Array.from({ length: 21 }, (_, i) => i + 9)

const exitRows = [12, 22]

const seatPricing = {
    firstClass: 75,
    businessClass: 50,
    premiumEconomy: 35,
    exitRow: 15,
    economy: 0
}

const occupiedSeats = ref([...props.occupiedSeats])

watch(() => props.occupiedSeats, (newVal) => {
    occupiedSeats.value = [...newVal]
}, { deep: true })

const isSeatOccupied = (row, seat) => {
    return occupiedSeats.value.includes(`${row}${seat}`)
}

const isSeatSelected = (row, seat) => {
    return selectedSeats.value.includes(`${row}${seat}`)
}

const isExitRow = (row) => {
    return exitRows.includes(row)
}

const getSeatClassCategory = (row) => {
    if (firstClassRows.includes(row)) return 'first'
    if (businessClassRows.includes(row)) return 'business'
    if (premiumEconomyRows.includes(row)) return 'premium'
    return 'economy'
}

const canSelectSeat = (row) => {
    const seatClass = getSeatClassCategory(row)
    const travelClass = props.travelClass.toLowerCase()
    
    // Business class can only select business or first class (NOT lower classes)
    // First class can only select first class (NOT lower classes)
    const allowedClasses = {
        'economy': ['economy', 'premium', 'business', 'first'], // Economy can upgrade
        'premium': ['premium', 'business', 'first'], // Premium cannot downgrade to economy
        'business': ['business', 'first'], // Business cannot downgrade
        'first': ['first'] // First class only
    }
    
    return allowedClasses[travelClass]?.includes(seatClass) || false
}

const getSeatPrice = (row) => {
    if (firstClassRows.includes(row)) return seatPricing.firstClass
    if (businessClassRows.includes(row)) return seatPricing.businessClass
    if (premiumEconomyRows.includes(row)) return seatPricing.premiumEconomy
    if (exitRows.includes(row)) return seatPricing.exitRow
    return seatPricing.economy
}

const totalSeatPrice = computed(() => {
    return selectedSeats.value.reduce((total, seatCode) => {
        const row = parseInt(seatCode)
        return total + getSeatPrice(row)
    }, 0)
})

const getSeatClass = (row, seat) => {
    const classes = ['seat']
    const seatCode = `${row}${seat}`

    if (isSeatOccupied(row, seat)) {
        classes.push('occupied')
    } else if (isSeatSelected(row, seat)) {
        classes.push('selected')
    } else if (!canSelectSeat(row)) {
        classes.push('not-allowed')
    } else {
        classes.push('available')
    }

    if (firstClassRows.includes(row)) {
        classes.push('first-class-seat')
    } else if (businessClassRows.includes(row)) {
        classes.push('business-class-seat')
    } else if (premiumEconomyRows.includes(row)) {
        classes.push('premium-economy-seat')
    } else if (isExitRow(row)) {
        classes.push('extra-legroom')
    }

    return classes.join(' ')
}

const selectSeat = (row, seat) => {
    const seatCode = `${row}${seat}`

    if (isSeatOccupied(row, seat) || !canSelectSeat(row)) return

    const index = selectedSeats.value.indexOf(seatCode)

    if (index > -1) {
        // Deselect seat
        selectedSeats.value.splice(index, 1)
    } else {
        // Select seat if limit not reached
        if (selectedSeats.value.length < props.passengersCount) {
            selectedSeats.value.push(seatCode)
        }
    }

    emit('update:modelValue', selectedSeats.value)
    emit('update:seatPrice', totalSeatPrice.value)
}

const assignRandomSeats = () => {
    // Clear current selection
    selectedSeats.value = []
    
    // Get all available economy seats (free seats)
    const availableEconomySeats = []
    
    economyRows.forEach(row => {
        ['A', 'B', 'C', 'D', 'E', 'F'].forEach(seat => {
            const seatCode = `${row}${seat}`
            if (!isSeatOccupied(row, seat) && !isExitRow(row)) {
                availableEconomySeats.push(seatCode)
            }
        })
    })
    
    // Shuffle and select required number of seats
    const shuffled = availableEconomySeats.sort(() => Math.random() - 0.5)
    selectedSeats.value = shuffled.slice(0, props.passengersCount)
    
    emit('update:modelValue', selectedSeats.value)
    emit('update:seatPrice', 0) // Random seats are free (economy)
}

watch(() => props.modelValue, (newValue) => {
    selectedSeats.value = [...newValue]
}, { deep: true })

watch(() => props.passengersCount, () => {
    // Reset if passenger count changes
    if (selectedSeats.value.length > props.passengersCount) {
        selectedSeats.value = []
        emit('update:modelValue', selectedSeats.value)
        emit('update:seatPrice', 0)
    }
})

watch(totalSeatPrice, (newPrice) => {
    emit('update:seatPrice', newPrice)
}, { immediate: true })
</script>

<style scoped>
.seat-map-container {
    background: white;
    border-radius: 8px;
    padding: 24px;
    border: 1px solid #dadce0;
}

.seat-map-header {
    text-align: center;
    margin-bottom: 20px;
}

.seat-map-header h3 {
    font-size: 20px;
    color: #202124;
    margin-bottom: 8px;
}

.seat-map-header p {
    font-size: 14px;
    color: #5f6368;
}

.seat-pricing-info {
    font-weight: 600;
    color: #1967d2;
    margin-top: 4px;
}

.random-seats-btn {
    margin-top: 12px;
    padding: 10px 20px;
    background: #34a853;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.random-seats-btn:hover {
    background: #2d9249;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(52, 168, 83, 0.3);
}

.random-seats-btn svg {
    transform: rotate(45deg);
}

.seat-legend {
    display: flex;
    justify-content: center;
    gap: 24px;
    margin-bottom: 24px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    flex-wrap: wrap;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.seat-icon {
    width: 32px;
    height: 32px;
    border-radius: 6px 6px 8px 8px;
    border: 2px solid #dadce0;
}

.seat-icon.available {
    background: white;
    border-color: #1967d2;
}

.seat-icon.selected {
    background: #1967d2;
    border-color: #1967d2;
}

.seat-icon.occupied {
    background: #e0e0e0;
    border-color: #9e9e9e;
}

.seat-icon.extra-legroom {
    background: #e8f5e9;
    border-color: #4caf50;
}

.seat-icon.premium-economy {
    background: #fff3e0;
    border-color: #ff9800;
}

.seat-icon.business-class {
    background: #e1f5fe;
    border-color: #03a9f4;
}

.seat-icon.first-class {
    background: #f3e5f5;
    border-color: #9c27b0;
}

.legend-item span {
    font-size: 13px;
    color: #5f6368;
}

.airplane-container {
    max-width: 400px;
    margin: 0 auto;
    background: linear-gradient(180deg, #f5f5f5 0%, #ffffff 100%);
    border-radius: 20px;
    padding: 20px 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cockpit {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.cockpit-front {
    width: 60px;
    height: 40px;
    background: #1967d2;
    border-radius: 50% 50% 0 0;
    box-shadow: 0 2px 8px rgba(25, 103, 210, 0.3);
}

.cabin {
    padding: 0 10px;
}

.class-section {
    margin-bottom: 20px;
}

.section-label {
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    color: #5f6368;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 12px;
    padding: 8px;
    background: #f8f9fa;
    border-radius: 4px;
}

.class-divider {
    height: 2px;
    background: linear-gradient(90deg, transparent, #dadce0, transparent);
    margin: 20px 0;
}

.seat-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    gap: 4px;
}

.seat-row.business {
    margin-bottom: 6px;
}

.row-number {
    font-size: 11px;
    font-weight: 600;
    color: #5f6368;
    min-width: 20px;
    text-align: center;
}

.seats-group {
    display: flex;
    gap: 4px;
}

.seats-group.left,
.seats-group.right {
    flex: 1;
}

.seats-group.left {
    justify-content: flex-end;
}

.seats-group.right {
    justify-content: flex-start;
}

.aisle {
    width: 24px;
}

.seat {
    width: 36px;
    height: 36px;
    border-radius: 6px 6px 8px 8px;
    border: 2px solid #dadce0;
    background: white;
    font-size: 11px;
    font-weight: 600;
    color: #5f6368;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.seat.available {
    border-color: #1967d2;
    color: #1967d2;
}

.seat.available:hover {
    background: #e8f0fe;
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(25, 103, 210, 0.3);
}

.seat.selected {
    background: #1967d2;
    border-color: #1967d2;
    color: white;
    box-shadow: 0 2px 8px rgba(25, 103, 210, 0.4);
}

.seat.occupied {
    background: #e0e0e0;
    border-color: #9e9e9e;
    color: #9e9e9e;
    cursor: not-allowed;
}

.seat.not-allowed {
    background: #f5f5f5;
    border-color: #e0e0e0;
    color: #bdbdbd;
    cursor: not-allowed;
    opacity: 0.4;
}

.seat.extra-legroom.available {
    border-color: #4caf50;
    background: #e8f5e9;
}

.seat.extra-legroom.available:hover {
    background: #c8e6c9;
}

.seat.premium-economy-seat.available {
    border-color: #ff9800;
    background: #fff3e0;
}

.seat.premium-economy-seat.available:hover {
    background: #ffe0b2;
}

.seat.business-class-seat.available {
    border-color: #03a9f4;
    background: #e1f5fe;
}

.seat.business-class-seat.available:hover {
    background: #b3e5fc;
}

.seat.first-class-seat.available {
    border-color: #9c27b0;
    background: #f3e5f5;
}

.seat.first-class-seat.available:hover {
    background: #e1bee7;
}

@media (max-width: 768px) {
    .seat-map-container {
        padding: 16px;
    }

    .airplane-container {
        max-width: 100%;
    }

    .seat {
        width: 32px;
        height: 32px;
        font-size: 10px;
    }

    .seat-legend {
        flex-wrap: wrap;
        gap: 12px;
    }

    .legend-item {
        flex-basis: 45%;
    }
}
</style>
