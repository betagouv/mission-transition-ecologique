<template>
  <div
    id="company-data-filter-content"
    class="fr-pt-2v fr-pb-0-5v"
    :class="{
      'fr-bg--green--lightness': isCompanyDataSelected,
      'fr-bg--grey--lightness': !isCompanyDataSelected
    }"
  >
    <DsfrCheckbox
      v-model="isCompanyDataSelected"
      :value="`selected-company-${companyName}`"
      small
      name="companyFilter"
      :disabled="navigation.isQuestionnaireResult()"
    >
      <template #label>
        <span
          class="fr-text--bold fr-text--sm"
          :class="{
            'fr-text--grey': !isCompanyDataSelected,
            'fr-text--black': navigation.isQuestionnaireResult(),
            'fr-pl-0-5v fr-pl-2v fr-text-left fr-mb-1v': Breakpoint.isMobile()
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
        :class="{ 'fr-text--grey': !isCompanyDataSelected }"
      >
        <div class="fr-grid-row">
          <div class="fr-col-hidden-lg">
            <div class="fr-col-12">
              <div
                class="company-filter-icon fr-pl-1v"
                :class="detail.icon"
              >
                <span
                  class="fr-pl-2v"
                  :class="{ 'fr-pl-4v': Breakpoint.isMobile() }"
                >
                  {{ detail.label }}
                </span>
              </div>
            </div>
          </div>
          <div class="fr-hidden fr-unhidden-lg">
            <div class="fr-col-1 fr-mr-3v fr-col-content--top fr-pt-1v fr-pl-1v fr-pr-3v">
              <div
                class="company-filter-icon-large"
                :class="detail.icon"
              />
            </div>
            <div class="fr-col-9 fr-text-left">
              <span class="fr-text--xs">
                {{ detail.label }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CompanyDataStorageKey, SizeToText, StructureSize } from '@/types'
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
const isCompanyDataSelected = useFiltersStore().getCompanyDataSelected()

const registeredData = CompanyData.dataRef
const hasRegisteredData = CompanyData.isDataFull()
const companyName = computed(() => registeredData.value[CompanyDataStorageKey.Company]?.denomination)
const companySector = computed(() => registeredData.value[CompanyDataStorageKey.Company]?.secteur)
const companyRegion = computed(() => registeredData.value[CompanyDataStorageKey.Company]?.region)
const companySize = computed(() => SizeToText[registeredData.value[CompanyDataStorageKey.Size] as StructureSize]?.title)

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
    useFiltersStore().setCompanyDataSelected(value)
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

.company-filter-icon {
  &::before {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    vertical-align: top;
    position: relative;
    top: 0.3rem;
  }

  &-large::before {
    display: block;
    width: 1rem;
    height: 1rem;
  }
}
</style>
