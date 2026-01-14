<!-- src/components/Rewards/BadgesDisplay.vue -->
<template>
  <div class="badges-display">
    <h2>Conquistas</h2>

    <div class="badges-grid">
      <div
        v-for="badge in allBadges"
        :key="badge.id"
        :class="['badge-card', { earned: isEarned(badge.id) }]"
      >
        <div class="badge-icon">
          <span v-if="isEarned(badge.id)">{{ badge.icon }}</span>
          <span v-else class="locked-icon">🔒</span>
        </div>
        <div class="badge-info">
          <span class="badge-name">{{ badge.name }}</span>
          <span class="badge-description">{{ badge.description }}</span>
        </div>
      </div>
    </div>

    <div class="badges-summary">
      <span>{{ earnedCount }} de {{ allBadges.length }} conquistas</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProfilesStore } from '../../stores/profiles'
import { badges as allBadges } from '../../data/rewards'

const profiles = useProfilesStore()

const earnedCount = computed(() => {
  return profiles.activeProfile?.badges?.length || 0
})

function isEarned(badgeId) {
  return profiles.activeProfile?.badges?.includes(badgeId) || false
}
</script>

<style scoped>
.badges-display {
  padding: 24px;
}

.badges-display h2 {
  font-size: 24px;
  margin-bottom: 24px;
  color: var(--color-text, #333);
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.badge-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--color-surface, white);
  border: 2px solid var(--color-border, #e0e0e0);
  border-radius: var(--border-radius, 12px);
  opacity: 0.5;
  transition: all 0.2s;
}

.badge-card.earned {
  opacity: 1;
  border-color: var(--color-primary, #4CAF50);
  background: var(--color-primary-light, #E8F5E9);
}

.badge-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  background: var(--color-surface, white);
  border-radius: 50%;
}

.locked-icon {
  font-size: 24px;
  opacity: 0.5;
}

.badge-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.badge-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text, #333);
}

.badge-description {
  font-size: 12px;
  color: var(--color-text-secondary, #666);
}

.badges-summary {
  text-align: center;
  font-size: 14px;
  color: var(--color-text-secondary, #666);
}
</style>
