<template>
  <div
    id="iframe-siret-container"
    :class="mainStep === 1 ? 'fr-bg--green-agir--light' : 'fr-bg--blue-agir'"
  >
    <TeeCta
      v-if="mainStep === 1"
      svg-height="228"
      button-label="Je teste mon éligibilité"
      @on-click-button="mainStep = 2"
    />
    <div
      v-else
      class="fr-container fr-pt-4w fr-pb-8w"
    >
      <div class="fr-grid-row">
        <div class="fr-col-sm-10 fr-col-md-10 fr-col-lg-9 fr-col-xl-10 fr-col-12">
          <h1 class="fr-h2 fr-text--white fr-mb-2v">Quelle est votre organisation ?</h1>
          <p class="fr-text--white fr-mb-3v">
            Renseignez votre profil pour visualiser les aides éligibles et les projets pertinents pour votre secteur.
          </p>
        </div>
      </div>
      <div class="fr-col-sm-10 fr-col-md-9 fr-col-lg-8 fr-col-xl-7 fr-col-12">
        <TeeRegisterSiret
          v-if="registerStep === 1"
          @select-establishment="updateEstablishment"
          @manual-register="setManualRegister"
        />
      </div>
      <TeeProfileDetails
        v-if="registerStep === 2"
        :company="company"
        :company-size="companySize"
        :manual="manualRegistration"
        from-iframe
        button-label="Je découvre mes aides éligibles"
        @modify-siret="resetSiret"
        @close-register="openNewTab"
      />
      <TeeIllustration
        class="illustration"
        color-primary="#e6fff7"
        height="228"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import Analytics from '@/tools/analytic/analytics'
import { CompanyData } from '@/tools/companyData'
import { MetaRobots } from '@/tools/metaRobots'
import Navigation from '@/tools/navigation'
import { CompanyDataStorageKey, CompanyDataType, EstablishmentFront, RouteName } from '@/types'

definePageMeta({
  layout: 'iframe'
})

if (import.meta.client) {
  const params = new URLSearchParams(window.location.search)
  const parentUrl = params.get('parent_url')
  Analytics.sendEvent('generic_iframe_siret_view', {
    referrer_url: parentUrl
  })
}

const registeredData = CompanyData.dataRef
const company = ref<CompanyDataType[CompanyDataStorageKey.Company]>(registeredData.value[CompanyDataStorageKey.Company])
const companySize = ref<CompanyDataType[CompanyDataStorageKey.Size]>(registeredData.value[CompanyDataStorageKey.Size])
const manualRegistration = ref<boolean>(!!(company.value && !('siret' in company.value)))

const mainStep = ref<number>(1)

const registerStep = computed<number>(() => {
  if (company.value || manualRegistration.value) {
    return 2
  }
  return 1
})

const updateEstablishment = async (selectedEstablishment: EstablishmentFront) => {
  company.value = selectedEstablishment
  if (company.value.structure_size) {
    companySize.value = company.value.structure_size
  }
  manualRegistration.value = false
}

const resetSiret = async () => {
  company.value = null
  companySize.value = null
  manualRegistration.value = false
  useFiltersStore().setCompanyDataSelected(false)
  CompanyData.resetData()
  CompanyData.updateRouteFromStorage()
}

const setManualRegister = () => {
  manualRegistration.value = true
}

const openNewTab = () => {
  CompanyData.updateRouteFromStorage()
  const url = new Navigation().getAbsoluteUrlByRouteName(RouteName.CatalogProjects, {}, useNavigationStore().query)
  if (window.top) {
    window.top.open(url, '_blank')
  } else {
    window.open(url, '_blank')
  }
}

// Initialiser iframe-resizer pour la communication avec le parent
const imageResizerChild = () => import('@iframe-resizer/child')
imageResizerChild()

useHead(MetaRobots.noIndexFollow())
</script>

<style scoped lang="scss">
#iframe-siret-container {
  .illustration :deep(svg) {
    position: absolute;
    bottom: 0;
    right: 0;
    width: auto;
  }
}

:deep(#siret-response) {
  max-height: 92px;
}
</style>
