<template>
  <div class="coverage-filters fr-grid-row fr-grid-row--gutters fr-mb-4w">
    <div
      v-if="!hideProject"
      class="fr-col-12 fr-col-md-4"
    >
      <div class="filter-with-clear">
        <DsfrSelect
          v-model="localProjectId"
          label="Projet"
          :options="projectOptions"
          default-unselected-text="Tous les projets"
        />
        <button
          v-if="props.projectId !== null"
          class="clear-btn"
          title="Effacer"
          aria-label="Effacer le filtre projet"
          @click="emit('update:projectId', null)"
        >
          ✕
        </button>
      </div>
    </div>
    <div class="fr-col-12 fr-col-md-4">
      <div class="filter-with-clear">
        <DsfrSelect
          v-model="localSector"
          label="Secteur d'activité"
          :options="sectorOptions"
          default-unselected-text="Tous les secteurs"
        />
        <button
          v-if="props.sector !== null"
          class="clear-btn"
          title="Effacer"
          aria-label="Effacer le filtre secteur"
          @click="emit('update:sector', null)"
        >
          ✕
        </button>
      </div>
    </div>
    <div class="fr-col-12 fr-col-md-4">
      <div class="filter-with-clear">
        <DsfrSelect
          v-model="localSize"
          label="Taille d'entreprise"
          :options="sizeOptions"
          default-unselected-text="Toutes les tailles"
        />
        <button
          v-if="props.size !== null"
          class="clear-btn"
          title="Effacer"
          aria-label="Effacer le filtre taille"
          @click="emit('update:size', null)"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { coverage } from '@tee/data/static'
import { StructureSize, SizeToText } from '@tee/common'

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
  hideProject?: boolean
}>()

const emit = defineEmits<{
  'update:projectId': [value: number | null]
  'update:sector': [value: string | null]
  'update:size': [value: StructureSize | null]
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

const projectOptions = computed(() =>
  [...coverage.projects].sort((a, b) => a.title.localeCompare(b.title, 'fr')).map((p) => ({ value: String(p.id), text: p.title }))
)

const sectorOptions = Object.entries(NAF_LABELS).map(([code, label]) => ({
  value: code,
  text: `${code} — ${label}`
}))

const sizeOptions = (Object.keys(StructureSize) as StructureSize[]).map((s) => ({
  value: s,
  text: SizeToText[s].title
}))
</script>

<style scoped>
.filter-with-clear {
  position: relative;
}
.clear-btn {
  position: absolute;
  top: 0;
  right: 0;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: 700;
  color: #c9191e;
  padding: 0.25rem 0.5rem;
  line-height: 1.5rem;
}
.clear-btn:hover {
  color: #800012;
  text-decoration: underline;
}
</style>
