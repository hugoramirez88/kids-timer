<!-- src/components/ErrorBoundary.vue -->
<template>
  <slot v-if="!hasError" />
  <div v-else class="error-boundary">
    <div class="error-content">
      <span class="error-icon">😢</span>
      <h2>Algo deu errado</h2>
      <p>Houve um problema ao carregar esta parte do aplicativo.</p>
      <button class="retry-btn" @click="retry">Tentar novamente</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const error = ref(null)

onErrorCaptured((err, instance, info) => {
  hasError.value = true
  error.value = err
  console.error('ErrorBoundary caught:', err, info)
  return false // Prevent error from propagating
})

function retry() {
  hasError.value = false
  error.value = null
}
</script>

<style scoped>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 32px;
}

.error-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.error-icon {
  font-size: 48px;
}

.error-content h2 {
  font-size: 20px;
  color: var(--color-text, #333);
  margin: 0;
}

.error-content p {
  font-size: 14px;
  color: var(--color-text-secondary, #666);
  margin: 0;
}

.retry-btn {
  padding: 12px 24px;
  background: var(--color-primary, #4CAF50);
  color: white;
  border: none;
  border-radius: var(--border-radius, 8px);
  font-size: 16px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: var(--color-primary-dark, #388E3C);
}
</style>
