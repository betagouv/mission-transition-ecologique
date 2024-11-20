<template>
  <p
    v-if="infos.value"
    class="fr-tag fr-mb-4v fr-bg--blue-france--lightness"
  >
    <span class="fr-pr-4v">{{ localisationLabel }}</span>
    <span
      class="fr-icon-close-line fr-radius-a--2v fr-btn-bg"
      @click="modifyLocalisation"
    />
  </p>
  <div
    v-else
    id="register-localisation"
  >
    <div
      class="fr-input-group fr-mb-0"
      :class="errorMsg ? 'fr-input-group--error' : 'fr-input-group--valid'"
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
          class="fr-input--white fr-input"
          type="search"
          :placeholder="infos.description"
          @update:model-value="updateModelValue"
          @keyup.enter="searchLocalisation"
        />
        <DsfrButton
          class="fr-bg--yellow search-button"
          tertiary
          no-outline
          @click="searchLocalisation"
        />
      </div>
    </div>
    <div
      v-if="localisationResults.length && !infos.value"
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
    <div
      :class="errorMsg ? 'fr-error-text' : ''"
      class="fr-input--empty-text fr-mt-2v"
    >
      {{ errorMsg }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { RegisterDetailLocalisation, ConvertedCommune, CompanyLocalisationType } from '@/types'
import LocalisationApi from '@/service/api/localisationApi'
import { onClickOutside } from '@vueuse/core'
import CompanyDataStorage from '@/utils/storage/companyDataStorage'
import { useDebounce } from '@vueuse/core'

interface Props {
  infos: RegisterDetailLocalisation
  manual: boolean
  showError: boolean
}
const props = defineProps<Props>()
const selectedLocalisation = defineModel<CompanyLocalisationType>()
const localisationInput = ref<string>('')
const debouncedLocalisationInput = useDebounce(localisationInput, 1000)
watch(debouncedLocalisationInput, (newValue) => {
  if (newValue) {
    searchLocalisation()
  }
})
const updateModelValue = (value: string) => {
  localisationInput.value = value
}
const localisationResults = ref<ConvertedCommune[]>([])
const isLoading = ref<boolean>(false)
const localisationApi = new LocalisationApi()
const errorMsg = computed<string>(() => {
  if (props.showError && !debouncedLocalisationInput.value && !isLoading.value) {
    return 'La sélection de la ville est nécessaire.'
  } else if (
    localisationResults.value.length === 0 &&
    debouncedLocalisationInput.value &&
    debouncedLocalisationInput.value.length >= 3 &&
    !isLoading.value
  ) {
    return "Aucune ville n'a été trouvée."
  } else if (debouncedLocalisationInput.value && debouncedLocalisationInput.value.length < 3) {
    return '3 caractères minimums.'
  }
  return ''
})
const localisationSearchBar = ref(null)

const localisationLabel = computed<string>(() => {
  return `${props.infos.value?.codePostal} ${props.infos.value?.ville}`
})
const searchLocalisation = async () => {
  if (localisationInput.value && localisationInput.value.length >= 3) {
    isLoading.value = true
    const results = await localisationApi.searchCities(localisationInput.value)
    if (results.isOk) {
      localisationResults.value = results.value
    }
    isLoading.value = false
  } else {
    localisationResults.value = []
  }
}
const selectLocalisation = (localisation: ConvertedCommune) => {
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
