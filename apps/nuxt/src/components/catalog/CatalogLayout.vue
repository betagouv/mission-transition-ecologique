<template>
  <div class="fr-grid-row fr-grid-row--center">
    <div class="fr-container fr-m-0 fr-p-0 fr-pl-md-2v">
      <div
        class="fr-col-12 fr-mt-3v"
        :class="{
          'fr-col-offset-md-1 fr-col-offset-lg-2 fr-col-md-10 fr-col-justify--left': !hasError,
          'fr-col-lg-12 fr-col-justify--center': hasError
        }"
      >
        <h1 class="fr-text--blue-france">{{ title }}</h1>
      </div>
      <div
        class="fr-col-12 fr-mt-3v"
        :class="{
          'fr-col-offset-md-1 fr-col-offset-lg-2 fr-col-md-10 fr-col-justify--left': !hasError && hasSideBar,
          'fr-col-lg-12 fr-col-justify--center': hasError || !hasSideBar
        }"
      >
        <ThemeFilter />
      </div>
      <div
        class="fr-col-12 fr-pr-md-2v"
        :class="{
          'fr-col-offset-md-1 fr-col-offset-lg-2 fr-col-md-10': !hasError && hasSideBar,
          'fr-col-md-12': hasError || !hasSideBar
        }"
      >
        <ThemeHeaderCard
          v-if="hasThemeCard"
          :theme="theme as ThemeId"
          radius-corner="tr"
          radius-size="2-5v"
        />
      </div>
    </div>
  </div>
  <div class="fr-grid-row fr-grid-row--center">
    <div class="fr-container fr-m-0 fr-p-0 fr-pl-md-2v">
      <div
        :class="{
          'fr-grid-row': !hasError && hasSideBar,
          'fr-grid-row--center': !hasError || !hasSideBar
        }"
      >
        <div
          v-if="hasSpinner"
          class="fr-col-12 fr-col-justify--center"
        >
          <TeeSpinner class="fr-mt-16w" />
        </div>
        <TeeListNoResults
          v-else-if="showNoResultsComponent"
          :has-error="hasError && !hasSpinner"
          message="Aucune idée d'action n'a pu être identifiée avec les critères choisis..."
          :count-items="countItems"
        />
        <slot
          v-if="!hasSpinner && !hasError"
          name="catalog-content"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNavigationStore } from '@/stores/navigation'
import { ThemeId } from '@/types'
import { MetaSeo } from '@/tools/metaSeo'
import { computed } from 'vue'
import { Theme } from '@/tools/theme'
import { useFiltersStore } from '@/stores/filters'

const filtersStore = useFiltersStore()

export interface CatalogProps {
  title: string
  description: string
  hasError: boolean
  countItems: number
  hasSideBar: boolean
}
const props = defineProps<CatalogProps>()

useSeoMeta(MetaSeo.get(props.title, props.description))

const theme = Theme.getThemeFromSelectedTheme()

const hasError = ref(props.hasError)

const { hasSpinner } = storeToRefs(useNavigationStore())

const hasThemeCard = computed(() => {
  return filtersStore.hasThemeTypeSelected() && !hasSpinner.value
})

const showNoResultsComponent = computed(() => {
  return hasSpinner.value || hasError.value || !props.countItems
})

onBeforeRouteLeave(() => {
  useSeoMeta(MetaSeo.default())
})
</script>
