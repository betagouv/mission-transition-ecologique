<template>
  <div
    class="fr-py-2v"
    :class="{
      'fr-bg--green--lightness': programFilters[FilterItemKeys.companyData],
      'fr-bg--grey--lightness': !programFilters[FilterItemKeys.companyData]
    }"
  >
    <DsfrCheckbox
      v-model="programFilters[FilterItemKeys.companyData]"
      :value="`selected-company-${companyName}`"
      small
      name="companyFilter"
    >
      <template #label>
        <span
          class="fr-text--bold fr-pl-0-5v"
          :class="{ 'fr-text--grey': !programFilters[FilterItemKeys.companyData], 'fr-text--sm': !Breakpoint.isMobile() }"
          >{{ filterData.title }}</span
        >
      </template>
    </DsfrCheckbox>
    <div class="fr-pl-1v fr-pb-2v fr-text-left">
      <div
        v-for="(detail, key) in filterData.details"
        :key="key"
        class="fr-mb-4v"
        :class="{ 'fr-text--grey': !programFilters[FilterItemKeys.companyData] }"
      >
        <div class="fr-grid-row">
          <div class="fr-col-1">
            <span :class="detail.icon" />
          </div>
          <div class="fr-col-11 fr-pl-md-4v">
            <span class="fr-text--md">{{ detail.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProgramStore } from '@/stores/program'
import { CompanyDataStorageKey, FilterItemKeys, type programFiltersType, SizeToText, StructureSize } from '@/types'
import CompanyDataStorage from '@/utils/storage/companyDataStorage'
import Breakpoint from '@/utils/breakpoints'

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

const programFilters: programFiltersType = useProgramStore().programFilters

const registeredData = CompanyDataStorage.getData()
const hasRegisteredData = CompanyDataStorage.isDataFull()
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
    programFilters[FilterItemKeys.companyData] = value
  },
  { immediate: true }
)
</script>
