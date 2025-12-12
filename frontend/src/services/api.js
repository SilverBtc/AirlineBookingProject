import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// API Auth
export const authAPI = {
    register(userData) {
        return apiClient.post('/api/auth/register', userData)
    },
    login(credentials) {
        return apiClient.post('/api/auth/login', credentials)
    },
    getProfile() {
        return apiClient.get('/api/auth/profile')
    }
}

// API Flights
export const flightAPI = {
    search(params) {
        return apiClient.get('/api/flights/search', { params })
    },
    getById(id) {
        return apiClient.get(`/api/flights/${id}`)
    },
    getDestinations() {
        return apiClient.get('/api/flights/destinations')
    },
    getOccupiedSeats(flightId) {
        return apiClient.get(`/api/flights/${flightId}/occupied-seats`)
    }
}

// API Bookings
export const bookingAPI = {
    create(bookingData) {
        return apiClient.post('/api/bookings', bookingData)
    },
    getMyBookings() {
        return apiClient.get('/api/bookings/my-bookings')
    },
    getById(id) {
        return apiClient.get(`/api/bookings/${id}`)
    },
    cancel(id) {
        return apiClient.delete(`/api/bookings/${id}`)
    }
}

export default apiClient
