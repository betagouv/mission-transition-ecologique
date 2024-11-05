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
        class="fr-input-sm"
        name="manual-register-localisation"
        type="search"
        :placeholder="infos.description"
        @update:model-value="updateSearchValue"
        @keyup.enter="searchLocalisation"
      />
      <DsfrButton
        class="fr-bg--yellow search-button"
        :class="isLoading ? 'fr-search-bar--loading' : ''"
        tertiary
        no-outline
        @click="searchLocalisation"
      />
    </div>
  </DsfrInputGroup>
  <div
    v-if="localisationResults.length && !infos.value"
    id="localisation-response"
    class="fr-bg--white fr-mt-n6v"
  >
    <div
      v-for="localisation in localisationResults"
      :key="`resp-input-${localisation}`"
      class="fr-card fr-card-result fr-card--no-arrow fr-card--shadow"
      @click="selectLocalisation(localisation)"
    >
      <div class="fr-card__body">
        <div class="fr-card__content fr-py-1v fr-px-4v fr-text--blue-france">
          <div class="fr-text--blue-france">{{ `${localisation.nom}( ${localisation.codesPostaux.join()} ) ` }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { RegisterDetail } from '@/types'
import { Region } from '@/types'
import LocalisationApi from '@/service/api/localisationApi'
import { useDebounce } from '@vueuse/core'

interface Props {
  infos: RegisterDetail
  manual: boolean
  showError: boolean
}
defineProps<Props>()
const selectedLocalisation = defineModel<Region>()
const localisationInput = ref<string | undefined>()
const localisationResults = ref<{ nom: string; codesPostaux: string[] }[]>([])
const isLoading = ref<boolean>(false)
const localisationApi = new LocalisationApi()
const errorMessage = 'La sélection de la localisation est nécessaire'
const debouncedRegionInput = useDebounce(localisationInput, 500)
watch(debouncedRegionInput, (newValue) => {
  if (newValue) {
    searchLocalisation()
  }
})
const searchLocalisation = async () => {
  if (localisationInput.value) {
    isLoading.value = true
    localisationResults.value = await localisationApi.fetchCommunes(localisationInput.value)
    isLoading.value = false
  }
}
const updateSearchValue = (value: string | undefined) => {
  localisationInput.value = value
}
const selectLocalisation = (localisation:{ nom: string; codesPostaux: string[] }) => {
  selectedLocalisation.value = localisation
}
const modifyLocalisation = () => {
  selectedLocalisation.value = undefined
  localisationInput.value = undefined
  localisationResults.value = []
}
</script>
<style lang="scss" scoped>
#localisation-response {
  text-align: left;
  width: calc(100% - 40px);
  max-height: 128px;
  overflow: hidden auto;
}
</style>
