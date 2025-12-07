<template>
  <div class="flight-search">
    <div class="search-header">
      <h1>Find Your Perfect Flight</h1>
      <p>Search flights from hundreds of airlines</p>
    </div>

    <div class="search-container">
      <div class="trip-type">
        <label>
          <input type="radio" v-model="tripType" value="roundtrip" />
          Round Trip
        </label>
        <label>
          <input type="radio" v-model="tripType" value="oneway" />
          One Way
        </label>
      </div>

      <form @submit.prevent="searchFlights" class="search-form">
        <div class="form-row">
          <div class="form-group">
            <label for="origin">From</label>
            <input
              type="text"
              id="origin"
              v-model="searchParams.origin"
              placeholder="City or Airport"
              required
              list="origin-airports"
            />
            <datalist id="origin-airports">
              <option value="New York (JFK)">New York - John F. Kennedy International</option>
              <option value="Los Angeles (LAX)">Los Angeles International</option>
              <option value="Chicago (ORD)">Chicago O'Hare International</option>
              <option value="London (LHR)">London Heathrow</option>
              <option value="Paris (CDG)">Paris Charles de Gaulle</option>
              <option value="Tokyo (HND)">Tokyo Haneda</option>
              <option value="Dubai (DXB)">Dubai International</option>
              <option value="Singapore (SIN)">Singapore Changi</option>
            </datalist>
          </div>

          <div class="form-group">
            <label for="destination">To</label>
            <input
              type="text"
              id="destination"
              v-model="searchParams.destination"
              placeholder="City or Airport"
              required
              list="destination-airports"
            />
            <datalist id="destination-airports">
              <option value="New York (JFK)">New York - John F. Kennedy International</option>
              <option value="Los Angeles (LAX)">Los Angeles International</option>
              <option value="Chicago (ORD)">Chicago O'Hare International</option>
              <option value="London (LHR)">London Heathrow</option>
              <option value="Paris (CDG)">Paris Charles de Gaulle</option>
              <option value="Tokyo (HND)">Tokyo Haneda</option>
              <option value="Dubai (DXB)">Dubai International</option>
              <option value="Singapore (SIN)">Singapore Changi</option>
            </datalist>
          </div>

          <div class="form-group">
            <label for="departDate">Departure</label>
            <input
              type="date"
              id="departDate"
              v-model="searchParams.departDate"
              :min="today"
              required
            />
          </div>

          <div class="form-group" v-if="tripType === 'roundtrip'">
            <label for="returnDate">Return</label>
            <input
              type="date"
              id="returnDate"
              v-model="searchParams.returnDate"
              :min="searchParams.departDate || today"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="passengers">Passengers</label>
            <select id="passengers" v-model="searchParams.passengers">
              <option v-for="n in 9" :key="n" :value="n">{{ n }} {{ n === 1 ? 'Passenger' : 'Passengers' }}</option>
            </select>
          </div>

          <div class="form-group">
            <label for="class">Class</label>
            <select id="class" v-model="searchParams.travelClass">
              <option value="economy">Economy</option>
              <option value="premium">Premium Economy</option>
              <option value="business">Business</option>
              <option value="first">First Class</option>
            </select>
          </div>


        </div>

        <button type="submit" class="search-button">
          Search Flights
        </button>
      </form>
    </div>


  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const tripType = ref('roundtrip')
const searchParams = ref({
  origin: '',
  destination: '',
  departDate: '',
  returnDate: '',
  passengers: 1,
  travelClass: 'economy',
  directFlights: false
})

const today = computed(() => {
  const date = new Date()
  return date.toISOString().split('T')[0]
})

const searchFlights = () => {
  if (!searchParams.value.origin || !searchParams.value.destination || !searchParams.value.departDate) {
    alert('Please fill in all required fields')
    return
  }

  router.push({
    name: 'results',
    query: {
      ...searchParams.value,
      tripType: tripType.value
    }
  })
}


</script>
