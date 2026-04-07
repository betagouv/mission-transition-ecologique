<template>
  <div class="fr-container fr-mt-4w fr-mb-8w">
    <div class="fr-mb-3w">
      <h1 class="fr-h2">Diagnostic de couverture des aides</h1>
      <p class="fr-text--lead fr-mb-0">
        Identifiez les zones géographiques et profils d'entreprises insuffisamment couverts par les programmes d'aides à la transition
        écologique. Filtrez par taille d'entreprise et secteur d'activité pour visualiser les lacunes.
      </p>
    </div>

    <!-- Shared sticky filter bar -->
    <CoverageDemoFilters
      :project-id="activeTab === 0 ? projectId : null"
      :sector="sector"
      :size="size"
      :operator="operator"
      :hide-project="activeTab !== 0"
      @update:project-id="projectId = $event"
      @update:sector="sector = $event"
      @update:size="size = $event"
      @update:operator="operator = $event"
    />

    <div class="fr-tabs">
      <ul
        class="fr-tabs__list"
        role="tablist"
        aria-label="Vues du diagnostic"
      >
        <li role="presentation">
          <button
            id="tab-par-projet"
            role="tab"
            class="fr-tabs__tab"
            :aria-selected="activeTab === 0"
            aria-controls="panel-par-projet"
            @click="activeTab = 0"
          >
            Par projet
          </button>
        </li>
        <li role="presentation">
          <button
            id="tab-lacunes"
            role="tab"
            class="fr-tabs__tab"
            :aria-selected="activeTab === 1"
            aria-controls="panel-lacunes"
            @click="activeTab = 1"
          >
            Principales lacunes identifiées
          </button>
        </li>
      </ul>

      <!-- Tab 1: Par projet -->
      <div
        id="panel-par-projet"
        role="tabpanel"
        class="fr-tabs__panel"
        :class="{ 'fr-tabs__panel--selected': activeTab === 0 }"
        aria-labelledby="tab-par-projet"
      >
        <!-- Stats summary -->
        <div class="fr-grid-row fr-grid-row--gutters fr-mb-4w">
          <div class="fr-col-6 fr-col-md-3">
            <div class="fr-tile fr-tile--sm fr-tile--no-icon">
              <div class="fr-tile__body">
                <p class="fr-tile__title fr-h3 fr-mb-0">{{ stats.totalPrograms }}</p>
                <p class="fr-tile__desc fr-text--sm fr-mb-0">programmes correspondants</p>
              </div>
            </div>
          </div>
          <div class="fr-col-6 fr-col-md-3">
            <div class="fr-tile fr-tile--sm fr-tile--no-icon">
              <div class="fr-tile__body">
                <p class="fr-tile__title fr-h3 fr-mb-0">
                  {{ stats.regionsCovered }}<span class="fr-text--sm fr-text--regular"> / {{ ALL_REGIONS.length }}</span>
                </p>
                <p class="fr-tile__desc fr-text--sm fr-mb-0">régions couvertes</p>
              </div>
            </div>
          </div>
          <div class="fr-col-6 fr-col-md-3">
            <div class="fr-tile fr-tile--sm fr-tile--no-icon coverage-stat--danger">
              <div class="fr-tile__body">
                <p class="fr-tile__title fr-h3 fr-mb-0">{{ stats.hardGaps }}</p>
                <p class="fr-tile__desc fr-text--sm fr-mb-0">zones sans couverture</p>
              </div>
            </div>
          </div>
          <div class="fr-col-6 fr-col-md-3">
            <div class="fr-tile fr-tile--sm fr-tile--no-icon coverage-stat--warning">
              <div class="fr-tile__body">
                <p class="fr-tile__title fr-h3 fr-mb-0">{{ stats.aidTypeGaps }}</p>
                <p class="fr-tile__desc fr-text--sm fr-mb-0">zones avec types manquants</p>
              </div>
            </div>
          </div>
        </div>

        <div class="fr-grid-row fr-grid-row--gutters fr-mb-4w">
          <div class="fr-col-12 fr-col-md-7">
            <CoverageDemoMap :coverage-by-region="coverageByRegion" />
          </div>
          <div class="fr-col-12 fr-col-md-5 coverage-legend-col">
            <p class="fr-text--sm fr-text--bold fr-mb-2w">Légende</p>
            <div class="coverage-legend">
              <span class="coverage-legend__item"><span class="coverage-dot coverage-dot--none" />Aucun programme</span>
              <span class="coverage-legend__item"><span class="coverage-dot coverage-dot--financement-gap" />Pas de financement</span>
              <span class="coverage-legend__item"><span class="coverage-dot coverage-dot--type-gap" />Types d'aide incomplets</span>
              <span class="coverage-legend__item"><span class="coverage-dot coverage-dot--covered" />Couverture satisfaisante</span>
            </div>
          </div>
        </div>

        <CoverageDemoGapsTable :regions="sortedRegions" />
      </div>

      <!-- Tab 2: Principales lacunes -->
      <div
        id="panel-lacunes"
        role="tabpanel"
        class="fr-tabs__panel"
        :class="{ 'fr-tabs__panel--selected': activeTab === 1 }"
        aria-labelledby="tab-lacunes"
      >
        <CoverageDemoMainMisses :misses="misses" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { StructureSize } from '@tee/common'
import { useCoverage, useMainMisses, ALL_REGIONS } from '@/composables/useCoverage'
import CoverageDemoFilters from '@/components/demo/CoverageFilters.vue'
import CoverageDemoMap from '@/components/demo/CoverageMap.vue'
import CoverageDemoGapsTable from '@/components/demo/CoverageGapsTable.vue'
import CoverageDemoMainMisses from '@/components/demo/CoverageMainMisses.vue'

const activeTab = ref(0)

const projectId = ref<number | null>(null)
const sector = ref<string | null>(null)
const size = ref<StructureSize | null>(null)
const operator = ref<string | null>(null)

// Tab 1 — filtered by project + sector + size + operator
const { sortedRegions, coverageByRegion, stats } = useCoverage(projectId, sector, size, operator)

// Tab 2 — sector + size + operator only, across all projects
const { misses } = useMainMisses(sector, size, operator)
</script>

<style scoped>
.coverage-stat--danger .fr-tile__title {
  color: #c9191e;
}
.coverage-stat--warning .fr-tile__title {
  color: #b34000;
}

.coverage-legend-col {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.coverage-legend {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 0.875rem;
}
.coverage-legend__item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
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
