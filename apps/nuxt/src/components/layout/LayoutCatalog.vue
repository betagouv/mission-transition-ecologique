<template>
  <Layout before-default-class="fr-container--fluid fr-container-md">
    <template #top>
      <TeeCatalogBanner
        v-if="!hasError"
        :bg-color="Color.greenAgirLightnessed"
      >
        <template #title>
          <div
            v-if="$slots.title"
            :class="lineClassBySideMenuForTitle"
            class="fr-pt-6v"
          >
            <slot name="title"> </slot>
          </div>
          <h1
            v-else
            class="fr-text--blue-900 fr-pt-6v fr-mb-0"
            :class="lineClassBySideMenuForTitle"
          >
            {{ title }}
          </h1>
        </template>
        <template #description>
          <p
            v-if="description"
            class="fr-text--md fr-mt-1v"
            :class="lineClassBySideMenuForDescription"
          >
            {{ description }}
          </p>
        </template>
      </TeeCatalogBanner>
    </template>
    <template #beforeDefault>
      <slot name="beforeDefault">
        <div class="fr-grid-row">
          <div
            v-if="!hasError"
            class="fr-col-12 fr-mt-3v"
            :class="lineClassBySideMenu"
          >
            <ThemeFilter />
          </div>
        </div>
        <div
          v-if="!hasError"
          class="fr-grid-row"
        >
          <div
            class="fr-col-12"
            :class="lineClassBySideMenu"
          >
            <ThemeHeaderCard
              v-if="hasThemeCard"
              :theme="theme as ThemeId"
              radius-corner="tr"
              radius-size="2-5v"
            />
          </div>
        </div>
      </slot>
    </template>
    <template
      v-if="hasSideMenu && $slots.sidemenu"
      #sidemenu
    >
      <slot name="sidemenu"> </slot>
    </template>
    <slot v-if="!hasSpinner && !hasError" />
    <div
      v-if="hasSpinner"
      class="fr-col-12 fr-col-justify--center"
    >
      <TeeSpinner class="fr-my-16w" />
    </div>
    <TeeListNoResults
      v-else-if="hasNoResultsOrError"
      :has-error="hasError"
      message="Aucune idée d'action n'a pu être identifiée avec les critères choisis..."
      :count-items="countItems"
    />
    <template
      v-if="$slots.faq || faqItems"
      #faq
    >
      <slot name="faq">
        <FaqCatalog
          v-if="faqItems"
          :faq-items="faqItems"
          :has-side-menu="hasSideMenu"
        />
      </slot>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import TeeCatalogBanner from '@/components/element/TeeCatalogBanner.vue'
import FaqCatalog from '@/components/faq/FaqCatalog.vue'
import Layout from '@/components/layout/Layout.vue'
import { useFiltersStore } from '@/stores/filters'
import { useNavigationStore } from '@/stores/navigation'
import Navigation from '@/tools/navigation'
import { Theme } from '@/tools/theme'
import { ThemeId, FaqSectionType, Color } from '@/types'
import { computed } from 'vue'

interface Props {
  hasSideMenu: boolean
  title?: string
  description?: string
  hasError?: boolean
  countItems: number
  faqItems?: FaqSectionType[]
}
const props = defineProps<Props>()

const filtersStore = useFiltersStore()
const { hasSpinner } = storeToRefs(useNavigationStore())
const theme = Theme.getThemeFromSelectedTheme()

const lineClassBySideMenu = computed(() => {
  return Navigation.getClassesBySideMenu(props.hasSideMenu)
})

const lineClassBySideMenuForTitle = computed(() => {
  return Navigation.getClassesBySideMenu(props.hasSideMenu, 11)
})

const lineClassBySideMenuForDescription = computed(() => {
  return Navigation.getClassesBySideMenu(props.hasSideMenu, 9)
})

const hasThemeCard = computed(() => {
  return filtersStore.hasThemeTypeSelected()
})

const hasNoResultsOrError = computed(() => {
  return !hasSpinner.value && (props.hasError || !props.countItems)
})
</script>
