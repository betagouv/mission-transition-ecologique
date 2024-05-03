<template>
  <TeeDsfrSearchBar
    v-model.trim="queryValue"
    :option="props.option"
    :is-loading="isLoading"
    :error-message="errorMessage"
    :has-hint="hasHint"
    @on-click="processInput"
    @on-clear="resetSelection"
  />

  <!-- RESPONSES -->
  <div
    v-show="selection >= 0 && requestResponses.length > 1"
    class="fr-mt-n2w"
  >
    <span class="result-number">X résultats trouvés</span>
    <h6 class="fr-mt-3v">Sélectionnez votre entreprise:</h6>
  </div>
  <div
    v-if="requestResponses.length"
    class="fr-mt-n2w"
  >
    <div
      v-for="(response, i) in requestResponses"
      :key="`resp-input-${i}`"
      class="fr-card fr-card-result fr-card--no-arrow fr-mb-4v fr-card--shadow custom-border"
      :class="{ 'is-selected': isSelected(i) }"
      @click="selectItem(i)"
    >
      <div class="fr-card__body">
        <div class="fr-card__content fr-py-2v fr-px-4v">
          <div
            class="fr-card__title"
            :class="{ 'is-title-selected': isSelected(i) }"
          >
            {{ response.name || 'Entreprise individuelle' }}
            <span class="thiner-text">- SIRET {{ response.siret }}</span>
          </div>
          <div class="fr-card__desc">
            <div>
              <span
                class="fr-icon-briefcase-line fr-mr-8v"
                aria-hidden="true"
              >
              </span>
              <span class="fr-mr-3v">Secteur d'activité : {{ response.sector || 'Non Renseigné' }}</span>
            </div>
            <div>
              <!-- right margin differ to compensate for the icon size-->
              <span
                class="fr-icon-map-pin-2-line fr-mr-9v"
                aria-hidden="true"
              >
              </span>
              <span>
                {{ response.address }}
              </span>
            </div>
            <div>
              <span
                class="fr-icon-time-line fr-mr-8v"
                aria-hidden="true"
              >
              </span>
              <span> Création le </span>
              <span> {{ new Date(response.creationDate).toLocaleDateString('fr') }} </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- WILDCARD -->
  <p
    v-if="option.wildcard"
    class="fr-mt-8v"
  >
    {{ Translation.t('or') }}
    <a
      class="fr-link tee-input-wildcard"
      :href="Navigation.hashByRouteName(RouteName.Questionnaire)"
      @click="goToNextTrack"
    >
      {{ option.wildcard.label[Translation.lang] }}
    </a>
  </p>
</template>

<script setup lang="ts">
import { useTrackStore } from '@/stores/track'
import { type TrackOptionItem, type TrackOptionsInput } from '@/types'
import { RouteName } from '@/types/routeType'
import Matomo from '@/utils/matomo'
import Navigation from '@/utils/navigation'
import TrackSiret from '@/utils/track/TrackSiret'
import Translation from '@/utils/translation'
import { ref, computed } from 'vue'
import EstablishmentApi from '@/service/api/establishmentApi'
import { EstablishementDisplay } from '@tee/common/src/establishement/types'

// Functionnal note :
// We send data update to the parent component each time the data selection change.
// This is to stay coherent with the rest of the track and more importantly
// because the activation of the nextStep button is computed somewhere in the parents.)

interface Props {
  option: TrackOptionsInput
}
const props = defineProps<Props>()

const queryValue = ref<string>()
const isLoading = ref<boolean>(false)
const requestResponses = ref<EstablishementDisplay[]>([])
const selection = ref<number>(-1)
const errorMessage = ref<string>()

const emit = defineEmits<{
  updateSelection: [TrackOptionItem]
  goToNextTrack: [TrackOptionsInput]
}>()

const hasHint = computed(() => {
  return Boolean(props.option.hint) && !requestResponses.value.length
})

const isSelected = (id: number) => {
  return Boolean(id === selection.value)
}

const resetSelection = () => {
  requestResponses.value = []
  selection.value = -1
  emit('updateSelection', createData())
}

const selectItem = (id: number) => {
  selection.value = id
  emit('updateSelection', createData())
}

const processInput = async () => {
  isLoading.value = true
  errorMessage.value = undefined
  resetSelection()

  if (!queryValue.value || queryValue.value.length < 3) {
    errorMessage.value = Translation.t('enterprise.searchTooShort')
  } else {
    const searchResult = await new EstablishmentApi().get(queryValue.value)

    if (searchResult.isErr) {
      errorMessage.value = Translation.t('enterprise.noStructureFound')
    } else if (searchResult.value.length == 0) {
      errorMessage.value = Translation.t('enterprise.noStructureFound')
    } else {
      requestResponses.value = searchResult.value
      selection.value = 0
      emit('updateSelection', createData())
    }
  }

  isLoading.value = false

  // analytics / send event
  const trackId = useTrackStore().currentId
  if (trackId) {
    Matomo.sendEvent(trackId, 'processInput')
  }
}

const goToNextTrack = () => {
  const option = { ...props.option }
  if (props.option.wildcard) {
    option.next = props.option.wildcard.next
    option.value = props.option.wildcard.value
  }
  emit('goToNextTrack', option)
}

function createData(): TrackOptionItem {
  const siretValue = selection.value >= 0 ? requestResponses.value[selection.value].siret : ''
  const hasSelection = selection.value >= 0
  return TrackSiret.createData(props.option, siretValue, undefined, !hasSelection, hasSelection)
}
</script>

<style scoped>
.custom-border {
  border: solid thin #c4c4c4;
}

.is-selected {
  border: solid thin #000091;
  color: #000091;
  background-color: rgb(245, 245, 245);
}

.is-title-selected {
  color: #000091;
}

.thiner-text {
  font-weight: normal;
}

.result-number {
  font-style: italic;
  color: #000091;
}
</style>
