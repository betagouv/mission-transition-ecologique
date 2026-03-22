<template>
  <div class="fr-container fr-py-6w">
    <div class="fr-grid-row fr-grid-row--middle fr-mb-4w">
      <div class="fr-col">
        <h1 class="fr-h2 fr-mb-0">Gestion des priorités</h1>
        <p class="fr-text--sm fr-mb-0 fr-mt-1w" style="color: #666">Connecté en tant que <strong>{{ currentUser }}</strong></p>
      </div>
      <div class="fr-col-auto">
        <button class="fr-btn fr-btn--secondary fr-btn--sm" @click="logout">Se déconnecter</button>
      </div>
    </div>

    <AdminNafSelector v-model="selectedNaf" class="fr-mb-4w" />

    <div class="fr-grid-row fr-grid-row--middle fr-mb-3w">
      <div class="fr-col">
        <span class="fr-badge fr-badge--sm fr-badge--info">{{ sortedProjects.length }} projets</span>
      </div>
      <div v-if="hasChanges" class="fr-btns-group fr-btns-group--sm fr-btns-group--inline">
        <button class="fr-btn" :disabled="saving" @click="saveChanges">
          <span v-if="!saving" class="fr-icon-check-line fr-pr-1w" aria-hidden="true"></span>
          {{ saving ? 'Enregistrement...' : 'Enregistrer les modifications' }}
        </button>
        <button class="fr-btn fr-btn--secondary" :disabled="saving" @click="refresh">Annuler</button>
      </div>
    </div>

    <div v-if="successMessage" class="fr-alert fr-alert--success fr-mb-3w">
      <p class="fr-alert__title">{{ successMessage }}</p>
    </div>
    <div v-if="errorMessage" class="fr-alert fr-alert--error fr-mb-3w">
      <p class="fr-alert__title">{{ errorMessage }}</p>
    </div>

    <AdminHistoryTable :history="history" />
    <AdminPriorityTable :projects="sortedProjects" :loading="loading" @update-priority="updatePriority" />
  </div>
</template>

<script setup lang="ts">
// Désactive le SSR : évite d'inclure nafMapping.json dans le bundle Nitro (cause OOM au build)
definePageMeta({ ssr: false })

const selectedNaf = ref('')
const { loading, saving, hasChanges, successMessage, errorMessage, sortedProjects, updatePriority, saveChanges, refresh, history, loadHistory } = useBaserowPriorities(selectedNaf)
const { currentUser, logout } = useAdminSession()

onMounted(() => Promise.all([refresh(), loadHistory()]))
watch(selectedNaf, () => { errorMessage.value = ''; successMessage.value = '' })
</script>
