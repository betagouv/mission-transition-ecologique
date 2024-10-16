<template>
  <div class="fr-col-12">
    <h4 class="fr-mb-0 fr-col-justify--left fr-py-2v fr-text--white">Quelle est votre entreprise ?</h4>
    <RegisterSiretBar
      v-model.trim="queryValue"
      :is-loading="isLoading"
      :error-message="errorMessage"
      @on-click="processInput"
      @on-clear="resetSelection"
    />

    <!-- RESPONSES -->
    <div
      id="siret-response"
      class="fr-bg--white fr-mt-n6v"
    >
      <div v-if="requestResponses.establishments.length">
        <div
          v-for="(response, i) in requestResponses.establishments"
          :key="`resp-input-${i}`"
          class="fr-card fr-card-result fr-card--no-arrow fr-card--shadow custom-border"
          @click="selectItem(response)"
        >
          <div class="fr-card__body">
            <div class="fr-card__content fr-py-2v fr-px-4v fr-text--blue-france">
              <div class="fr-card__title">
                <div class="fr-text--blue-france">
                  {{ response.denomination || 'Entreprise individuelle' }}
                  <span> - {{ response.siret }} </span>
                </div>
              </div>
              <div class="fr-card__desc fr-pl-2v">
                <div>
                  <span
                    class="fr-icon-briefcase-line fr-mr-8v"
                    aria-hidden="true"
                  />
                  <span>{{ response.secteur || 'Non Renseigné' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- WILDCARD -->
    <p class="fr-text--sm fr-col-justify--left fr-text--white">
      {{ Translation.t('or') }}
      <a
        class="fr-link fr-text--white fr-pl-1v fr-text--underline fr-text--sm"
        :href="Navigation.hashByRouteName(RouteName.Questionnaire)"
      >
        je complète les informations manuellement
      </a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { RouteName } from '@/types/routeType'
import Navigation from '@/utils/navigation'
import TrackSiret from '@/utils/track/TrackSiret'
import Translation from '@/utils/translation'
import { SiretValidator } from '@tee/common'
import { EstablishmentSearch, EstablishmentFront } from '@/types'

const defaultSearchValue = {
  establishments: [],
  resultCount: -1
}

const queryValue = ref<string>()
const isLoading = ref<boolean>(false)
const requestResponses = ref<EstablishmentSearch>(defaultSearchValue)
const selection = ref<EstablishmentFront>()
const errorMessage = ref<string>()

const emit = defineEmits<{
  selectEstablishment: [EstablishmentFront]
}>()

const resetSelection = () => {
  requestResponses.value = defaultSearchValue
  selection.value = undefined
}

const selectItem = (establishment: EstablishmentFront) => {
  selection.value = establishment
  console.log(selection.value)
  emit('selectEstablishment', selection.value)
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
  width: calc(100% - 40px);
  max-height: 250px;
  overflow-x: hidden;
  overflow-y: scroll;
}
</style>
