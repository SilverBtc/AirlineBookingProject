<template>
    <div class="booking-page">
        <div class="booking-container">
            <div class="booking-progress">
                <div class="progress-step active">
                    <div class="step-number">1</div>
                    <div class="step-label">Passenger Details</div>
                </div>
                <div class="progress-line"></div>
                <div class="progress-step">
                    <div class="step-number">2</div>
                    <div class="step-label">Payment</div>
                </div>
                <div class="progress-line"></div>
                <div class="progress-step">
                    <div class="step-number">3</div>
                    <div class="step-label">Confirmation</div>
                </div>
            </div>

            <div class="booking-content">
                <div class="booking-form">
                    <h2>Complete Your Booking</h2>

                    <form @submit.prevent="submitBooking">
                        <!-- Passenger Information -->
                        <section class="form-section">
                            <h3>Passenger Information</h3>

                            <div v-for="(passenger, index) in passengers" :key="index" class="passenger-form">
                                <h4>Passenger {{ index + 1 }}</h4>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label :for="`title-${index}`">Title *</label>
                                        <select :id="`title-${index}`" v-model="passenger.title" required>
                                            <option value="">Select</option>
                                            <option value="Mr">Mr</option>
                                            <option value="Ms">Ms</option>
                                            <option value="Mrs">Mrs</option>
                                            <option value="Dr">Dr</option>
                                        </select>
                                    </div>

                                    <div class="form-group">
                                        <label :for="`firstName-${index}`">First Name *</label>
                                        <input type="text" :id="`firstName-${index}`" v-model="passenger.firstName"
                                            placeholder="First Name" required />
                                    </div>

                                    <div class="form-group">
                                        <label :for="`lastName-${index}`">Last Name *</label>
                                        <input type="text" :id="`lastName-${index}`" v-model="passenger.lastName"
                                            placeholder="Last Name" required />
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label :for="`dob-${index}`">Date of Birth *</label>
                                        <input type="date" :id="`dob-${index}`" v-model="passenger.dateOfBirth"
                                            :max="maxDate" required />
                                    </div>

                                    <div class="form-group">
                                        <label :for="`passport-${index}`">Passport Number *</label>
                                        <input type="text" :id="`passport-${index}`" v-model="passenger.passportNumber"
                                            placeholder="Passport Number" required />
                                    </div>

                                    <div class="form-group">
                                        <label :for="`nationality-${index}`">Nationality *</label>
                                        <input type="text" :id="`nationality-${index}`" v-model="passenger.nationality"
                                            placeholder="Nationality" required />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- Contact Information -->
                        <section class="form-section">
                            <h3>Contact Information</h3>

                            <div class="form-row">
                                <div class="form-group">
                                    <label for="email">Email Address *</label>
                                    <input type="email" id="email" v-model="contactInfo.email"
                                        placeholder="your.email@example.com" required />
                                </div>

                                <div class="form-group">
                                    <label for="phone">Phone Number *</label>
                                    <input type="tel" id="phone" v-model="contactInfo.phone"
                                        placeholder="+1 (555) 123-4567" required />
                                </div>
                            </div>
                        </section>





                        <!-- Payment Information -->
                        <section class="form-section">
                            <h3>Payment Information</h3>

                            <div class="card-payment-form">
                                <div class="form-group">
                                    <label for="cardNumber">Card Number *</label>
                                    <input type="text" id="cardNumber" v-model="paymentInfo.cardNumber"
                                        @input="formatCardNumber" placeholder="1234 5678 9012 3456" maxlength="19"
                                        required />
                                </div>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="cardName">Name on Card *</label>
                                        <input type="text" id="cardName" v-model="paymentInfo.cardName"
                                            placeholder="John Doe" required />
                                    </div>

                                    <div class="form-group">
                                        <label for="expiry">Expiry Date *</label>
                                        <input type="text" id="expiry" v-model="paymentInfo.expiryDate"
                                            @input="formatExpiry" placeholder="MM/YY" maxlength="5" required />
                                    </div>

                                    <div class="form-group">
                                        <label for="cvv">CVV *</label>
                                        <input type="text" id="cvv" v-model="paymentInfo.cvv" placeholder="123"
                                            maxlength="4" required />
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="billingAddress">Billing Address *</label>
                                    <input type="text" id="billingAddress" v-model="paymentInfo.billingAddress"
                                        placeholder="123 Main St, City, Country" required />
                                </div>
                            </div>
                        </section>

                        <div class="form-actions">
                            <button type="button" @click="goBack" class="back-button">
                                Back to Results
                            </button>
                            <button type="button" @click="fillTestData" class="test-button">
                                🎲 Fill Test Data
                            </button>
                            <button type="submit" class="submit-button">
                                Complete Booking - ${{ totalPrice.toFixed(2) }}
                            </button>
                        </div>
                    </form>
                </div>

                <aside class="booking-summary">
                    <h3>Booking Summary</h3>

                    <div class="summary-section">
                        <h4>Flight Details</h4>

                        <!-- Outbound Flight -->
                        <div class="flight-detail-card">
                            <div class="flight-label">
                                <span class="flight-icon">✈</span>
                                <span class="flight-type">Outbound Flight</span>
                            </div>
                            <div class="summary-row">
                                <span>Route:</span>
                                <span class="route-text">{{ origin }} → {{ destination }}</span>
                            </div>
                            <div class="summary-row">
                                <span>Date:</span>
                                <span class="date-text">{{ departDate }}</span>
                            </div>
                        </div>

                        <!-- Return Flight (if roundtrip) -->
                        <div v-if="isRoundTrip" class="flight-detail-card return-flight">
                            <div class="flight-label">
                                <span class="flight-icon">✈</span>
                                <span class="flight-type">Return Flight</span>
                            </div>
                            <div class="summary-row">
                                <span>Route:</span>
                                <span class="route-text">{{ destination }} → {{ origin }}</span>
                            </div>
                            <div class="summary-row">
                                <span>Date:</span>
                                <span class="date-text">{{ returnDate }}</span>
                            </div>
                        </div>

                        <div class="summary-row passengers-row">
                            <span>Passengers:</span>
                            <span class="passenger-count">{{ passengerCount }}</span>
                        </div>
                    </div>

                    <div class="summary-section">
                        <h4>Price Breakdown</h4>
                        <div class="summary-row">
                            <span>Base Fare ({{ passengerCount }}x):</span>
                            <span>${{ basePrice }}</span>
                        </div>
                        <div class="summary-row">
                            <span>Taxes & Fees:</span>
                            <span>${{ taxes }}</span>
                        </div>
                        <div class="summary-divider"></div>
                        <div class="summary-row total">
                            <span>Total:</span>
                            <span>${{ totalPrice.toFixed(2) }}</span>
                        </div>
                    </div>

                    <div class="summary-features">
                        <div class="feature">
                            <span class="feature-icon">✓</span>
                            <span>Free Cancellation within 24h</span>
                        </div>
                        <div class="feature">
                            <span class="feature-icon">✓</span>
                            <span>Instant Confirmation</span>
                        </div>
                        <div class="feature">
                            <span class="feature-icon">✓</span>
                            <span>Secure Payment</span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>

        <!-- Terms Modal -->
        <div v-if="showTerms" class="modal-overlay" @click="showTerms = false">
            <div class="modal-content" @click.stop>
                <h3>Terms and Conditions</h3>
                <div class="terms-content">
                    <p><strong>1. Booking Agreement</strong></p>
                    <p>By completing this booking, you agree to the terms and conditions set forth by the airline and
                        our booking service.</p>

                    <p><strong>2. Payment</strong></p>
                    <p>All payments are processed securely. Your card will be charged immediately upon booking
                        confirmation.</p>

                    <p><strong>3. Cancellation Policy</strong></p>
                    <p>Free cancellation is available within 24 hours of booking. After that, cancellation fees may
                        apply according to the airline's policy.</p>

                    <p><strong>4. Travel Documents</strong></p>
                    <p>Passengers are responsible for ensuring they have valid travel documents including passports and
                        visas.</p>
                </div>
                <button @click="showTerms = false" class="close-modal">Close</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { bookingAPI } from '../services/api'

const router = useRouter()
const route = useRoute()

const origin = ref(route.query.origin || '')
const destination = ref(route.query.destination || '')
const departDate = ref(route.query.departDate || '')
const returnDate = ref(route.query.returnDate || '')
const returnFlightId = ref(route.query.returnFlightId || null)
const isRoundTrip = computed(() => !!returnFlightId.value && !!returnDate.value)
const passengerCount = ref(parseInt(route.query.passengers) || 1)
const basePrice = ref(parseFloat(route.query.price) || 0)

const passengers = ref([])
const contactInfo = ref({
    email: '',
    phone: ''
})

const specialRequests = ref({
    wheelchairAssistance: false,
    mealPreference: false,
    extraBaggage: false,
    additionalNotes: ''
})

const paymentInfo = ref({
    method: 'card',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    billingAddress: ''
})

const formatCardNumber = (e) => {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value
    paymentInfo.value.cardNumber = formattedValue
}

const formatExpiry = (e) => {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4)
    }
    paymentInfo.value.expiryDate = value
}

const acceptedTerms = ref(false)
const newsletter = ref(false)
const showTerms = ref(false)

const maxDate = computed(() => {
    const date = new Date()
    date.setFullYear(date.getFullYear() - 12)
    return date.toISOString().split('T')[0]
})

const taxes = computed(() => {
    return Math.round(basePrice.value * passengerCount.value * 0.15)
})

const totalPrice = computed(() => {
    return basePrice.value * passengerCount.value + taxes.value
})

onMounted(() => {
    // Initialize passenger forms
    for (let i = 0; i < passengerCount.value; i++) {
        passengers.value.push({
            title: '',
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            passportNumber: '',
            nationality: ''
        })
    }
})

const submitBooking = async () => {
    // Validate all required fields
    const allFieldsFilled = passengers.value.every(p =>
        p.title && p.firstName && p.lastName && p.dateOfBirth &&
        p.passportNumber && p.nationality
    )

    if (!allFieldsFilled || !contactInfo.value.email || !contactInfo.value.phone) {
        alert('Please fill in all required fields')
        return
    }

    try {
        const bookingData = {
            flight_id: route.query.flightId,
            seat_number: '12A',
            passengers: passengers.value,
            contact_info: contactInfo.value,
            payment_info: paymentInfo.value,
            total_price: totalPrice.value
        }

        const response = await bookingAPI.create(bookingData)
        console.log('Booking response:', response.data)

        const bookingReference = response.data.booking?.booking_reference || response.data.booking?.id || 'BK' + Date.now()

        console.log('Navigating to confirmation with ref:', bookingReference)

        // Navigate to confirmation page
        router.push({
            name: 'confirmation',
            query: {
                bookingRef: bookingReference,
                origin: origin.value,
                destination: destination.value,
                departDate: departDate.value,
                passengers: passengerCount.value,
                total: totalPrice.value,
                email: contactInfo.value.email,
                fromBooking: 'true'
            }
        })
    } catch (error) {
        console.error('Booking error:', error)
        const errorMsg = error.response?.data?.message || 'Booking failed'
        alert(errorMsg)
    }
}

const goBack = () => {
    router.back()
}

const fillTestData = () => {
    // Random names
    const firstNames = ['John', 'Emma', 'Michael', 'Sarah', 'David', 'Lisa', 'James', 'Emily', 'Robert', 'Anna']
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Wilson']
    const titles = ['Mr', 'Ms', 'Mrs', 'Dr']
    const nationalities = ['USA', 'UK', 'Canada', 'Australia', 'France', 'Germany', 'Spain', 'Italy', 'Japan', 'China']

    // Fill passengers with random data
    passengers.value.forEach(passenger => {
        passenger.title = titles[Math.floor(Math.random() * titles.length)]
        passenger.firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
        passenger.lastName = lastNames[Math.floor(Math.random() * lastNames.length)]

        // Random date of birth (between 18 and 70 years ago)
        const yearsAgo = 18 + Math.floor(Math.random() * 52)
        const birthDate = new Date()
        birthDate.setFullYear(birthDate.getFullYear() - yearsAgo)
        birthDate.setMonth(Math.floor(Math.random() * 12))
        birthDate.setDate(Math.floor(Math.random() * 28) + 1)
        passenger.dateOfBirth = birthDate.toISOString().split('T')[0]

        // Random passport number
        passenger.passportNumber = 'P' + Math.random().toString(36).substr(2, 8).toUpperCase()
        passenger.nationality = nationalities[Math.floor(Math.random() * nationalities.length)]
    })

    // Fill contact info
    contactInfo.value.email = `test${Math.floor(Math.random() * 9999)}@example.com`
    contactInfo.value.phone = `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`

    // Fill payment info with test card
    paymentInfo.value.cardNumber = '4532 1234 5678 9010'
    paymentInfo.value.cardName = passengers.value[0].firstName + ' ' + passengers.value[0].lastName

    // Random expiry date (future date)
    const month = Math.floor(Math.random() * 12) + 1
    const year = new Date().getFullYear() % 100 + Math.floor(Math.random() * 5) + 1
    paymentInfo.value.expiryDate = `${month.toString().padStart(2, '0')}/${year}`

    paymentInfo.value.cvv = Math.floor(Math.random() * 900) + 100
    paymentInfo.value.billingAddress = `${Math.floor(Math.random() * 9999) + 1} Main St, New York, NY 10001, USA`
}
</script>