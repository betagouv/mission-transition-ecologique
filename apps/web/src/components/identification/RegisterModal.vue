<template>
  <div
    id="register-modal"
    class="fr-bg--blue-france"
  >
    <div
      id="register-modal-content"
      class="fr-container fr-mt-8v"
    >
      <div class="fr-grid-row fr-grid-row--center">
        <div class="fr-h1 fr-col-12 fr-col-justify--left fr-py-4v fr-text--yellow">{{ Translation.t('register.mainTitle') }}</div>
        <div class="fr-text--yellow fr-col-justify--left fr-pb-8v fr-col-12">{{ Translation.t('register.description') }}</div>
        <RegisterSiret
          v-if="registerStep === 1"
          @select-establishment="updateEstablishment"
        />
        <RegisterDetailsInfos
          v-if="registerStep === 2 && establishment"
          :company="establishment"
          @modify-siret="registerStep = 1"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Translation from '@/utils/translation'
import { EstablishmentFront } from '@/types'

const establishment = ref<EstablishmentFront | undefined>()
const registerStep = ref<number>(1)
const updateEstablishment = (selectedEstablishment: EstablishmentFront) => {
  establishment.value = selectedEstablishment
  registerStep.value = 2
}
</script>
<style lang="scss" scoped>
#register-modal {
  position: fixed;
  top: 120px;
  left: 0;
  right: 0;
  height: calc(100vh - 120px);
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
#register-modal-content {
  height: 100%;
}
</style>
