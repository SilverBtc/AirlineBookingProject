<template>
    <div class="date-picker" ref="datePickerRef">
        <div class="date-inputs">
            <div class="date-input" @click="openCalendar('depart')"
                :class="{ active: isOpen && activeField === 'depart' }"
                role="button" tabindex="0" :aria-label="`Select ${departLabel} date`">
                <label>{{ departLabel }}</label>
                <div class="date-value">
                    {{ formatDisplayDate(modelValue.departDate) }}
                </div>
            </div>

            <div v-if="isRoundTrip" class="date-input" @click="openCalendar('return')"
                :class="{ active: isOpen && activeField === 'return' }"
                role="button" tabindex="0" :aria-label="`Select ${returnLabel} date`">
                <label>{{ returnLabel }}</label>
                <div class="date-value">
                    {{ formatDisplayDate(modelValue.returnDate) }}
                </div>
            </div>
        </div>

        <div v-if="isOpen" class="calendar-popup" role="dialog" aria-label="Date picker calendar">
            <div class="calendar-header">
                <button type="button" @click="previousMonth" class="month-nav" aria-label="Previous month">‹</button>
                <div class="month-display">
                    <span class="month-name">{{ currentMonthName }}</span>
                    <span class="year">{{ currentYear }}</span>
                </div>
                <button type="button" @click="nextMonth" class="month-nav" aria-label="Next month">›</button>
            </div>

            <div class="calendars">
                <div class="calendar" v-for="(month, index) in displayMonths" :key="index">
                    <div class="calendar-month-title">{{ month.name }} {{ month.year }}</div>
                    <div class="weekdays">
                        <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
                    </div>
                    <div class="days">
                        <div v-for="(day, dayIndex) in month.days" :key="dayIndex" :class="getDayClasses(day)"
                            @click="selectDate(day)" @mouseenter="hoverDate(day)">
                            <span v-if="day.date">{{ day.date.getDate() }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="calendar-footer">
                <button type="button" @click="clearDates" class="clear-btn">Clear</button>
                <button type="button" @click="closeCalendar" class="done-btn">Done</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    isRoundTrip: {
        type: Boolean,
        default: true
    },
    departLabel: {
        type: String,
        default: 'Departure'
    },
    returnLabel: {
        type: String,
        default: 'Return'
    }
})

const emit = defineEmits(['update:modelValue'])

const datePickerRef = ref(null)
const isOpen = ref(false)
const activeField = ref('depart')
const currentMonth = ref(new Date())
const hoveredDate = ref(null)

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const currentMonthName = computed(() => {
    return currentMonth.value.toLocaleDateString('en-US', { month: 'long' })
})

const currentYear = computed(() => {
    return currentMonth.value.getFullYear()
})

const displayMonths = computed(() => {
    const months = []
    for (let i = 0; i < 2; i++) {
        const date = new Date(currentMonth.value)
        date.setMonth(date.getMonth() + i)

        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)

        const days = []
        const startPadding = firstDay.getDay()

        // Padding before first day
        for (let j = 0; j < startPadding; j++) {
            days.push({ date: null })
        }

        // Days of the month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            days.push({ date: new Date(year, month, day) })
        }

        // Padding after last day
        const endPadding = 42 - days.length
        for (let j = 0; j < endPadding; j++) {
            days.push({ date: null })
        }

        months.push({
            name: date.toLocaleDateString('en-US', { month: 'long' }),
            year: year,
            days: days
        })
    }
    return months
})

const openCalendar = (field) => {
    isOpen.value = true
    activeField.value = field
}

const closeCalendar = () => {
    isOpen.value = false
    hoveredDate.value = null
}

const previousMonth = () => {
    const newMonth = new Date(currentMonth.value)
    newMonth.setMonth(newMonth.getMonth() - 1)
    currentMonth.value = newMonth
}

const nextMonth = () => {
    const newMonth = new Date(currentMonth.value)
    newMonth.setMonth(newMonth.getMonth() + 1)
    currentMonth.value = newMonth
}

const formatDisplayDate = (dateStr) => {
    if (!dateStr) return 'Select date'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    })
}

const formatDateToString = (date) => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

const selectDate = (day) => {
    if (!day.date) return

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (day.date < today) return

    const dateStr = formatDateToString(day.date)

    if (activeField.value === 'depart') {
        emit('update:modelValue', {
            ...props.modelValue,
            departDate: dateStr
        })

        if (props.isRoundTrip) {
            activeField.value = 'return'
            // If the return date is before the new departure date, reset it
            if (props.modelValue.returnDate && props.modelValue.returnDate < dateStr) {
                emit('update:modelValue', {
                    ...props.modelValue,
                    departDate: dateStr,
                    returnDate: ''
                })
            }
        } else {
            closeCalendar()
        }
    } else if (activeField.value === 'return') {
        if (day.date < new Date(props.modelValue.departDate)) {
            return
        }
        emit('update:modelValue', {
            ...props.modelValue,
            returnDate: dateStr
        })
        closeCalendar()
    }
}

const hoverDate = (day) => {
    if (!day.date) return
    hoveredDate.value = day.date
}

const getDayClasses = (day) => {
    if (!day.date) return 'day empty'

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dayDate = new Date(day.date)
    dayDate.setHours(0, 0, 0, 0)

    const classes = ['day']

    // Past day
    if (dayDate < today) {
        classes.push('disabled')
        return classes.join(' ')
    }

    const departDate = props.modelValue.departDate ? new Date(props.modelValue.departDate) : null
    const returnDate = props.modelValue.returnDate ? new Date(props.modelValue.returnDate) : null

    if (departDate) {
        departDate.setHours(0, 0, 0, 0)
    }
    if (returnDate) {
        returnDate.setHours(0, 0, 0, 0)
    }

    // Selected departure date
    if (departDate && dayDate.getTime() === departDate.getTime()) {
        classes.push('selected', 'start')
    }

    // Selected return date
    if (returnDate && dayDate.getTime() === returnDate.getTime()) {
        classes.push('selected', 'end')
    }

    // Range between departure and return
    if (departDate && returnDate && dayDate > departDate && dayDate < returnDate) {
        classes.push('in-range')
    }

    // Hover to preview the range
    if (props.isRoundTrip && activeField.value === 'return' && departDate && hoveredDate.value) {
        const hovered = new Date(hoveredDate.value)
        hovered.setHours(0, 0, 0, 0)

        if (dayDate > departDate && dayDate <= hovered && hovered > departDate) {
            classes.push('hover-range')
        }
    }

    // Desactivate return dates before departure date
    if (activeField.value === 'return' && departDate && dayDate < departDate) {
        classes.push('disabled')
    }

    return classes.join(' ')
}

const clearDates = () => {
    emit('update:modelValue', {
        departDate: '',
        returnDate: ''
    })
    activeField.value = 'depart'
}

const handleClickOutside = (event) => {
    if (datePickerRef.value && !datePickerRef.value.contains(event.target)) {
        closeCalendar()
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})

// Initialiser le mois actuel
watch(() => props.modelValue.departDate, (newVal) => {
    if (newVal) {
        currentMonth.value = new Date(newVal)
    }
}, { immediate: true })
</script>

<style scoped>
.date-picker {
    position: relative;
}

.date-inputs {
    display: flex;
    gap: 0;
    border: 1px solid #dadce0;
    border-radius: 8px;
    overflow: hidden;
}

.date-input {
    flex: 1;
    padding: 12px 16px;
    background: white;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 160px;
    min-height: 60px;
    border-right: 1px solid #dadce0;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.date-input:last-child {
    border-right: none;
}

.date-input:hover {
    background: #f8f9fa;
}

.date-input.active {
    background: #e8f0fe;
    border-color: #1967d2;
}

.date-input label {
    display: block;
    font-size: 12px;
    color: #5f6368;
    margin-bottom: 4px;
    line-height: 1;
}

.date-value {
    font-size: 16px;
    color: #202124;
    padding: 4px 0;
    line-height: 1.5;
}

.calendar-popup {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    padding: 20px;
    z-index: 1000;
    min-width: 640px;
}

.calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}

.month-nav {
    background: none;
    border: none;
    font-size: 24px;
    color: #5B9BD5;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 50%;
    transition: all 0.2s;
}

.month-nav:hover {
    background: rgba(91, 155, 213, 0.1);
}

.month-display {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    font-size: 16px;
    color: #202124;
}

.calendars {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
}

.calendar-month-title {
    font-weight: 600;
    font-size: 14px;
    color: #202124;
    margin-bottom: 12px;
    text-align: center;
}

.weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    margin-bottom: 8px;
}

.weekday {
    text-align: center;
    font-size: 11px;
    font-weight: 600;
    color: #666;
    padding: 8px 0;
}

.days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
}

.day {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    color: #202124;
    transition: all 0.15s ease;
    position: relative;
}

.day:not(.empty):not(.disabled):hover {
    background: rgba(91, 155, 213, 0.1);
}

.day.empty {
    cursor: default;
}

.day.disabled {
    color: #dadce0;
    cursor: not-allowed;
}

.day.disabled:hover {
    background: transparent;
}

.day.selected {
    background: linear-gradient(135deg, #5B9BD5 0%, #2B7CB8 100%);
    color: white;
    font-weight: 600;
}

.day.selected.start {
    border-radius: 8px 0 0 8px;
}

.day.selected.end {
    border-radius: 0 8px 8px 0;
}

.day.selected.start.end {
    border-radius: 8px;
}

.day.in-range {
    background: rgba(91, 155, 213, 0.15);
    color: #202124;
    border-radius: 0;
}

.day.hover-range {
    background: rgba(91, 155, 213, 0.08);
    border-radius: 0;
}

.calendar-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e0e0e0;
}

.clear-btn,
.done-btn {
    padding: 10px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
}

.clear-btn {
    background: white;
    color: #5B9BD5;
    border: 1px solid #dadce0;
}

.clear-btn:hover {
    background: #f8f9fa;
}

.done-btn {
    background: linear-gradient(135deg, #5B9BD5 0%, #2B7CB8 100%);
    color: white;
}

.done-btn:hover {
    box-shadow: 0 4px 12px rgba(43, 124, 184, 0.3);
}
</style>
