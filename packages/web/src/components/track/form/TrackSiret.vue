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
    v-if="requestResponses.length"
    class="fr-mt-4v"
  >
    <!-- CARDS -->
    <div
      v-for="(response, i) in requestResponses"
      :key="`resp-input-${i}`"
      class="fr-card fr-card-result fr-card--no-arrow fr-card--shadow"
      :style="`border: ${isSelected(i) ? 'solid thin #000091;' : 'solid thin #C4C4C4'};`"
      @click="selectItem(i)"
    >
      <div class="fr-card__body">
        <div class="fr-card__content fr-py-4v fr-px-4v">
          <!-- TITLE -->
          <h3
            :class="`fr-card__title fr-mb-2v`"
            :style="`${isSelected(i) ? 'color: #000091;' : ''}`"
          >
            <span> {{ response.name }} - SIRET {{ response.siret }} </span>
          </h3>
          <div class="fr-card__desc tee-resp-info-block">
            <p
              :key="`resp-input-${i}-field-${i}`"
              :class="'fr-mb-2v'"
            >
              <!-- ICON -->
              <span
                class="fr-icon-briefcase-line fr-mr-8v"
                aria-hidden="true"
              >
              </span>
              <!-- TITLE -->
              <span class="fr-mr-1v"> Secteur d'activité : </span>
              <span>
                {{ response.sector }}
              </span>
            </p>
          </div>
          <div class="fr-card__desc tee-resp-info-block">
            <p
              :key="`resp-input-${i}-field-${i}`"
              :class="'fr-mb-2v'"
            >
              <!-- ICON -->
              <span
                class="fr-icon-map-pin-2-line fr-mr-8v"
                aria-hidden="true"
              >
              </span>
              <!-- TITLE -->
              <span>
                {{ response.address }}
              </span>
            </p>
          </div>
          <div class="fr-card__desc tee-resp-info-block">
            <p
              :key="`resp-input-${i}-field-${i}`"
              :class="'fr-mb-2v'"
            >
              <!-- ICON -->
              <span
                class="fr-icon-time-line fr-mr-8v"
                aria-hidden="true"
              >
              </span>
              <!-- TITLE -->
              <span class="fr-mr-1v"> Création le </span>
              <span>
                {{ response.creationDate }}
              </span>
            </p>
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
// CONSOLE LOG TEMPLATE
// console.log(`TeeDsfrSearchBar > FUNCTION_NAME > MSG_OR_VALUE :`)

import { useTrackStore } from '@/stores/track'
import { type TrackOptionItem, type TrackOptionsInput } from '@/types'
import { RouteName } from '@/types/routeType'
import Matomo from '@/utils/matomo'
import Navigation from '@/utils/navigation'
import Translation from '@/utils/translation'
import { ref, computed } from 'vue'
import EstablishmentApi from '@/service/api/establishmentApi'
import { EstablishementDisplay } from '@tee/common/src/establishement/types'

interface Props {
  option: TrackOptionsInput
}
const props = defineProps<Props>()

const queryValue = ref<string>()
const isLoading = ref<boolean>(false)
const requestResponses = ref<EstablishementDisplay[]>([])
const selection = ref<number>(0)
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
  selection.value = 0
}

const selectItem = (id: number) => {
  selection.value = id
}

const processInput = async () => {
  isLoading.value = true
  errorMessage.value = undefined
  resetSelection()

  const searchResult = await new EstablishmentApi().get(queryValue.value as string)
  console.log(searchResult)

  if (searchResult.isErr) {
    errorMessage.value = Translation.t('enterprise.noStructureFound')
  } else {
    requestResponses.value = searchResult.value
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
  // emit('updateSelection', createData()) TODO
  emit('goToNextTrack', option)
}
</script>
