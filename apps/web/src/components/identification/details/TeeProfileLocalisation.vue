<template>
  <p
    v-if="infos.value"
    class="fr-tag fr-bg--blue-france--lightness"
  >
    {{ infos.tagLabel || infos.value }}
    <span
      v-if="manual"
      class="fr-icon-close-line"
      @click="modifyLocalisation"
    />
  </p>
  <DsfrInputGroup
    v-else
    :error-message="showError && !localisationInput ? errorMessage : ''"
  >
    <div
      class="fr-search-bar fr-search-bar--yellow"
      role="search"
    >
      <DsfrInput
        v-model="localisationInput"
        name="manual-register-localisation"
        type="search"
        :placeholder="infos.description"
        @update:model-value="updateSearchValue"
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
      @click="selectRegion(region)"
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
import { useDebounce } from '@vueuse/core'

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
const debouncedRegionInput = useDebounce(localisationInput, 500)
watch(debouncedRegionInput, (newValue) => {
  if (newValue) {
    searchLocalisation()
  }
})
const searchLocalisation = () => {
  localisationResults.value = Object.values(Region).filter((region) => region.toLowerCase().includes(localisationInput.value as string))
}
const updateSearchValue = (value: string | undefined) => {
  localisationInput.value = value
}
const selectRegion = (region: Region) => {
  selectedLocalisation.value = region
}
const modifyLocalisation = () => {
  selectedLocalisation.value = undefined
  localisationInput.value = undefined
  localisationResults.value = []
}
</script>
<style lang="scss" scoped>
#region-response {
  text-align: left;
  width: calc(100% - 40px);
  max-height: 128px;
  overflow: hidden auto;
}
</style>
