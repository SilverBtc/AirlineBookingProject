<template>
    <div class="help-page">
        <div class="help-header">
            <h1>Help Center</h1>
            <div class="search-help">
                <input type="text" v-model="searchQuery" placeholder="Search for help..." @input="filterArticles" />
            </div>
        </div>

        <div class="help-container">
            <div class="faq-section">
                <h2>Frequently asked questions</h2>
                <div class="faq-list">
                    <div v-for="faq in filteredFaqs" :key="faq.id" class="faq-item" @click="toggleFaq(faq.id)">
                        <div class="faq-question">
                            <span>{{ faq.question }}</span>
                            <span class="toggle-icon">{{ expandedFaq === faq.id ? '−' : '+' }}</span>
                        </div>
                        <div v-if="expandedFaq === faq.id" class="faq-answer">
                            {{ faq.answer }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="contact-section">
                <h2>Still need help?</h2>
                <div class="contact-options">
                    <div class="contact-card">
                        <div class="contact-icon">📞</div>
                        <h3>Call us</h3>
                        <p>+1 (800) 123-4567</p>
                        <span class="availability">Available 24/7</span>
                    </div>
                    <div class="contact-card">
                        <div class="contact-icon">✉️</div>
                        <h3>Email us</h3>
                        <p>support@skybooker.com</p>
                        <span class="availability">Response within 24h</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const expandedFaq = ref(null)

const categories = [
    {
        id: 1,
        icon: '🎫',
        title: 'Booking',
        description: 'How to book flights and manage reservations'
    },
    {
        id: 2,
        icon: '💳',
        title: 'Payment',
        description: 'Payment methods and refund policies'
    },
    {
        id: 3,
        icon: '✈️',
        title: 'Travel info',
        description: 'Baggage, check-in, and travel tips'
    },
    {
        id: 4,
        icon: '🔄',
        title: 'Changes',
        description: 'Modify or cancel your booking'
    }
]

const faqs = [
    {
        id: 1,
        question: 'How do I check in online?',
        answer: 'Online check-in opens 24 hours before departure. Go to My Bookings, select your flight, and click "Check in online". You can then download your boarding pass.'
    },
    {
        id: 2,
        question: 'What is your cancellation policy?',
        answer: 'Cancellation policies vary by airline and fare type. Refundable tickets can be cancelled for a full refund. Non-refundable tickets may be eligible for a credit minus cancellation fees.'
    },
    {
        id: 3,
        question: 'Can I change my flight dates?',
        answer: 'Yes, you can change your flight dates subject to availability and fare difference. Change fees may apply depending on your ticket type. Contact us or manage your booking online.'
    },
    {
        id: 4,
        question: 'How much baggage am I allowed?',
        answer: 'Baggage allowance depends on your airline and ticket class. Most economy tickets include 1 carry-on and 1-2 checked bags. Check your booking confirmation for specific details.'
    },
    {
        id: 5,
        question: 'When will I receive my booking confirmation?',
        answer: 'You will receive your booking confirmation immediately after payment. Check your email inbox and spam folder. You can also view your booking in the My Bookings section.'
    },
    {
        id: 6,
        question: 'Do I need a visa for my destination?',
        answer: 'Visa requirements vary by destination and your nationality. Check with the embassy or consulate of your destination country. It is your responsibility to ensure you have proper documentation.'
    }
]

const filteredFaqs = computed(() => {
    if (!searchQuery.value) return faqs
    const query = searchQuery.value.toLowerCase()
    return faqs.filter(faq =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
    )
})

const selectCategory = (category) => {
    alert(`Show articles for: ${category.title}`)
}

const toggleFaq = (id) => {
    expandedFaq.value = expandedFaq.value === id ? null : id
}

const filterArticles = () => {
    // Search filtering is handled by computed property
}
</script>
