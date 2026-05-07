<template>
  <div class="coverage-main-misses">
    <template
      v-for="group in groups"
      :key="group.category"
    >
      <div
        v-if="group.items.length > 0"
        class="miss-group fr-mb-4w"
      >
        <div class="miss-group__header fr-mb-2w">
          <span
            :class="`coverage-dot coverage-dot--${group.dotLevel}`"
            aria-hidden="true"
          />
          <h2 class="fr-h5 fr-mb-0">{{ group.label }}</h2>
          <span class="fr-badge fr-badge--sm fr-ml-1w">{{ group.items.length }}</span>
        </div>

        <div class="fr-table fr-table--bordered fr-table--no-caption fr-table--sm">
          <table>
            <thead>
              <tr>
                <th scope="col">Projet</th>
                <th scope="col">Détail</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="miss in group.items"
                :key="miss.project.id"
              >
                <td>
                  <strong>{{ miss.project.title }}</strong>
                  <br />
                  <span class="fr-text--sm fr-text--mention"
                    >{{ miss.totalPrograms }} programme{{ miss.totalPrograms > 1 ? 's' : '' }} au total</span
                  >
                </td>
                <td>
                  <template v-if="miss.category === 'national-void'">
                    <span class="fr-text--sm">Aucun programme disponible sur l'ensemble du territoire</span>
                  </template>
                  <template v-else-if="miss.category === 'national-financement-gap' || miss.category === 'national-type-gap'">
                    <span class="fr-text--sm fr-mr-1w">Types absents partout :</span>
                    <span
                      v-for="t in miss.missingTypesNational"
                      :key="t"
                      :class="['fr-badge fr-badge--sm fr-mr-1w', t === 'financement' ? 'fr-badge--error' : 'fr-badge--warning']"
                      >{{ t }}</span
                    >
                  </template>
                  <template v-else-if="miss.category === 'regional-void'">
                    <span class="fr-text--sm fr-mr-1w">Régions sans programme :</span>
                    <span
                      v-for="r in miss.emptyRegions"
                      :key="r"
                      class="fr-tag fr-tag--sm fr-mr-1w"
                      >{{ r }}</span
                    >
                  </template>
                  <template v-else-if="miss.category === 'regional-type-gap'">
                    <span class="fr-text--sm fr-mr-1w">Régions avec types manquants :</span>
                    <span
                      v-for="r in miss.regionsWithTypeGap"
                      :key="r"
                      class="fr-tag fr-tag--sm fr-mr-1w"
                      >{{ r }}</span
                    >
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <p
      v-if="misses.length === 0"
      class="fr-text--lead fr-mt-4w fr-text--center"
    >
      ✅ Aucune lacune identifiée avec les filtres actuels.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ProjectMiss, MissCategory } from '@/composables/useCoverage'

const props = defineProps<{
  misses: ProjectMiss[]
}>()

interface MissGroup {
  category: MissCategory
  label: string
  dotLevel: string
  items: ProjectMiss[]
}

const groups = computed<MissGroup[]>(() => [
  {
    category: 'national-void',
    label: 'Aucune aide disponible nationalement',
    dotLevel: 'none',
    items: props.misses.filter((m) => m.category === 'national-void')
  },
  {
    category: 'national-financement-gap',
    label: 'Pas de financement disponible nationalement',
    dotLevel: 'financement-gap',
    items: props.misses.filter((m) => m.category === 'national-financement-gap')
  },
  {
    category: 'national-type-gap',
    label: "Types d'aide manquants sur l'ensemble du territoire",
    dotLevel: 'type-gap',
    items: props.misses.filter((m) => m.category === 'national-type-gap')
  },
  {
    category: 'regional-void',
    label: 'Absence de couverture dans certaines régions',
    dotLevel: 'none',
    items: props.misses.filter((m) => m.category === 'regional-void')
  },
  {
    category: 'regional-type-gap',
    label: "Types d'aide manquants dans certaines régions",
    dotLevel: 'type-gap',
    items: props.misses.filter((m) => m.category === 'regional-type-gap')
  }
])
</script>

<style scoped>
.miss-group__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.coverage-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
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
</style>
