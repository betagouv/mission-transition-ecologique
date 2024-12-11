<template>
  <div
    class="fr-py-2v"
    :class="{ 'fr-bg--green--lightness': programFilters[FilterItemKeys.companyData] }"
  >
    <DsfrCheckbox
      v-model="programFilters[FilterItemKeys.companyData]"
      :value="`selected-company-${companyName}`"
      small
      name="companyFilter"
    >
      <template #label>
        <span class="fr-text--bold">{{ filterData.title }}</span>
      </template>
    </DsfrCheckbox>
    <div class="fr-pl-1v fr-pb-2v fr-text-left">
      <div
        v-for="(detail, key) in filterData.details"
        :key="key"
        :class="{ 'fr-text--grey': !programFilters[FilterItemKeys.companyData] }"
      >
        <div :class="detail.icon">
          <span class="fr-pl-1v">{{ detail.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProgramStore } from '@/stores/program'
import { CompanyDataStorageKey, FilterItemKeys, type programFiltersType } from '@/types'
import CompanyDataStorage from '@/utils/storage/companyDataStorage'

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
const companySize = computed(() => registeredData.value[CompanyDataStorageKey.Size])

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
