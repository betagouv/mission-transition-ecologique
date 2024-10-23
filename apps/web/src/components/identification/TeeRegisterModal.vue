<template>
  <div
    id="register-modal"
    :class="Breakpoint.isMobile() ? 'register-modal-xs' : 'register-modal-sm'"
    class="fr-bg--blue-france fr-pt-2v"
  >
    <div class="fr-container fr-grid-row fr-grid-row--center fr-grid-row--top">
      <div class="fr-col-12 fr-col-justify--right">
        <TeeDsfrButton
          size="sm"
          class="fr-bg--blue-france--lightness fr-p-0 fr-text--blue-france fr-radius-a--2v"
          @click="closeRegisterModal"
        >
          <template #text>
            <span class="fr-icon-close-line fr-icon--lg"></span>
          </template>
        </TeeDsfrButton>
      </div>

      <div class="fr-h1 fr-col-offset-sm-2 fr-col-10 fr-col-justify--left fr-py-md-4v fr-mb-md-2v fr-mb-0 fr-text--yellow">
        {{ Translation.t('register.mainTitle') }}
      </div>
      <div class="fr-text--yellow fr-pb-md-4v fr-pb-2v fr-col-offset-sm-2 fr-col-justify--left fr-pb-8v fr-col-10">
        {{ Translation.t('register.description') }}
      </div>
      <TeeRegisterSiret
        v-if="registerStep === 1"
        @select-establishment="updateEstablishment"
        @manual-register="setManualRegister"
      />
      <TeeProfileDetails
        v-if="registerStep === 2"
        :company="company"
        :company-size="registeredData.structure_size"
        :manual="manualRegistration"
        @modify-siret="resetSiret"
        @close-register="closeRegisterModal"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import Translation from '@/utils/translation'
import { EstablishmentFront } from '@/types'
import Breakpoint from '@/utils/breakpoints'
import CompanyDataStorage from '@/utils/storage/companyDataStorage'

const registeredData = CompanyDataStorage.getData()
console.log(registeredData)
const company = ref<EstablishmentFront | null>(registeredData.value.siret)

const manualRegistration = ref<boolean>(false)

const registerStep = computed<number>(() => {
  if (company.value || manualRegistration.value) {
    return 2
  }
  return 1
})
const emit = defineEmits<{
  closeRegister: []
}>()
const updateEstablishment = (selectedEstablishment: EstablishmentFront) => {
  company.value = selectedEstablishment
  manualRegistration.value = false
}
const resetSiret = () => {
  console.log('resetSiret')
  company.value = null
  manualRegistration.value = false
}

const setManualRegister = () => {
  manualRegistration.value = true
}
const closeRegisterModal = () => {
  emit('closeRegister')
}
</script>
<style lang="scss" scoped>
#register-modal {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  z-index: 1000;
  align-items: flex-start;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: bottom;
}

.register-modal-xs {
  background-image: url('/images/TEE-modal-bottom-mobile.svg');
  height: 100vh;
}

.register-modal-sm {
  background-image: url('/images/TEE-modal-bottom.svg');
  height: calc(100vh - 120px);
  top: 120px;
}
</style>
