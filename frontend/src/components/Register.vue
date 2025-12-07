<template>
    <div class="auth-page">
        <div class="auth-container">
            <div class="auth-card">
                <h1>Create account</h1>
                <p class="subtitle">Sign up to start booking flights</p>

                <form @submit.prevent="handleRegister" class="auth-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="firstName">First name</label>
                            <input type="text" id="firstName" v-model="formData.firstName" placeholder="First name"
                                required />
                        </div>

                        <div class="form-group">
                            <label for="lastName">Last name</label>
                            <input type="text" id="lastName" v-model="formData.lastName" placeholder="Last name"
                                required />
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" v-model="formData.email" placeholder="Enter your email"
                            required />
                    </div>

                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" v-model="formData.password" placeholder="Create a password"
                            required minlength="8" />
                        <span class="hint">At least 8 characters</span>
                    </div>

                    <div class="form-group">
                        <label for="confirmPassword">Confirm password</label>
                        <input type="password" id="confirmPassword" v-model="formData.confirmPassword"
                            placeholder="Confirm your password" required />
                    </div>

                    <button type="submit" class="submit-btn">Create account</button>
                </form>

                <div class="auth-footer">
                    Already have an account?
                    <router-link to="/login">Sign in</router-link>
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
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
})

const acceptTerms = ref(false)

const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email)
}

const handleRegister = async () => {
    if (!validateEmail(formData.value.email)) {
        alert('Please enter a valid email address')
        return
    }

    if (formData.value.password !== formData.value.confirmPassword) {
        alert('Passwords do not match')
        return
    }

    try {
        const response = await authAPI.register({
            full_name: `${formData.value.firstName} ${formData.value.lastName}`,
            email: formData.value.email,
            password: formData.value.password
        })

        console.log('Register response:', response.data)

        // Vérifier que la réponse contient bien un token et un user
        if (response.data && response.data.token && response.data.user) {
            const userData = {
                email: response.data.user.email,
                firstName: formData.value.firstName,
                id: response.data.user.id
            }
            localStorage.setItem('user', JSON.stringify(userData))
            localStorage.setItem('token', response.data.token)
            window.dispatchEvent(new Event('user-login'))
            router.push({ name: 'home' })
        } else {
            throw new Error('Invalid response from server')
        }
    } catch (error) {
        console.error('Registration error:', error)
        const errorMsg = error.response?.data?.message || 'Registration failed'
        alert(errorMsg)
        // Ne pas faire de fallback - afficher l'erreur seulement
    }
}
</script>
