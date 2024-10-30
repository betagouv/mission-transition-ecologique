<template>
  <div
    ref="registerModal"
    id="register-modal-overlay"
    :class="!Breakpoint.isSmallScreen() ? 'register-modal-overlay-lg' : ''"
  >
    <div
      id="register-modal"
      :class="imgClass"
      class="fr-bg--blue-france fr-px-md-32v fr-px-2v fr-pb-md-24v fr-pb-32v"
    >
      <div class="fr-container fr-grid-row fr-grid-row--left fr-grid-row--top">
        <div class="fr-col-12 fr-col-md-7 fr-col-offset-md-2 fr-col-10 fr-pb-md-4v fr-pt-8v fr-mb-4v fr-text--yellow">
          <div class="fr-h1 fr-mb-0 fr-text--yellow">{{ Translation.t('register.mainTitle') }}</div>
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
      <TeeDsfrButton
        size="sm"
        class="fr-bg--blue-france--lightness fr-mt-8v fr-p-0 fr-text--blue-france fr-radius-a--2v"
        @click="toggleRegisterModal"
      >
        <span class="fr-icon-close-line fr-icon--lg"></span>
      </TeeDsfrButton>
    </div>
  </div>
</template>
<script setup lang="ts">
import Translation from '@/utils/translation'
import { EstablishmentFront } from '@/types'
import Breakpoint from '@/utils/breakpoints'
import CompanyDataStorage from '@/utils/storage/companyDataStorage'
import { CompanyDataStorageKey, CompanyDataType } from '@/types/companyDataType'
import { onClickOutside } from '@vueuse/core'

const registerModal = ref(null)
const registeredData = CompanyDataStorage.getData()
const company = ref<CompanyDataType[CompanyDataStorageKey.Company]>(registeredData.value[CompanyDataStorageKey.Company])
const companySize = ref<CompanyDataType[CompanyDataStorageKey.Size]>(registeredData.value[CompanyDataStorageKey.Size])
const manualRegistration = ref<boolean>(!!(company.value && !('siret' in company.value)))
const toggleRegisterModal = inject<() => void>('toggleRegisterModal')
onClickOutside(registerModal, () => {
  if (toggleRegisterModal) {
    toggleRegisterModal()
  }
})
const registerStep = computed<number>(() => {
  if (company.value || manualRegistration.value) {
    return 2
  }
  return 1
})
const updateEstablishment = (selectedEstablishment: EstablishmentFront) => {
  company.value = selectedEstablishment
  manualRegistration.value = false
}
const resetSiret = () => {
  company.value = null
  companySize.value = null
  manualRegistration.value = false
  CompanyDataStorage.removeItem(CompanyDataStorageKey.Company)
  CompanyDataStorage.removeItem(CompanyDataStorageKey.Size)
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
</script>
<style lang="scss" scoped>
#register-modal-overlay {
  position: fixed;
  inset: 0;
  overflow: hidden scroll;
  z-index: 500;
}

.register-modal-overlay-lg {
  top: 118px !important;
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
  min-height: calc(100vh - 118px);
}
</style>
