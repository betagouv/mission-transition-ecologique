<template>
  <div
    class="fr-col-12 fr-col-md-7 fr-col-offset-md-2"
    style="position: relative"
  >
    <h4 class="fr-mb-0 fr-py-2v fr-text--white">Quelle est votre entreprise ?</h4>
    <TeeRegisterSiretBar
      v-model.trim="queryValue"
      :is-loading="isLoading"
      :error-message="errorMessage"
      @update:model-value="handleUpdateModelValue"
      @on-click="processInput"
      @on-clear="resetSelection"
    />

    <!-- RESPONSES -->
    <div
      v-if="requestResponses.establishments.length"
      id="siret-response"
      class="fr-bg--white fr-mt-n6v"
    >
      <div
        v-for="(response, i) in requestResponses.establishments"
        :key="`resp-input-${i}`"
        class="fr-card fr-card-result fr-card--no-arrow fr-card--shadow custom-border"
        @click="selectItem(response)"
      >
        <div class="fr-card__body">
          <div class="fr-card__content fr-py-1v fr-px-4v fr-text--blue-france">
            <div class="fr-text--blue-france">
              <div class="fr-text--bold">{{ response.denomination || 'Entreprise individuelle' }}</div>
              SIRET {{ response.siret }}
            </div>
            <div class="fr-card__desc fr-mt-1v">
              <span
                class="fr-icon-briefcase-line fr-icon--lg fr-mr-2v"
                aria-hidden="true"
              />
              <span>{{ response.secteur || 'Non Renseigné' }}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="requestResponses.resultCount > 9"
        class="fr-card fr-card-result fr-card--no-arrow fr-card--shadow custom-border"
      >
        <div class="fr-card__body">
          <div class="fr-mb-0 fr-py-1v fr-px-4v fr-text--blue-france fr-text--sm">
            <span>Votre entreprise n'est pas affichée ?</span>
            <a
              href="https://annuaire-entreprises.data.gouv.fr/"
              class="no-outline fr-text--underline"
              target="_blank"
            >
              Cliquez ici
            </a>
          </div>
        </div>
      </div>
    </div>
    <div :class="requestResponses.establishments.length ? '' : 'fr-mt-n6v'">
      <TeeDsfrButton
        class="fr-btn--tertiary-no-outline fr-p-0 fr-btn-bg fr-text--white fr-text--sm"
        @click="doManualRegister"
      >
        {{ Translation.t('or') }}
        <span class="fr-text--underline">je complète les informations manuellement</span>
      </TeeDsfrButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import TrackSiret from '@/utils/track/TrackSiret'
import Translation from '@/utils/translation'
import { SiretValidator } from '@tee/common'
import { EstablishmentSearch, EstablishmentFront } from '@/types'
import { useDebounce } from '@vueuse/core'

const defaultSearchValue = {
  establishments: [],
  resultCount: -1
}

const queryValue = ref<string | undefined>()
const debouncedQueryValue = useDebounce(queryValue, 1000)
watch(debouncedQueryValue, (newValue) => {
  if (newValue) {
    processInput()
  }
})
const isLoading = ref<boolean>(false)
const requestResponses = ref<EstablishmentSearch>(defaultSearchValue)
const selection = ref<EstablishmentFront>()
const errorMessage = ref<string>()

const emit = defineEmits<{
  selectEstablishment: [EstablishmentFront]
  manualRegister: []
}>()

const resetSelection = () => {
  requestResponses.value = defaultSearchValue
  selection.value = undefined
}

const selectItem = (establishment: EstablishmentFront) => {
  selection.value = establishment
  emit('selectEstablishment', selection.value)
}

const doManualRegister = () => {
  emit('manualRegister')
}
const handleUpdateModelValue = (value: string | undefined) => {
  queryValue.value = value
}
const processInput = async () => {
  isLoading.value = true
  errorMessage.value = undefined
  resetSelection()

  if (!queryValue.value || queryValue.value.length < 3) {
    errorMessage.value = Translation.t('enterprise.searchTooShort')
  } else if (SiretValidator.isValidSiretFormat(queryValue.value) && !SiretValidator.isValidSiretNumber(queryValue.value)) {
    errorMessage.value = "Le numéro SIRET n'est pas valide"
  } else {
    const searchResult = await TrackSiret.search(queryValue.value)
    if (searchResult.isErr) {
      errorMessage.value = Translation.t('enterprise.apiError')
    } else if (searchResult.value.resultCount == 0) {
      errorMessage.value = Translation.t('enterprise.noStructureFound')
    } else {
      requestResponses.value = searchResult.value
      selection.value = undefined
    }
  }
  isLoading.value = false
}
</script>

<style lang="scss" scoped>
.custom-border {
  border: solid thin #c4c4c4;
}

#siret-response {
  text-align: left;
  max-height: calc(100vh - 600px);
  position: absolute;
  min-height: 20vh;
  overflow: hidden auto;
  width: calc(100% - 40px);
}
</style>
