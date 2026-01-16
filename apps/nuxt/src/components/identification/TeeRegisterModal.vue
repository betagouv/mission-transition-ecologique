<template>
  <div
    id="register-modal-overlay"
    ref="registerModal"
    :class="!Breakpoint.isSmallScreen() ? 'register-modal-overlay-lg' : ''"
  >
    <div
      id="register-modal"
      class="fr-bg--blue-agir"
    >
      <div
        id="register-modal-content"
        class="fr-container"
      >
        <div class="fr-grid-row fr-grid-row--left fr-grid-row--top">
          <div class="fr-col-11 fr-col-md-9 fr-col-offset-md-2">
            <div class="fr-col-12 fr-pb-md-1v fr-pt-7v">
              <div class="fr-h2 fr-mb-0 fr-text--white">{{ title }}</div>
            </div>
          </div>
          <div class="fr-col-1 fr-text-right fr-pt-7v">
            <TeeDsfrButton
              id="close-register-modal"
              size="sm"
              only-label="fermer la modale d'enregistrement"
              class="fr-btn-bg--blue--light fr-bg--blue--lightness fr-p-0 fr-text--blue-900 fr-radius-a--2v"
              @click="closeModal"
            >
              <span class="fr-icon-close-line fr-icon--lg"></span>
            </TeeDsfrButton>
          </div>
        </div>
        <div class="fr-col-12 fr-col-md-9 fr-col-offset-md-2">
          <div class="fr-pb-4v fr-text--white">
            <div>{{ description }}</div>
          </div>
          <TeeRegisterSiret
            v-if="registerStep === 1"
            class="fr-col-12 fr-col-md-9"
            @select-establishment="updateEstablishment"
            @manual-register="setManualRegister"
          />
          <TeeProfileDetails
            v-if="registerStep === 2"
            :company="company"
            :company-size="companySize"
            :manual="manualRegistration"
            @modify-siret="resetSiret"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useFiltersStore } from '@/stores/filters'
import Navigation from '@/tools/navigation'
import { ProgramManager } from '@/tools/program/programManager'
import { ProjectManager } from '@/tools/project/projectManager'
import Translation from '@/tools/translation'
import { EstablishmentFront, CompanyDataStorageKey, CompanyDataType } from '@/types'
import Breakpoint from '@/tools/breakpoints'
import { onClickOutside } from '@vueuse/core'
import { useNavigationStore } from '@/stores/navigation'
import { CompanyData } from '@/tools/companyData'
import UsedTrack from '@/tools/questionnaire/track/usedTrack'

const navigationStore = useNavigationStore()
const registerModal = ref(null)
const registeredData = CompanyData.dataRef
const company = ref<CompanyDataType[CompanyDataStorageKey.Company]>(registeredData.value[CompanyDataStorageKey.Company])
const companySize = ref<CompanyDataType[CompanyDataStorageKey.Size]>(registeredData.value[CompanyDataStorageKey.Size])
const manualRegistration = ref<boolean>(!!(company.value && !('siret' in company.value)))
if (import.meta.client) {
  window.addEventListener('popstate', () => {
    if (navigationStore.hasRegisterModal) {
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      })
    }
  })
}

const title = computed<string>(() => {
  return Translation.t(navigationStore.isFromQuestionnaireCtaRegisterModal ? 'register.trackTitle' : 'register.mainTitle')
})

const description = computed<string>(() => {
  return Translation.t(navigationStore.isFromQuestionnaireCtaRegisterModal ? 'register.trackDescription' : 'register.description')
})

onClickOutside(registerModal, (ev: MouseEvent) => {
  const target = ev.target as HTMLInputElement
  if (target && !target.classList.contains('ignore-modal-click')) {
    Navigation.toggleRegisterModal(false)
  }
})

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
  await UsedTrack.updateQuestionnaireStep()
  await new ProjectManager().update()
  await new ProgramManager().update()
}

const setManualRegister = () => {
  manualRegistration.value = true
}

const closeModal = () => {
  Navigation.toggleRegisterModal(false)
}
</script>
