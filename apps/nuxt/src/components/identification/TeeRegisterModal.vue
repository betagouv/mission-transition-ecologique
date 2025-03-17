<template>
  <div
    id="register-modal-overlay"
    ref="registerModal"
    :class="!Breakpoint.isSmallScreen() ? 'register-modal-overlay-lg' : ''"
  >
    <div
      id="register-modal"
      :class="imgClass"
      class="fr-bg--blue-france fr-px-md-32v fr-px-2v fr-pb-md-24v fr-pb-32v"
    >
      <div
        id="register-modal-content"
        class="fr-container fr-grid-row fr-grid-row--left fr-grid-row--top"
      >
        <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2 fr-pb-md-1v fr-pt-7v fr-text--yellow">
          <div>
            <div class="fr-h2 fr-mb-0 fr-text--yellow">{{ Translation.t('register.mainTitle') }}</div>
            <TeeDsfrButton
              id="close-register-modal"
              size="sm"
              class="fr-btn-bg--blue--light fr-bg--blue--lightness fr-mr-4v fr-mt-8v fr-p-0 fr-text--blue-france fr-radius-a--2v"
              @click="closeModal"
            >
              <span class="fr-icon-close-line fr-icon--lg"></span>
            </TeeDsfrButton>
          </div>
          <div>{{ Translation.t('register.description') }}</div>
        </div>
        <TeeRegisterSiret
          v-if="registerStep === 1"
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
</template>
<script setup lang="ts">
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

const registerModal = ref(null)
const registeredData = CompanyData.dataRef
const company = ref<CompanyDataType[CompanyDataStorageKey.Company]>(registeredData.value[CompanyDataStorageKey.Company])
const companySize = ref<CompanyDataType[CompanyDataStorageKey.Size]>(registeredData.value[CompanyDataStorageKey.Size])
const manualRegistration = ref<boolean>(!!(company.value && !('siret' in company.value)))
if (import.meta.client) {
  window.addEventListener('popstate', () => {
    const navigationStore = useNavigationStore()
    if (navigationStore.hasRegisterModal) {
      window.scrollTo({
        top: 0,
        behavior: 'instant'
      })
    }
  })
}

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

const imgClass = computed<string>(() => {
  if (Breakpoint.isSmallScreen()) {
    return `register-modal-sm ${Breakpoint.isMobile() ? 'mobile-modal-img' : ''} `
  }
  return 'register-modal-lg'
})

const setManualRegister = () => {
  manualRegistration.value = true
}

const closeModal = () => {
  Navigation.toggleRegisterModal(false)
}
</script>
<style lang="scss" scoped>
#register-modal-content {
  position: relative;
}

#close-register-modal {
  position: absolute;
  right: 0;
  top: 0;
}

#register-modal-overlay {
  position: fixed;
  inset: 0;
  overflow: hidden scroll;
  z-index: 2000;
}

.register-modal-overlay-lg {
  top: var(--header-height) !important;
}

#register-modal {
  display: flex;
  align-items: flex-start;
  background-repeat: no-repeat;
  background-position: bottom;
  background-attachment: scroll;
  background-size: 100%;
}

.register-modal-sm {
  background-image: url('/images/TEE-modal-bottom.svg');
  min-height: 100vh;
}

.mobile-modal-img {
  background-image: url('/images/TEE-modal-bottom-mobile.svg');
}

.register-modal-lg {
  background-image: url('/images/TEE-modal-bottom.svg');
  height: calc(100vh - var(--header-height));
}
</style>
