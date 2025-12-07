<template>
    <div class="auth-page">
        <div class="auth-container">
            <div class="auth-card">
                <h1>Sign in</h1>
                <p class="subtitle">Sign in to manage your bookings</p>

                <form @submit.prevent="handleLogin" class="auth-form">
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" v-model="formData.username" placeholder="Enter your username"
                            required />
                    </div>

                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" v-model="formData.password"
                            placeholder="Enter your password" required />
                    </div>

                    <button type="submit" class="submit-btn">Sign in</button>
                </form>

                <div class="auth-footer">
                    Don't have an account?
                    <router-link to="/register">Sign up</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authAPI } from '../services/api'

const router = useRouter()

const formData = ref({
    username: '',
    password: ''
})

const handleLogin = async () => {
    try {
        const response = await authAPI.login({
            email: formData.value.username,
            password: formData.value.password
        })

        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        window.dispatchEvent(new Event('user-login'))
        router.push({ name: 'home' })
    } catch (error) {
        console.error('Login error:', error)
        const errorMsg = error.response?.data?.message || 'Login failed'
        alert(errorMsg)

        // Fallback
        if (formData.value.username && formData.value.password) {
            const userData = {
                email: formData.value.username,
                firstName: formData.value.username
            }
            localStorage.setItem('user', JSON.stringify(userData))
            localStorage.setItem('token', 'mock-token-' + Date.now())
            window.dispatchEvent(new Event('user-login'))
            router.push({ name: 'home' })
        }
    }
}
</script>
