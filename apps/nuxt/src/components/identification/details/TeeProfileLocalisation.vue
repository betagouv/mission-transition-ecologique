<template>
  <p
    v-if="hasData"
    class="fr-tag fr-mb-4v fr-bg--blue--lightness"
  >
    <span class="fr-pr-4v">{{ localisationLabel }}</span>
    <span
      class="fr-icon-close-line fr-radius-a--2v fr-btn-bg"
      @click="resetLocalisation"
    />
  </p>
  <TeeDsfrSearchBar
    v-else
    v-model.trim="localisationInput"
    :color="Color.yellow"
    :placeholder="infos.description"
    :is-loading="isLoading"
    name="localisation"
    :error-msg="errorMsg"
    :results="localisationResults"
    @reset-search="resetLocalisation"
    @search="searchLocalisation"
  >
    <template #results>
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
    </template>
  </TeeDsfrSearchBar>
</template>
<script lang="ts" setup>
import { RegisterDetailLocalisation, ConvertedCommune, CompanyLocalisationType, Color } from '@/types'
import LocalisationApi from '@/tools/api/localisationApi'
import { CompanyData } from '@/tools/companyData'
import Translation from '@/tools/translation'
import TeeDsfrSearchBar from '@/components/element/TeeDsfrSearchBar.vue'

interface Props {
  infos: RegisterDetailLocalisation
  manual: boolean
  showError: boolean
}
const props = defineProps<Props>()
const selectedLocalisation = defineModel<CompanyLocalisationType>()
const localisationInput = ref<string>('')
const hasData = computed(() => {
  return props.infos.value?.codePostal && props.infos.value.region && props.infos.value.ville
})

const localisationResults = ref<ConvertedCommune[]>([])
const isLoading = ref<boolean>(false)
const showResults = ref<boolean>(false)
const hasInput = computed<boolean>(() => localisationInput.value.length >= 3 && !!localisationInput.value)
const noResults = computed<boolean>(() => localisationResults.value.length === 0 && hasInput.value && showResults.value && !isLoading.value)
const errorMsg = computed<string>(() => {
  if (props.showError) {
    return Translation.t('register.localisation.mandatory')
  } else if (noResults.value) {
    return Translation.t('register.localisation.noResults')
  } else if (!hasInput.value && localisationInput.value.length > 0) {
    return Translation.t('register.localisation.tooShort')
  }
  return ''
})

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
const resetLocalisation = () => {
  selectedLocalisation.value = undefined
  localisationInput.value = ''
  localisationResults.value = []
  showResults.value = false
}
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
</style>
