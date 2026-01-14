<!-- src/components/Profiles/ProfileSelector.vue -->
<template>
  <div class="profile-selector">
    <h2>Quem vai usar o timer?</h2>

    <div class="profiles-grid">
      <button
        v-for="profile in profiles.profiles"
        :key="profile.id"
        class="profile-card"
        @click="selectProfile(profile.id)"
      >
        <div class="profile-avatar">
          <img :src="`/images/avatars/${profile.avatar}.svg`" :alt="profile.name" />
        </div>
        <span class="profile-name">{{ profile.name }}</span>
        <span class="profile-stats">{{ profile.totalPomodoros }} pomodoros</span>
      </button>

      <button class="profile-card add-new" @click="showCreateModal = true">
        <div class="profile-avatar">
          <span class="add-icon">+</span>
        </div>
        <span class="profile-name">Novo Perfil</span>
      </button>
    </div>

    <!-- Create Profile Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
      <div class="modal">
        <h3>Criar Novo Perfil</h3>
        <div class="form-group">
          <label>Nome</label>
          <input
            v-model="newProfileName"
            type="text"
            placeholder="Digite o nome..."
            @keyup.enter="createProfile"
            ref="nameInput"
          />
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="showCreateModal = false">Cancelar</button>
          <button class="btn btn-primary" @click="createProfile" :disabled="!newProfileName.trim()">
            Criar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { useProfilesStore } from '../../stores/profiles'

const emit = defineEmits(['profileSelected'])

const profiles = useProfilesStore()
const showCreateModal = ref(false)
const newProfileName = ref('')
const nameInput = ref(null)

watch(showCreateModal, async (show) => {
  if (show) {
    await nextTick()
    nameInput.value?.focus()
  }
})

function selectProfile(profileId) {
  profiles.selectProfile(profileId)
  emit('profileSelected')
}

function createProfile() {
  if (!newProfileName.value.trim()) return

  const profile = profiles.createProfile(newProfileName.value.trim())
  profiles.selectProfile(profile.id)

  newProfileName.value = ''
  showCreateModal.value = false
  emit('profileSelected')
}
</script>

<style scoped>
.profile-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  padding: 40px 20px;
}

.profile-selector h2 {
  font-size: 28px;
  color: var(--color-text, #333);
}

.profiles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 20px;
  max-width: 600px;
  width: 100%;
}

.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 16px;
  background: var(--color-surface, white);
  border: 2px solid var(--color-border, #e0e0e0);
  border-radius: var(--border-radius-large, 16px);
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.profile-card:hover {
  border-color: var(--color-primary, #4CAF50);
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--color-primary-light, #E8F5E9);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.profile-avatar img {
  width: 60px;
  height: 60px;
}

.add-icon {
  font-size: 40px;
  color: var(--color-primary, #4CAF50);
}

.profile-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text, #333);
}

.profile-stats {
  font-size: 12px;
  color: var(--color-text-secondary, #666);
}

.add-new {
  border-style: dashed;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: var(--color-surface, white);
  padding: 32px;
  border-radius: var(--border-radius-large, 16px);
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.modal h3 {
  font-size: 24px;
  color: var(--color-text, #333);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary, #666);
}

.form-group input {
  padding: 12px 16px;
  border: 2px solid var(--color-border, #e0e0e0);
  border-radius: var(--border-radius, 8px);
  font-size: 18px;
  font-family: inherit;
}

.form-group input:focus {
  outline: none;
  border-color: var(--color-primary, #4CAF50);
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: var(--border-radius, 8px);
  font-size: 16px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--color-primary, #4CAF50);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-dark, #388E3C);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--color-neutral, #e0e0e0);
  color: var(--color-text, #333);
}

.btn-secondary:hover {
  background: #d0d0d0;
}
</style>
