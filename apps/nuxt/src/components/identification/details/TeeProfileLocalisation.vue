<template>
  <div id="register-localisation-field">
    <p
      v-if="hasData"
      class="fr-tag fr-mb-4v fr-bg--blue--lightness"
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
        v-if="localisationResults.length && showResults"
        id="localisation-response"
        class="fr-bg--white"
      >
        <div
          v-for="localisation in localisationResults"
          :key="`resp-input-${localisation.nom}-${localisation.codePostal}`"
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
  </div>
</template>
<script lang="ts" setup>
import { RegisterDetailLocalisation, ConvertedCommune, CompanyLocalisationType } from '@/types'
import LocalisationApi from '@/tools/api/localisationApi'
import { onClickOutside, useDebounce } from '@vueuse/core'
import { CompanyData } from '@/tools/companyData'
import Translation from '@/tools/translation'

interface Props {
  infos: RegisterDetailLocalisation
  manual: boolean
  showError: boolean
}
const props = defineProps<Props>()
const selectedLocalisation = defineModel<CompanyLocalisationType>()
const localisationInput = ref<string>('')
const debouncedLocalisationInput = useDebounce(localisationInput, 1000)
const hasData = computed(() => {
  return props.infos.value?.codePostal && props.infos.value.region && props.infos.value.ville
})
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
const showResults = ref<boolean>(false)
const hasInput = computed<boolean>(() => debouncedLocalisationInput.value.length >= 3 && !!debouncedLocalisationInput.value)
const noResults = computed<boolean>(() => localisationResults.value.length === 0 && hasInput.value && showResults.value && !isLoading.value)
const errorMsg = computed<string>(() => {
  if (props.showError) {
    return Translation.t('register.localisation.mandatory')
  } else if (noResults.value) {
    return Translation.t('register.localisation.noResults')
  } else if (!hasInput.value && debouncedLocalisationInput.value.length > 0) {
    return Translation.t('register.localisation.tooShort')
  }
  return ''
})
const localisationSearchBar = ref(null)

const localisationLabel = computed<string>(() => {
  return `${props.infos.value?.codePostal} ${props.infos.value?.ville}`
})
const searchLocalisation = async () => {
  showResults.value = true
  if (localisationInput.value && localisationInput.value.length >= 3) {
    isLoading.value = true
    const results = await new LocalisationApi().searchCities(localisationInput.value)
    if (results.isOk()) {
      localisationResults.value = results.data
    }
    isLoading.value = false
  } else {
    localisationResults.value = []
  }
}
const selectLocalisation = (localisation: ConvertedCommune) => {
  selectedLocalisation.value = CompanyData.convertLocalisation(localisation)
}
const modifyLocalisation = () => {
  selectedLocalisation.value = undefined
  localisationInput.value = ''
  localisationResults.value = []
  showResults.value = false
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

#register-localisation-field {
  height: 70px;
}
</style>
