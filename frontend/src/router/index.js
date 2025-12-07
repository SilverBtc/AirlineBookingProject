import { createRouter, createWebHistory } from 'vue-router'
import FlightSearch from '../components/FlightSearch.vue'
import FlightResults from '../components/FlightResults.vue'
import BookingForm from '../components/BookingForm.vue'
import BookingConfirmation from '../components/BookingConfirmation.vue'
import MyBookings from '../components/MyBookings.vue'
import Help from '../components/Help.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'

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
  },
  {
    path: '/my-bookings',
    name: 'my-bookings',
    component: MyBookings
  },
  {
    path: '/help',
    name: 'help',
    component: Help
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
