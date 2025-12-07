import { createRouter, createWebHistory } from 'vue-router'
import FlightSearch from '../components/FlightSearch.vue'
import FlightResults from '../components/FlightResults.vue'
import BookingForm from '../components/BookingForm.vue'
import BookingConfirmation from '../components/BookingConfirmation.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: FlightSearch
  },
  {
    path: '/results',
    name: 'results',
    component: FlightResults
  },
  {
    path: '/booking',
    name: 'booking',
    component: BookingForm
  },
  {
    path: '/confirmation',
    name: 'confirmation',
    component: BookingConfirmation
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
