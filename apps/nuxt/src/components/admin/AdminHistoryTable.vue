<template>
  <details class="fr-mb-4w history-details">
    <summary class="fr-text--bold fr-py-2w">Historique des modifications ({{ history.length }})</summary>
    <div class="fr-table fr-table--sm fr-table--no-caption fr-mt-2w">
      <table>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Utilisateur</th>
            <th scope="col">Code NAF</th>
            <th scope="col">Projets</th>
            <th scope="col">Avant</th>
            <th scope="col">Après</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="history.length === 0">
            <td colspan="6" class="fr-text--center">Aucune modification enregistrée</td>
          </tr>
          <tr v-for="(entry, i) in history" :key="i">
            <td class="fr-text--sm" style="white-space: nowrap">{{ formatDate(entry.date) }}</td>
            <td class="fr-text--sm fr-text--bold">{{ entry.user }}</td>
            <td>
              <span v-if="entry.nafCode" class="fr-badge fr-badge--sm fr-badge--blue-cumulus">{{ entry.nafCode }}</span>
              <span v-else class="fr-text--sm">Global</span>
            </td>
            <td class="fr-text--sm">{{ entry.count }} projet{{ entry.count > 1 ? 's' : '' }}</td>
            <td class="fr-text--sm history-cell">{{ entry.avant }}</td>
            <td class="fr-text--sm history-cell">{{ entry.après }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </details>
</template>

<script setup lang="ts">
import type { HistoryEntry } from '~/types/baserow'

defineProps<{ history: HistoryEntry[] }>()

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
</script>

<style scoped>
.history-details {
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  padding: 0 1rem;
}
.history-details summary {
  cursor: pointer;
  list-style: none;
  padding: 0.75rem 0;
}
.history-details summary::before { content: '▶ '; font-size: 0.75rem; }
.history-details[open] summary::before { content: '▼ '; }
.history-cell {
  white-space: pre-line;
  max-width: 18rem;
  vertical-align: top;
}
</style>
