<template>
  <p
    v-if="infos.value"
    class="fr-tag fr-bg--blue-france--lightness"
  >
    <span class="fr-pr-4v">{{ infos.tagLabel || infos.value }}</span>
    <span
      v-if="manual"
      class="fr-icon-close-line fr-radius-a--2v fr-btn-bg"
      @click="modifyLocalisation"
    />
  </p>
  <DsfrInputGroup
    v-else
    :error-message="showError && !localisationInput ? errorMessage : ''"
  >
    <div
      ref="localisationSearchBar"
      class="fr-search-bar fr-search-bar--yellow"
      role="search"
    >
      <DsfrInput
        v-model="localisationInput"
        name="manual-register-localisation"
        class="fr-input--white"
        type="search"
        :placeholder="infos.description"
        @update:model-value="searchLocalisation"
        @keyup.enter="searchLocalisation"
      />
      <DsfrButton
        class="fr-bg--yellow search-button"
        tertiary
        no-outline
        @click="searchLocalisation"
      />
    </div>
  </DsfrInputGroup>
  <div
    v-if="localisationResults.length && !infos.value"
    id="region-response"
    class="fr-bg--white fr-mt-n6v"
  >
    <div
      v-for="region in localisationResults"
      :key="`resp-input-${region}`"
      class="fr-card fr-card-result fr-card--no-arrow fr-card--shadow"
      tabindex="0"
      @click="selectRegion(region)"
      @keyup.enter="selectRegion(region)"
    >
      <div class="fr-card__body">
        <div class="fr-card__content fr-py-1v fr-px-4v fr-text--blue-france">
          <div class="fr-text--blue-france">{{ region }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { RegisterDetail } from '@/types'
import { Region } from '@/types'
import { onClickOutside } from '@vueuse/core'

interface Props {
  infos: RegisterDetail
  manual: boolean
  showError: boolean
}
defineProps<Props>()
const selectedLocalisation = defineModel<Region>()
const localisationInput = ref<string | undefined>()
const localisationResults = ref<Region[]>([])
const errorMessage = 'La sélection de la localisation est nécessaire'
const localisationSearchBar = ref(null)

const searchLocalisation = () => {
  localisationResults.value = Object.values(Region).filter((region) => region.toLowerCase().includes(localisationInput.value as string))
}
const selectRegion = (region: Region) => {
  selectedLocalisation.value = region
}
const modifyLocalisation = () => {
  selectedLocalisation.value = undefined
  localisationInput.value = undefined
  localisationResults.value = []
}
onClickOutside(localisationSearchBar, () => modifyLocalisation())
</script>
<style lang="scss" scoped>
#region-response {
  text-align: left;
  width: calc(100% - 40px);
  max-height: 128px;
  overflow: hidden auto;
}
</style>
