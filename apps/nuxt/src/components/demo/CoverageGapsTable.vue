<template>
  <div class="coverage-gaps-table">
    <div class="fr-grid-row fr-grid-row--middle fr-mb-2w">
      <div class="fr-col">
        <h2 class="fr-h4 fr-mb-0">Détail par région</h2>
      </div>
      <div class="fr-col-auto">
        <button
          class="fr-btn fr-btn--secondary fr-btn--sm fr-btn--icon-left fr-icon-download-line"
          @click="exportCsv"
        >
          Exporter CSV
        </button>
      </div>
    </div>

    <div class="fr-table fr-table--bordered fr-table--no-caption">
      <table>
        <thead>
          <tr>
            <th scope="col">Région</th>
            <th
              scope="col"
              class="fr-text--center"
            >
              Programmes
            </th>
            <th scope="col">Types présents</th>
            <th scope="col">Types manquants</th>
            <th scope="col">Programmes disponibles</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in regions"
            :key="row.region"
            :class="`coverage-row--${row.level}`"
          >
            <td>
              <span
                :class="`coverage-dot coverage-dot--${row.level}`"
                aria-hidden="true"
              />
              {{ row.region }}
              <span
                v-if="isOverseas(row.region)"
                class="fr-badge fr-badge--sm fr-badge--info fr-ml-1w"
                >DROM</span
              >
            </td>
            <td class="fr-text--center">
              <strong>{{ row.programs.length }}</strong>
            </td>
            <td>
              <span
                v-if="row.aidTypesPresent.length === 0"
                class="fr-text--disabled"
                >—</span
              >
              <span
                v-for="type in row.aidTypesPresent"
                :key="type"
                class="fr-badge fr-badge--sm fr-badge--success fr-mr-1w"
                >{{ type }}</span
              >
            </td>
            <td>
              <span
                v-if="row.missingAidTypes.length === 0"
                class="fr-text--disabled"
                >—</span
              >
              <span
                v-for="type in row.missingAidTypes"
                :key="type"
                :class="['fr-badge fr-badge--sm fr-mr-1w', type === 'financement' ? 'fr-badge--error' : 'fr-badge--warning']"
                >{{ type }}</span
              >
            </td>
            <td>
              <span
                v-if="row.programs.length === 0"
                class="fr-text--disabled"
                >Aucun programme</span
              >
              <template v-else>
                <NuxtLink
                  v-for="p in expanded.has(row.region) ? row.programs : row.programs.slice(0, 3)"
                  :key="p.id"
                  :to="`/aides-entreprise/${p.id}`"
                  class="fr-tag fr-tag--sm fr-mr-1w fr-mb-1w"
                  :title="p.title"
                  >{{ p.title.length > 35 ? p.title.slice(0, 35) + '…' : p.title }}</NuxtLink
                >
                <button
                  v-if="row.programs.length > 3 && !expanded.has(row.region)"
                  class="fr-tag fr-tag--sm fr-mr-1w fr-mb-1w expand-btn"
                  @click="expanded.add(row.region)"
                >
                  +{{ row.programs.length - 3 }} autres
                </button>
                <button
                  v-else-if="row.programs.length > 3 && expanded.has(row.region)"
                  class="fr-tag fr-tag--sm fr-mr-1w fr-mb-1w expand-btn"
                  @click="expanded.delete(row.region)"
                >
                  Réduire
                </button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { OVERSEAS_REGIONS, type RegionCoverage } from '@/composables/useCoverage'

const props = defineProps<{
  regions: RegionCoverage[]
}>()

const expanded = reactive(new Set<string>())

function isOverseas(region: string): boolean {
  return OVERSEAS_REGIONS.includes(region)
}

function exportCsv() {
  const headers = ['Région', 'Nb programmes', 'Types présents', 'Types manquants', 'Programmes']
  const rows = props.regions.map((r) => [
    r.region,
    r.programs.length,
    r.aidTypesPresent.join(' | '),
    r.missingAidTypes.join(' | '),
    r.programs.map((p) => p.title).join(' | ')
  ])

  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'couverture-aides.csv'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.coverage-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 6px;
  vertical-align: middle;
}
.coverage-dot--none {
  background-color: #c9191e;
}
.coverage-dot--financement-gap {
  background-color: #e4794a;
}
.coverage-dot--type-gap {
  background-color: #d1b000;
}
.coverage-dot--covered {
  background-color: #18753c;
}

.coverage-row--none td:first-child {
  font-weight: 600;
}

.expand-btn {
  cursor: pointer;
  font-style: italic;
  opacity: 0.75;
}
.expand-btn:hover {
  opacity: 1;
}
</style>
