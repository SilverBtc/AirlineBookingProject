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
              <input
                type="text"
                id="firstName"
                v-model="formData.firstName"
                placeholder="First name"
                required
              />
            </div>

            <div class="form-group">
              <label for="lastName">Last name</label>
              <input
                type="text"
                id="lastName"
                v-model="formData.lastName"
                placeholder="Last name"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              v-model="formData.password"
              placeholder="Create a password"
              required
              minlength="8"
            />
            <span class="hint">At least 8 characters</span>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm password</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="formData.confirmPassword"
              placeholder="Confirm your password"
              required
            />
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

const router = useRouter()

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const acceptTerms = ref(false)

const handleRegister = async () => {
  if (formData.value.password !== formData.value.confirmPassword) {
    alert('Passwords do not match')
    return
  }

  // TODO: Replace with actual API call
  // Example:
  // try {
  //   const response = await axios.post('http://localhost:3000/api/auth/register', {
  //     firstName: formData.value.firstName,
  //     lastName: formData.value.lastName,
  //     email: formData.value.email,
  //     password: formData.value.password
  //   })
  //   const userData = {
  //     email: response.data.email,
  //     firstName: response.data.firstName
  //   }
  //   localStorage.setItem('user', JSON.stringify(userData))
  //   localStorage.setItem('token', response.data.token)
  //   window.dispatchEvent(new Event('user-login'))
  //   router.push({ name: 'home' })
  // } catch (error) {
  //   alert('Registration failed: ' + error.message)
  // }

  const userData = {
    email: formData.value.email,
    firstName: formData.value.firstName
  }
  localStorage.setItem('user', JSON.stringify(userData))
  localStorage.setItem('token', 'mock-token-' + Date.now())
  window.dispatchEvent(new Event('user-login'))
  router.push({ name: 'home' })
}
</script>
