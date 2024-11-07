<template>
  <p
    v-if="infos.value"
    class="fr-tag fr-bg--blue-france--lightness"
  >
    {{ localisationLabel }}
    <span
      v-if="manual"
      class="fr-icon-close-line fr-pl-4v"
      @click="modifyLocalisation"
    />
  </p>
  <div
    v-else
    id="register-localisation"
  >
    <div
      ref="localisationSearchBar"
      class="fr-search-bar fr-search-bar--yellow"
      :class="isLoading ? 'fr-search-bar--loading' : ''"
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
    <div
      v-if="localisationResults.length && !infos.value && !isLoading"
      id="localisation-response"
      class="fr-bg--white"
    >
      <div
        v-for="localisation in localisationResults"
        :key="`resp-input-${localisation}`"
        class="fr-card fr-card-result fr-card--no-arrow fr-card--shadow"
        @click="selectLocalisation(localisation)"
      >
        <div class="fr-card__body">
          <div class="fr-card__content fr-py-1v fr-px-4v fr-text--blue-france">
            <div class="fr-text--blue-france">{{ `${localisation.nom} (${localisation.codePostal}) ` }}</div>
          </div>
        </div>
      </div>
    </div>
    <p :class="errorMsg ? 'fr-error-text' : ''">
      {{ errorMsg }}
    </p>
  </div>
</template>
<script lang="ts" setup>
import { RegisterDetailLocalisation, ConvertedGeoResult, CompanyLocalisationType } from '@/types'
import LocalisationApi from '@/service/api/localisationApi'
import { onClickOutside } from '@vueuse/core'
import CompanyDataStorage from '@/utils/storage/companyDataStorage'

interface Props {
  infos: RegisterDetailLocalisation
  manual: boolean
  showError: boolean
}
const props = defineProps<Props>()
const selectedLocalisation = defineModel<CompanyLocalisationType>()
const localisationInput = ref<string>('')
const localisationResults = ref<ConvertedGeoResult[]>([])
const isLoading = ref<boolean>(false)
const localisationApi = new LocalisationApi()
const errorMsg = computed<string>(() => {
  if (props.showError && !localisationInput.value && !isLoading.value) {
    return 'La sélection de la ville est nécessaire.'
  } else if (localisationResults.value.length === 0 && localisationInput.value && !isLoading.value) {
    return "Aucune ville n'a été trouvée."
  }
  return ''
})
const localisationSearchBar = ref(null)

const localisationLabel = computed<string>(() => {
  if (props.infos.tagLabel) {
    return props.infos.tagLabel
  }
  return `${props.infos.value?.codePostal} ${props.infos.value?.ville}`
})
const searchLocalisation = async () => {
  isLoading.value = true
  localisationResults.value = await localisationApi.fetchCommunes(localisationInput.value)
  isLoading.value = false
}
const selectLocalisation = (localisation: ConvertedGeoResult) => {
  selectedLocalisation.value = CompanyDataStorage.convertLocalisation(localisation)
}
const modifyLocalisation = () => {
  selectedLocalisation.value = undefined
  localisationInput.value = ''
  localisationResults.value = []
}
onClickOutside(localisationSearchBar, () => modifyLocalisation())
</script>
<style lang="scss" scoped>
#localisation-response {
  text-align: left;
  width: calc(100% - 40px);
  max-height: 128px;
  z-index: 2000;
  position: absolute;
  overflow: hidden auto;
}

#register-localisation {
  position: relative;
  margin-bottom: 0;
}
</style>
