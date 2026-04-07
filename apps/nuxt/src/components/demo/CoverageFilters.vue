<template>
  <div class="coverage-filters-bar">
    <div class="coverage-filters-bar__inner">
      <span class="coverage-filters-bar__label">Filtres</span>

      <!-- Sector -->
      <div class="filter-group">
        <select
          v-model="localSector"
          class="fr-select filter-select"
        >
          <option value="">Tous les secteurs</option>
          <option
            v-for="([code, label]) in sectorEntries"
            :key="code"
            :value="code"
          >
            {{ code }} — {{ label }}
          </option>
        </select>
      </div>

      <!-- Size -->
      <div class="filter-group">
        <select
          v-model="localSize"
          class="fr-select filter-select"
        >
          <option value="">Toutes les tailles</option>
          <option
            v-for="s in sizeOptions"
            :key="s.value"
            :value="s.value"
          >
            {{ s.text }}
          </option>
        </select>
      </div>

      <!-- Operator -->
      <div class="filter-group filter-group--wide">
        <select
          v-model="localOperator"
          class="fr-select filter-select"
        >
          <option value="">Tous les opérateurs</option>
          <option
            v-for="op in ALL_OPERATORS"
            :key="op"
            :value="op"
          >
            {{ op }}
          </option>
        </select>
      </div>

      <!-- Project (tab 1 only) -->
      <div
        v-if="!hideProject"
        class="filter-group filter-group--wide"
      >
        <select
          v-model="localProjectId"
          class="fr-select filter-select"
        >
          <option value="">Tous les projets</option>
          <option
            v-for="p in projectOptions"
            :key="p.value"
            :value="p.value"
          >
            {{ p.text }}
          </option>
        </select>
      </div>

      <!-- Active count + clear -->
      <div class="coverage-filters-bar__actions">
        <span
          v-if="activeCount > 0"
          class="coverage-filters-bar__count"
        >{{ activeCount }} filtre{{ activeCount > 1 ? 's' : '' }}</span>
        <button
          v-if="activeCount > 0"
          class="coverage-filters-bar__clear"
          @click="clearAll"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { coverage } from '@tee/data/static'
import { StructureSize, SizeToText } from '@tee/common'
import { ALL_OPERATORS } from '@/composables/useCoverage'

const NAF_LABELS: Record<string, string> = {
  A: 'Agriculture, sylviculture et pêche',
  B: 'Industries extractives',
  C: 'Industrie manufacturière',
  D: "Production et distribution d'énergie",
  E: 'Eau, assainissement et déchets',
  F: 'Construction',
  G: 'Commerce et réparation automobile',
  H: 'Transport et entreposage',
  I: 'Hébergement et restauration',
  J: 'Information et communication',
  K: "Activités financières et d'assurance",
  L: 'Activités immobilières',
  M: 'Activités spécialisées et scientifiques',
  N: 'Services administratifs et de soutien',
  O: 'Administration publique',
  P: 'Enseignement',
  Q: 'Santé humaine et action sociale',
  R: 'Arts, spectacles et loisirs',
  S: 'Autres activités de services',
  T: 'Ménages employeurs',
  U: 'Activités extraterritoriales'
}

const props = defineProps<{
  projectId: number | null
  sector: string | null
  size: StructureSize | null
  operator: string | null
  hideProject?: boolean
}>()

const emit = defineEmits<{
  'update:projectId': [value: number | null]
  'update:sector': [value: string | null]
  'update:size': [value: StructureSize | null]
  'update:operator': [value: string | null]
}>()

const localProjectId = computed({
  get: () => (props.projectId !== null ? String(props.projectId) : ''),
  set: (v: string) => emit('update:projectId', v ? Number(v) : null)
})
const localSector = computed({
  get: () => props.sector ?? '',
  set: (v: string) => emit('update:sector', v || null)
})
const localSize = computed({
  get: () => props.size ?? '',
  set: (v: string) => emit('update:size', (v as StructureSize) || null)
})
const localOperator = computed({
  get: () => props.operator ?? '',
  set: (v: string) => emit('update:operator', v || null)
})

const sectorEntries = Object.entries(NAF_LABELS)

const sizeOptions = (Object.keys(StructureSize) as StructureSize[]).map((s) => ({
  value: s,
  text: SizeToText[s].title
}))

const projectOptions = computed(() =>
  [...coverage.projects]
    .sort((a, b) => a.title.localeCompare(b.title, 'fr'))
    .map((p) => ({ value: String(p.id), text: p.title }))
)

const activeCount = computed(() =>
  [props.sector, props.size, props.operator, props.hideProject ? null : props.projectId]
    .filter((v) => v !== null && v !== undefined && v !== '').length
)

function clearAll() {
  emit('update:sector', null)
  emit('update:size', null)
  emit('update:operator', null)
  if (!props.hideProject) emit('update:projectId', null)
}
</script>

<style scoped>
.coverage-filters-bar {
  background: #fff;
  border-bottom: 1px solid var(--border-default-grey);
  border-top: 1px solid var(--border-default-grey);
  padding: 0.65rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.coverage-filters-bar__inner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.coverage-filters-bar__label {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-mention-grey);
  flex-shrink: 0;
  white-space: nowrap;
}

.filter-group {
  flex: 1;
  min-width: 150px;
  max-width: 220px;
}
.filter-group--wide {
  max-width: 300px;
}

.filter-select {
  font-size: 0.82rem !important;
  padding: 0.35rem 2rem 0.35rem 0.6rem !important;
  height: auto !important;
  min-height: unset !important;
  background-size: 1rem !important;
  margin-bottom: 0 !important;
}

.coverage-filters-bar__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
  flex-shrink: 0;
}

.coverage-filters-bar__count {
  font-size: 0.8rem;
  color: #000091;
  font-weight: 600;
  white-space: nowrap;
}

.coverage-filters-bar__clear {
  background: none;
  border: 1px solid var(--border-default-grey);
  border-radius: 4px;
  padding: 0.3rem 0.7rem;
  font-size: 0.8rem;
  cursor: pointer;
  color: #c9191e;
  white-space: nowrap;
  transition: background 0.15s;
}
.coverage-filters-bar__clear:hover {
  background: #fff0f0;
}

@media (max-width: 768px) {
  .filter-group,
  .filter-group--wide {
    min-width: 140px;
    max-width: 100%;
    flex: 1 1 140px;
  }
}
</style>
