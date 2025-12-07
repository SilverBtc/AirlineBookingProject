<template>
  <div class="flight-search">
    <div class="search-header">
      <h1>Flights</h1>
    </div>

    <div class="search-card">
      <div class="trip-selector">
        <button 
          :class="['trip-btn', { active: tripType === 'roundtrip' }]"
          @click="tripType = 'roundtrip'"
        >
          Round trip
        </button>
        <button 
          :class="['trip-btn', { active: tripType === 'oneway' }]"
          @click="tripType = 'oneway'"
        >
          One way
        </button>
      </div>

      <form @submit.prevent="searchFlights" class="search-form">
        <div class="main-inputs">
          <div class="input-group from-to">
            <div class="input-wrapper">
              <label>Where from?</label>
              <input
                type="text"
                v-model="searchParams.origin"
                placeholder="City or airport"
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
            
            <button type="button" class="swap-btn" @click="swapLocations">⇄</button>
            
            <div class="input-wrapper">
              <label>Where to?</label>
              <input
                type="text"
                v-model="searchParams.destination"
                placeholder="City or airport"
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
          </div>

          <div class="input-group dates">
            <div class="input-wrapper">
              <label>Departure</label>
              <input
                type="date"
                v-model="searchParams.departDate"
                :min="today"
                required
              />
            </div>

            <div class="input-wrapper" v-if="tripType === 'roundtrip'">
              <label>Return</label>
              <input
                type="date"
                v-model="searchParams.returnDate"
                :min="searchParams.departDate || today"
              />
            </div>
          </div>

          <div class="input-group travelers" style="position: relative;">
            <div class="input-wrapper" @click.stop="showTravelersDropdown = !showTravelersDropdown">
              <label>Travelers</label>
              <div class="travelers-display">
                {{ searchParams.passengers }} passenger{{ searchParams.passengers > 1 ? 's' : '' }}, {{ searchParams.travelClass }}
              </div>
            </div>

            <div v-if="showTravelersDropdown" class="travelers-dropdown" @click.stop>
              <div class="traveler-row">
                <span>Passengers</span>
                <div class="counter">
                  <button type="button" @click.prevent="decrementPassengers">−</button>
                  <span>{{ searchParams.passengers }}</span>
                  <button type="button" @click.prevent="incrementPassengers">+</button>
                </div>
              </div>
              <div class="class-options">
                <label v-for="cls in cabinClasses" :key="cls.value" @click.stop>
                  <input type="radio" v-model="searchParams.travelClass" :value="cls.value" />
                  {{ cls.label }}
                </label>
              </div>
              <button type="button" @click.stop="showTravelersDropdown = false" class="done-btn">Done</button>
            </div>
          </div>
        </div>

        <button type="submit" class="search-btn">Search</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const tripType = ref('roundtrip')
const showTravelersDropdown = ref(false)

const closeDropdown = (e) => {
  if (!e.target.closest('.travelers')) {
    showTravelersDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

const searchParams = ref({
  origin: '',
  destination: '',
  departDate: '',
  returnDate: '',
  passengers: 1,
  travelClass: 'economy'
})

const cabinClasses = [
  { value: 'economy', label: 'Economy' },
  { value: 'premium', label: 'Premium economy' },
  { value: 'business', label: 'Business' },
  { value: 'first', label: 'First class' }
]

const today = computed(() => {
  const date = new Date()
  return date.toISOString().split('T')[0]
})

const swapLocations = () => {
  const temp = searchParams.value.origin
  searchParams.value.origin = searchParams.value.destination
  searchParams.value.destination = temp
}

const incrementPassengers = () => {
  if (searchParams.value.passengers < 9) {
    searchParams.value.passengers++
  }
}

const decrementPassengers = () => {
  if (searchParams.value.passengers > 1) {
    searchParams.value.passengers--
  }
}

const searchFlights = async () => {
  if (!searchParams.value.origin || !searchParams.value.destination || !searchParams.value.departDate) {
    alert('Please fill in all required fields')
    return
  }

  // TODO: Replace with actual API call
  // Example:
  // try {
  //   const response = await axios.post('http://localhost:3000/api/flights/search', {
  //     origin: searchParams.value.origin,
  //     destination: searchParams.value.destination,
  //     departDate: searchParams.value.departDate,
  //     returnDate: searchParams.value.returnDate,
  //     passengers: searchParams.value.passengers,
  //     travelClass: searchParams.value.travelClass,
  //     tripType: tripType.value
  //   })
  //   router.push({
  //     name: 'results',
  //     query: { ...searchParams.value, tripType: tripType.value }
  //   })
  // } catch (error) {
  //   alert('Error searching flights: ' + error.message)
  // }

  router.push({
    name: 'results',
    query: {
      ...searchParams.value,
      tripType: tripType.value
    }
  })
}


</script>
