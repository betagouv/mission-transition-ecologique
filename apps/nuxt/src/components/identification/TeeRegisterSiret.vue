<template>
  <div
    id="register-siret"
    class="fr-col-12 fr-col-md-7 fr-col-offset-md-2"
  >
    <h4 class="fr-mb-0 fr-py-2v fr-text--white">Quelle est votre entreprise ?</h4>
    <TeeDsfrSearchBar
      v-model.trim="queryValue"
      :color="Color.yellow"
      :is-loading="isLoading"
      name="siret"
      :error-msg="errorMessage"
      :hint="hint"
      :results="requestResponses.establishments"
      @reset-search="clearSearch"
      @search="processInput"
    >
      <template #results>
        <!-- RESPONSES -->
        <div
          id="siret-response"
          class="fr-bg--white"
        >
          <div
            v-for="(response, i) in requestResponses.establishments"
            :key="`resp-input-${i}`"
            class="fr-card fr-card-result fr-card--no-arrow fr-card--shadow custom-border"
            tabindex="0"
            @click="selectItem(response)"
            @keydown.enter="selectItem(response)"
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
            <div class="fr-card__body fr-p-0">
              <div class="fr-mb-0 fr-py-1v fr-px-4v fr-text--blue-france fr-text--sm">
                <span>Votre entreprise n'est pas affichée ?</span>
                <a
                  href="https://annuaire-entreprises.data.gouv.fr/"
                  class="no-outline fr-text--decoration-underline"
                  target="_blank"
                >
                  trouver mon SIRET
                </a>
              </div>
            </div>
          </div>
        </div>
      </template>
    </TeeDsfrSearchBar>
    <div :class="requestResponses.establishments.length ? '' : 'fr-mt-n6v'">
      <TeeDsfrButton
        class="fr-btn--tertiary-no-outline fr-text-left fr-p-0 fr-btn-bg fr-text--white fr-text--sm"
        @click="doManualRegister"
      >
        {{ Translation.t('or') }}
        <span class="fr-text--decoration-underline">je complète les informations manuellement</span>
      </TeeDsfrButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import Translation from '@/tools/translation'
import { EstablishmentSearch, EstablishmentFront, Color } from '@/types'
import { useDebounce } from '@vueuse/core'
import Siret from '@/tools/siret'

const defaultSearchValue = {
  establishments: [],
  resultCount: -1
}

const queryValue = ref<string | undefined>()
const hint = `ex : "Fromagerie Sanzot Angers" ou N° SIRET "130 025 265 00013"`
const debouncedQueryValue = useDebounce(queryValue, 2000)
watch(debouncedQueryValue, (newValue, oldValue) => {
  if (newValue && newValue !== oldValue && !isLoading.value) {
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
  selection.value = undefined
}
const clearSearch = () => {
  resetSelection()
  isLoading.value = false
  requestResponses.value = defaultSearchValue
}

const selectItem = (establishment: EstablishmentFront) => {
  selection.value = establishment
  emit('selectEstablishment', selection.value)
}

const doManualRegister = () => {
  emit('manualRegister')
}
const processInput = async () => {
  isLoading.value = true
  errorMessage.value = undefined
  resetSelection()
  Siret.processInput(queryValue.value, 9).then((response) => {
    if ((response as { error: boolean; errorMsg: string }).error) {
      errorMessage.value = (response as { error: boolean; errorMsg: string }).errorMsg
      clearSearch()
    } else {
      requestResponses.value = response as EstablishmentSearch
      selection.value = undefined
    }
    isLoading.value = false
  })
  resetSelection()
}
</script>

<style lang="scss" scoped>
@use '@/assets/scss/setting';

.custom-border {
  border: solid thin rgba(setting.$grey, 0.2);
}

#siret-response {
  text-align: left;
  max-height: calc(100vh - 450px);
  position: absolute;
  overflow: hidden auto;
  width: calc(100% - 40px);
}
</style>
