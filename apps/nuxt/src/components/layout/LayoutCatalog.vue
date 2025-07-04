<template>
  <Layout before-default-class="fr-container--fluid fr-container-md">
    <template #beforeDefault>
      <slot name="beforeDefault">
        <div class="fr-grid-row">
          <div class="fr-container fr-grid-row fr-px-md-0">
            <div
              class="fr-col-12 fr-mt-3v fr-text-center fr-text-left-md"
              :class="lineClassBySideMenu"
            >
              <h1 class="fr-text--blue-france">{{ title }}</h1>
            </div>
          </div>
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
      v-if="$slots.faq || faqPage"
      #faq
    >
      <slot name="faq">
        <FaqCatalog
          v-if="faqPage"
          :faq-page="faqPage"
          :has-side-menu="hasSideMenu"
        />
      </slot>
    </template>
  </Layout>
</template>

<script setup lang="ts">
import FaqCatalog from '@/components/faq/FaqCatalog.vue'
import Layout from '@/components/layout/Layout.vue'
import { useFiltersStore } from '@/stores/filters'
import { useNavigationStore } from '@/stores/navigation'
import { FaqPage } from '@/tools/faq/faqType'
import Navigation from '@/tools/navigation'
import { Theme } from '@/tools/theme'
import { ThemeId } from '@tee/data'
import { computed } from 'vue'

interface Props {
  hasSideMenu: boolean
  title?: string
  hasError?: boolean
  countItems: number
  faqPage?: FaqPage
}
const props = defineProps<Props>()

const filtersStore = useFiltersStore()
const { hasSpinner } = storeToRefs(useNavigationStore())
const theme = Theme.getThemeFromSelectedTheme()

const lineClassBySideMenu = computed(() => {
  return Navigation.getClassesBySideMenu(props.hasSideMenu)
})

const hasThemeCard = computed(() => {
  return filtersStore.hasThemeTypeSelected()
})

const hasNoResultsOrError = computed(() => {
  return !hasSpinner.value && (props.hasError || !props.countItems)
})
</script>
