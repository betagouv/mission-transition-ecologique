<template>
  <div
    id="company-data-filter-content"
    class="fr-pt-2v fr-pb-0-5v"
    :class="{
      'fr-bg--green--lightness': filters[FilterItemKeys.companyData],
      'fr-bg--grey--lightness': !filters[FilterItemKeys.companyData]
    }"
  >
    <DsfrCheckbox
      v-model="filters[FilterItemKeys.companyData]"
      :value="`selected-company-${companyName}`"
      small
      name="companyFilter"
      :disabled="navigation.isQuestionnaireResult()"
    >
      <template #label>
        <span
          class="fr-text--bold fr-text--sm"
          :class="{
            'fr-text--grey': !filters[FilterItemKeys.companyData],
            'fr-text--black': navigation.isQuestionnaireResult(),
            'fr-pl-0-5v': !Breakpoint.isSmallScreen(),
            'fr-pl-2v': Breakpoint.isMobile()
          }"
          >{{ filterData.title }}</span
        >
      </template>
    </DsfrCheckbox>
    <div class="fr-text-left fr-pl-1v">
      <div
        v-for="(detail, key) in filterData.details"
        :key="key"
        class="fr-mb-2v"
        :class="{ 'fr-text--grey': !filters[FilterItemKeys.companyData] }"
      >
        <div class="fr-grid-row">
          <div class="fr-col-1 fr-col-content--middle">
            <span
              class="company-filter-icon fr-pl-1v fr-col-content--middle"
              :class="detail.icon"
            />
          </div>
          <div class="fr-col-11 fr-pl-md-4v fr-pr-1v fr-text-line-height--4v fr-col-content--middle">
            <span class="fr-text--xs">{{ detail.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CompanyDataStorageKey, FilterItemKeys, FiltersType, SizeToText, StructureSize } from '@/types'
import { CompanyData } from '@/tools/companyData'
import Breakpoint from '@/tools/breakpoints'
import Navigation from '@/tools/navigation'
import { useFiltersStore } from '@/stores/filters'

type CompanyFilterProps = {
  title: ComputedRef<string | undefined>
  details: {
    sector: CompanyFilterDetailProps
    region: CompanyFilterDetailProps
    size: CompanyFilterDetailProps
  }
}

type CompanyFilterDetailProps = {
  label: ComputedRef<string | undefined | null>
  icon?: string
}
const navigation = new Navigation()
const filters: FiltersType = useFiltersStore().filters

const registeredData = CompanyData.dataRef
const hasRegisteredData = CompanyData.isDataFull()
const companyName = computed(() => registeredData.value[CompanyDataStorageKey.Company]?.denomination)
const companySector = computed(() => registeredData.value[CompanyDataStorageKey.Company]?.secteur)
const companyRegion = computed(() => registeredData.value[CompanyDataStorageKey.Company]?.region)
const companySize = computed(() => SizeToText[registeredData.value[CompanyDataStorageKey.Size] as StructureSize])

const filterData: CompanyFilterProps = {
  title: companyName,
  details: {
    sector: { label: companySector, icon: 'fr-icon-briefcase-line' },
    region: { label: companyRegion, icon: 'fr-icon-map-pin-2-line' },
    size: { label: companySize, icon: 'fr-icon-team-line' }
  }
}
watch(
  hasRegisteredData,
  (value) => {
    filters[FilterItemKeys.companyData] = value
  },
  { immediate: true }
)
</script>
<style lang="scss" scoped>
#company-data-filter-content {
  padding-left: 0 !important;

  .fr-fieldset__element {
    margin-bottom: 0.5rem !important;
  }
}

.company-filter-icon::before {
  display: inline-block;
  width: 1rem;
  height: 1rem;
}
</style>
