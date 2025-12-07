<script setup>
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'

const isLoggedIn = ref(false)
const userEmail = ref('')
const showUserMenu = ref(false)

const checkAuth = () => {
  const user = localStorage.getItem('user')
  if (user) {
    const userData = JSON.parse(user)
    isLoggedIn.value = true
    userEmail.value = userData.email
  }
}

const logout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  isLoggedIn.value = false
  userEmail.value = ''
  showUserMenu.value = false
  window.location.href = '/'
}

onMounted(() => {
  checkAuth()
  window.addEventListener('storage', checkAuth)
  window.addEventListener('user-login', checkAuth)
})
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="header-content">
        <router-link to="/" class="logo">
          <span class="logo-text">SkyBooker</span>
        </router-link>
        <nav class="main-nav">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/my-bookings" class="nav-link">My Bookings</router-link>
          <router-link to="/help" class="nav-link">Help</router-link>
        </nav>
        <div class="user-actions" v-if="!isLoggedIn">
          <router-link to="/login" class="btn-secondary">Login</router-link>
          <router-link to="/register" class="btn-primary">Register</router-link>
        </div>
        <div class="user-menu" v-else>
          <button class="user-btn" @click="showUserMenu = !showUserMenu">
            <span class="user-icon">👤</span>
            <span class="user-email">{{ userEmail }}</span>
          </button>
          <div v-if="showUserMenu" class="user-dropdown">
            <router-link to="/my-bookings" class="menu-item" @click="showUserMenu = false">
              <span>My trips</span>
            </router-link>
            <router-link to="/help" class="menu-item" @click="showUserMenu = false">
              <span>Help</span>
            </router-link>
            <div class="menu-divider"></div>
            <button @click="logout" class="menu-item logout">
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="app-main">
      <RouterView />
    </main>

    <footer class="app-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h4>About SkyBooker</h4>
          <p class="footer-description">Your trusted partner for seamless flight bookings worldwide. We make travel simple, affordable, and accessible.</p>
          <div class="social-links">
            <a href="#" class="social-icon" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" class="social-icon" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" class="social-icon" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
              </svg>
            </a>
            <a href="#" class="social-icon" aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>

        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><router-link to="/">Search Flights</router-link></li>
            <li><router-link to="/my-bookings">My Bookings</router-link></li>
            <li><a href="#">Flight Status</a></li>
            <li><a href="#">Travel Guides</a></li>
            <li><a href="#">Deals & Offers</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Support</h4>
          <ul>
            <li><router-link to="/help">Help Center</router-link></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">FAQs</a></li>
            <li><a href="#">Cancellation Policy</a></li>
            <li><a href="#">Payment Options</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Company</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p>&copy; 2025 SkyBooker. All rights reserved.</p>
          <div class="payment-methods">
            <span>We accept:</span>
            <div class="payment-icons">
              <span class="payment-icon">💳</span>
              <span class="payment-icon">💰</span>
              <span class="payment-icon">🏦</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a365d;
  text-decoration: none;
}

.logo-icon {
  font-size: 2rem;
}

.logo-text {
  color: #2B7CB8;
}

.main-nav {
  display: flex;
  gap: 2rem;
  flex: 1;
  justify-content: center;
}

.nav-link {
  color: #4a5568;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
  padding: 0.5rem 0;
  border-bottom: 2px solid transparent;
}

.nav-link:hover {
  color: #667eea;
  border-bottom-color: #667eea;
}

.user-actions {
  display: flex;
  gap: 1rem;
}

.btn-secondary,
.btn-primary {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 0.95rem;
}

.btn-secondary {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-secondary:hover {
  background: #f7fafc;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.app-main {
  flex: 1;
  background: #f7fafc;
}

.app-footer {
  background: linear-gradient(135deg, #1a365d 0%, #2B7CB8 100%);
  color: white;
  padding: 4rem 0 0;
  margin-top: 4rem;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem 3rem;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 4rem;
}

.footer-section h4 {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  letter-spacing: 0.5px;
}

.footer-description {
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.7;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: 0.85rem;
}

.footer-section a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s;
  font-size: 0.95rem;
  display: inline-block;
}

.footer-section a:hover {
  color: white;
  transform: translateX(5px);
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.social-icon {
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  transition: all 0.3s;
  text-decoration: none;
  backdrop-filter: blur(10px);
  padding: 0;
}

.social-icon svg {
  display: block;
  flex-shrink: 0;
}

.social-icon:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.footer-bottom {
  background: rgba(0, 0, 0, 0.3);
  padding: 1.5rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-bottom-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-bottom p {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.payment-methods {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.payment-icons {
  display: flex;
  gap: 0.5rem;
}

.payment-icon {
  font-size: 1.5rem;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.payment-icon:hover {
  opacity: 1;
}

@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .main-nav {
    justify-content: flex-start;
    width: 100%;
  }

  .user-actions {
    width: 100%;
    justify-content: stretch;
  }

  .user-actions button {
    flex: 1;
  }
}

@media (max-width: 768px) {
  .main-nav {
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
  }

  .payment-methods {
    justify-content: center;
  }
}
</style>
