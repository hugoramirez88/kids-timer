<!-- src/components/Rewards/RewardsShop.vue -->
<template>
  <div class="rewards-shop">
    <div class="shop-header">
      <h2>Loja de Recompensas</h2>
      <div class="points-display">
        <span class="points-icon">⭐</span>
        <span class="points-value">{{ profiles.activeProfile?.points || 0 }}</span>
        <span class="points-label">pontos</span>
      </div>
    </div>

    <!-- Avatars Section -->
    <section class="shop-section">
      <h3>Avatares</h3>
      <div class="items-grid">
        <div
          v-for="avatar in avatars"
          :key="avatar.id"
          :class="['shop-item', { owned: isOwned('avatar', avatar.id), selected: isSelected('avatar', avatar.id) }]"
        >
          <div class="item-preview">
            <img :src="`/images/avatars/${avatar.id}.svg`" :alt="avatar.name" />
          </div>
          <span class="item-name">{{ avatar.name }}</span>
          <button
            type="button"
            v-if="!isOwned('avatar', avatar.id)"
            class="buy-btn"
            :disabled="!canAfford(avatar.cost)"
            @click="buyItem('avatar', avatar.id, avatar.cost)"
          >
            {{ avatar.cost }} ⭐
          </button>
          <button
            type="button"
            v-else-if="!isSelected('avatar', avatar.id)"
            class="select-btn"
            @click="selectAvatar(avatar.id)"
          >
            Usar
          </button>
          <span v-else class="selected-badge">Em uso</span>
        </div>
      </div>
    </section>

    <!-- Themes Section -->
    <section class="shop-section">
      <h3>Temas</h3>
      <div class="items-grid">
        <div
          v-for="theme in themesData"
          :key="theme.id"
          :class="['shop-item', { owned: isOwned('theme', theme.id), selected: isSelected('theme', theme.id) }]"
        >
          <div class="item-preview theme-preview" :style="getThemeStyle(theme.id)">
            <span class="theme-icon">🎨</span>
          </div>
          <span class="item-name">{{ theme.name }}</span>
          <button
            type="button"
            v-if="!isOwned('theme', theme.id)"
            class="buy-btn"
            :disabled="!canAfford(theme.cost)"
            @click="buyItem('theme', theme.id, theme.cost)"
          >
            {{ theme.cost }} ⭐
          </button>
          <button
            type="button"
            v-else-if="!isSelected('theme', theme.id)"
            class="select-btn"
            @click="selectTheme(theme.id)"
          >
            Usar
          </button>
          <span v-else class="selected-badge">Em uso</span>
        </div>
      </div>
    </section>

    <!-- Path Animals Section -->
    <section class="shop-section">
      <h3>Animais do Caminho</h3>
      <div class="items-grid">
        <div
          v-for="animal in pathAnimalsData"
          :key="animal.id"
          :class="['shop-item', { owned: isOwned('animal', animal.id), selected: isSelected('animal', animal.id) }]"
        >
          <div class="item-preview">
            <span class="animal-emoji">{{ getAnimalEmoji(animal.id) }}</span>
          </div>
          <span class="item-name">{{ animal.name }}</span>
          <button
            type="button"
            v-if="!isOwned('animal', animal.id)"
            class="buy-btn"
            :disabled="!canAfford(animal.cost)"
            @click="buyItem('animal', animal.id, animal.cost)"
          >
            {{ animal.cost }} ⭐
          </button>
          <button
            type="button"
            v-else-if="!isSelected('animal', animal.id)"
            class="select-btn"
            @click="selectAnimal(animal.id)"
          >
            Usar
          </button>
          <span v-else class="selected-badge">Em uso</span>
        </div>
      </div>
    </section>

    <!-- Soundscapes Section -->
    <section class="shop-section">
      <h3>Sons Ambiente</h3>
      <div class="items-grid">
        <div
          v-for="soundscape in soundscapesData"
          :key="soundscape.id"
          :class="['shop-item', { owned: isOwned('soundscape', soundscape.id) }]"
        >
          <div class="item-preview">
            <span class="soundscape-emoji">{{ soundscape.icon }}</span>
          </div>
          <span class="item-name">{{ soundscape.name }}</span>
          <button
            type="button"
            v-if="!isOwned('soundscape', soundscape.id)"
            class="buy-btn"
            :disabled="!canAfford(soundscape.cost)"
            @click="buyItem('soundscape', soundscape.id, soundscape.cost)"
          >
            {{ soundscape.cost }} ⭐
          </button>
          <span v-else class="selected-badge">Desbloqueado</span>
        </div>
      </div>
    </section>

    <!-- Energetic Music Section -->
    <section class="shop-section">
      <h3>Música Animada</h3>
      <div class="items-grid">
        <div
          v-for="track in energeticTracksData"
          :key="track.id"
          :class="['shop-item', { owned: isOwned('energetic', track.id) }]"
        >
          <div class="item-preview">
            <span class="soundscape-emoji">{{ track.icon }}</span>
          </div>
          <span class="item-name">{{ track.name }}</span>
          <button
            type="button"
            v-if="!isOwned('energetic', track.id)"
            class="buy-btn"
            :disabled="!canAfford(track.cost)"
            @click="buyItem('energetic', track.id, track.cost)"
          >
            {{ track.cost }} ⭐
          </button>
          <span v-else class="selected-badge">Desbloqueado</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useProfilesStore } from '../../stores/profiles'
import { useSettingsStore } from '../../stores/settings'
import { avatars, themes as themesData, pathAnimals as pathAnimalsData } from '../../data/rewards'
import { soundscapes as soundscapesData } from '../../data/ambientSoundscapes'
import { energeticTracks as energeticTracksData } from '../../data/energeticMusic'
import { DEFAULT_UNLOCKED } from '../../data/defaults'

const profiles = useProfilesStore()
const settings = useSettingsStore()

function isOwned(type, id) {
  // Dev mode unlocks everything
  if (settings.devMode) return true

  if (!profiles.activeProfile) return false
  switch (type) {
    case 'avatar': return profiles.activeProfile.unlockedAvatars.includes(id)
    case 'theme': return profiles.activeProfile.unlockedThemes.includes(id)
    case 'animal': return profiles.activeProfile.unlockedAnimals.includes(id)
    case 'soundscape':
      // Default soundscapes are always owned
      if (DEFAULT_UNLOCKED.soundscapes.includes(id)) return true
      return profiles.activeProfile.unlockedSoundscapes?.includes(id) || false
    case 'energetic':
      // Default energetic tracks are always owned
      if (DEFAULT_UNLOCKED.energeticTracks.includes(id)) return true
      return profiles.activeProfile.unlockedEnergeticTracks?.includes(id) || false
  }
  return false
}

function isSelected(type, id) {
  if (!profiles.activeProfile) return false
  switch (type) {
    case 'avatar': return profiles.activeProfile.avatar === id
    case 'theme': return settings.theme === id
    case 'animal': return settings.pathAnimal === id
  }
  return false
}

function canAfford(cost) {
  return (profiles.activeProfile?.points || 0) >= cost
}

function buyItem(type, id, cost) {
  if (!canAfford(cost)) return
  profiles.unlockItem(type, id, cost)
}

function selectAvatar(avatarId) {
  if (profiles.activeProfile) {
    profiles.updateProfile(profiles.activeProfileId, { avatar: avatarId })
  }
}

function selectTheme(themeId) {
  settings.setTheme(themeId)
  if (profiles.activeProfile) {
    profiles.updateProfile(profiles.activeProfileId, { theme: themeId })
  }
}

function selectAnimal(animalId) {
  settings.pathAnimal = animalId
  if (profiles.activeProfile) {
    profiles.updateProfile(profiles.activeProfileId, { pathAnimal: animalId })
  }
}

function getThemeStyle(themeId) {
  const colors = {
    divertido: '#FF6B6B',
    minimalista: '#2D3436',
    floresta: '#27AE60',
    espaco: '#2C3E50',
    oceano: '#3498DB',
    doces: '#E91E63',
  }
  return { backgroundColor: colors[themeId] || '#ccc' }
}

function getAnimalEmoji(animalId) {
  const emojis = { rabbit: '🐰', turtle: '🐢', fox: '🦊', snail: '🐌' }
  return emojis[animalId] || '🐰'
}
</script>

<style scoped>
.rewards-shop {
  padding: 24px;
}

.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.shop-header h2 {
  font-size: 24px;
  color: var(--color-text, #333);
}

.points-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--color-primary-light, #E8F5E9);
  border-radius: var(--border-radius, 12px);
}

.points-icon {
  font-size: 20px;
}

.points-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary, #4CAF50);
}

.points-label {
  font-size: 14px;
  color: var(--color-text-secondary, #666);
}

.shop-section {
  margin-bottom: 32px;
}

.shop-section h3 {
  font-size: 18px;
  margin-bottom: 16px;
  color: var(--color-text, #333);
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
}

.shop-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: var(--color-surface, white);
  border: 2px solid var(--color-border, #e0e0e0);
  border-radius: var(--border-radius, 12px);
  transition: all 0.2s;
}

.shop-item.owned {
  border-color: var(--color-primary, #4CAF50);
}

.shop-item.selected {
  background: var(--color-primary-light, #E8F5E9);
}

.item-preview {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-preview img {
  width: 50px;
  height: 50px;
}

.theme-preview {
  border-radius: 50%;
}

.theme-icon {
  font-size: 24px;
}

.animal-emoji, .soundscape-emoji {
  font-size: 36px;
}

.item-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text, #333);
}

.buy-btn, .select-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.buy-btn {
  background: var(--color-warning, #FF9800);
  color: white;
}

.buy-btn:disabled {
  background: var(--color-neutral, #e0e0e0);
  color: var(--color-text-secondary, #666);
  cursor: not-allowed;
}

.select-btn {
  background: var(--color-primary, #4CAF50);
  color: white;
}

.selected-badge {
  font-size: 12px;
  color: var(--color-primary, #4CAF50);
  font-weight: 600;
}
</style>
