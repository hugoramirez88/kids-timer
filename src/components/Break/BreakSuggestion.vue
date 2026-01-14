<!-- src/components/Break/BreakSuggestion.vue -->
<template>
  <div class="break-suggestion" v-if="currentSuggestion">
    <div class="suggestion-image">
      <img
        :src="`/images/break/${currentSuggestion.image}`"
        :alt="currentSuggestion.text"
        @error="handleImageError"
      />
    </div>
    <div class="suggestion-content">
      <span class="suggestion-icon">{{ currentSuggestion.icon }}</span>
      <p class="suggestion-text">{{ currentSuggestion.text }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useTimerStore } from '../../stores/timer'
import { getRandomSuggestion } from '../../data/breakSuggestions'

const timer = useTimerStore()
const currentSuggestion = ref(null)
const recentTexts = ref([])
const lastCategory = ref(null)

let rotationInterval = null

function pickSuggestion() {
  const suggestion = getRandomSuggestion(
    lastCategory.value ? [lastCategory.value] : [],
    recentTexts.value
  )

  currentSuggestion.value = suggestion
  lastCategory.value = suggestion.category

  // Track recent to avoid repeats
  recentTexts.value.push(suggestion.text)
  if (recentTexts.value.length > 5) {
    recentTexts.value.shift()
  }
}

function handleImageError(e) {
  // Fallback to placeholder if image not found
  e.target.src = '/images/break/placeholder.svg'
}

function startRotation() {
  pickSuggestion()
  rotationInterval = setInterval(pickSuggestion, 30000)
}

function stopRotation() {
  if (rotationInterval) {
    clearInterval(rotationInterval)
    rotationInterval = null
  }
  currentSuggestion.value = null
  recentTexts.value = []
  lastCategory.value = null
}

watch(() => timer.status, (newStatus) => {
  if (newStatus === 'break') {
    startRotation()
  } else {
    stopRotation()
  }
})

onMounted(() => {
  if (timer.status === 'break') {
    startRotation()
  }
})

onUnmounted(() => {
  stopRotation()
})
</script>

<style scoped>
.break-suggestion {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: var(--color-surface, white);
  border-radius: var(--border-radius-large, 20px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 320px;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.suggestion-image {
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.suggestion-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.suggestion-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.suggestion-icon {
  font-size: 32px;
}

.suggestion-text {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text, #333);
  line-height: 1.4;
}
</style>
