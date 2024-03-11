<template>
  <div style="height: 100%">
    <DsfrInputGroup :error-message="errorMessage">
      <!-- INPUT -->
      <label
        v-if="option.label"
        class="fr-label fr-mb-2v"
        :for="`input-${option.id}`"
      >
        {{ option.label[Translation.lang] }}
      </label>
      <div
        id="header-search"
        class="fr-search-bar"
        role="search"
      >
        <input
          :id="`input-${option.id}`"
          v-model="inputValue"
          :name="`input-${option.id}`"
          :disabled="isLoading"
          :placeholder="option?.placeholder?.[Translation.lang]"
          class="fr-input tee-input-large"
          type="search"
          @keyup.enter="processInput"
        />
        <button
          class="fr-btn tee-btn-input-large"
          :disabled="isLoading"
          :title="Translation.t('input.search')"
          @click="processInput"
        >
          <!-- {{ Translation.t('input.search') }} -->
        </button>
      </div>
      <!-- hint -->
      <div
        v-if="option.hint && !requestResponses.length"
        class="tee-input-hint fr-mt-4v"
      >
        <span v-html="option.hint[Translation.lang]"> </span>
      </div>
    </DsfrInputGroup>

    <!-- RESPONSE ERRORS -->
    <div
      v-if="requestErrors.length"
      class="fr-mt-6v"
    >
      <p
        class="fr-mb-0 fr-error-text"
        style="display: block"
      >
        <!-- <span class="fr-icon-error-line" aria-hidden="true"></span> -->
        {{ Translation.t('enterprise.noStructureFound') }}

        <!-- POST RESPONSE HELP MESSAGE (IF ANY) -->
        <br v-if="option.postResponses" />
        <span
          v-if="option.postResponses"
          v-html="option.postResponses[Translation.lang]"
        >
        </span>
      </p>
    </div>

    <!-- RESPONSES -->
    <div
      v-if="requestResponses.length"
      class="fr-mt-4v"
    >
      <h6 v-show="!hasSelection && requestResponses.length > 1">
        {{ Translation.t('enterprise.select') }}
      </h6>
      <!-- CARDS -->
      <div
        v-for="(resp, i) in requestResponses"
        :key="`resp-input-${i}`"
        class="fr-card fr-card-result fr-card--no-arrow fr-card--shadow"
        :style="`border: ${isSelected(resp) ? 'solid thin #000091;' : 'solid thin #C4C4C4'};`"
        @click="selectItem(resp)"
      >
        <div class="fr-card__body">
          <div class="fr-card__content fr-py-4v fr-px-4v">
            <!-- TITLE -->
            <template
              v-for="(resMap, idx) in resp.resultsMapping"
              :key="`resp-input-${i}-field-title-${idx}`"
            >
              <h3
                v-if="resMap.position === 'title'"
                :class="`fr-card__title ${resMap.class || 'fr-mb-2v'}`"
                :style="`${isSelected(resp) ? 'color: #000091;' : ''}`"
              >
                <span>
                  {{ getFromFields(resp, resMap) }}
                </span>
              </h3>
            </template>

            <div class="fr-card__desc tee-resp-info-block">
              <p
                v-for="(resMap, idx) in resp.resultsMapping?.filter((i) => i.position !== 'title')"
                :key="`resp-input-${i}-field-${idx}`"
                :class="resMap.class || 'fr-mb-2v'"
              >
                <!-- ICON -->
                <span
                  v-if="resMap.icon"
                  :class="`${resMap.icon} fr-mr-8v`"
                  aria-hidden="true"
                >
                </span>
                <!-- TITLE -->
                <span
                  v-if="resMap.label"
                  class="fr-mr-1v"
                >
                  {{ resMap.label }}
                </span>
                <span :style="resMap.style">
                  {{ getFromFields(resp, resMap) }}
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
  </div>
</template>

<script setup lang="ts">
// CONSOLE LOG TEMPLATE
// console.log(`TeeTrackInput > FUNCTION_NAME > MSG_OR_VALUE :`)

import { type ReqError, type ReqResp, type ResultsMapping, TrackId, type TrackOptionsInput, type TrackOptionsUnion } from '@/types'
import { RouteName } from '@/types/routeType'
import { getFromResp } from '@/utils/helpers'
import Matomo from '@/utils/matomo'
import Navigation from '@/utils/navigation'
import TrackCallback from '@/utils/track/TrackCallback'
import Translation from '@/utils/translation'
import { DsfrInputGroup } from '@gouvminint/vue-dsfr'
import { onBeforeMount, ref } from 'vue'

interface Props {
  trackId: TrackId
  option: TrackOptionsInput
}
const props = defineProps<Props>()

const inputValue = ref<string | number>()
const isLoading = ref<boolean>(false)

const requestResponses = ref<ReqResp[]>([])
const requestErrors = ref<ReqError[]>([])

const selection = ref<any>()
const hasSelection = ref<boolean>(false)
const errorMessage = ref<string>()

const emit = defineEmits(['updateSelection', 'goToNextTrack'])

onBeforeMount(() => {
  if (props.option.defaultInput) {
    inputValue.value = props.option.defaultInput
  }
})

// getters
const getFromFields = (resp: any, resMap: ResultsMapping) => {
  return getFromResp(resp, resMap).join(resMap.sep || ' ')
}

const isSelected = (resp: any) => {
  return Boolean(resp === selection.value)
}

// functions
const resetSelection = () => {
  requestResponses.value = []
  requestErrors.value = []
  selection.value = undefined
  hasSelection.value = false
}

const processInput = async () => {
  isLoading.value = true
  errorMessage.value = undefined
  resetSelection()

  if (props.option?.validation.length > 0) {
    // const isValid = false
    if (!props.option.validation(inputValue.value)) {
      errorMessage.value = "Le numéro SIRET n'est pas valide"
      isLoading.value = false
      return
    }
  }

  const { responses, errors } = await TrackCallback.applies(props.option, inputValue.value as string)

  requestResponses.value = responses
  requestErrors.value = errors
  isLoading.value = false

  // analytics / send event
  Matomo.sendEvent(props.trackId, 'processInput')

  // send signal to parent if error
  if (requestErrors.value.length) {
    const data = {
      option: {
        ...props.option,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        value: selection.value
      },
      remove: true
    }
    emit('updateSelection', data)
  }
}

const goToNextTrack = () => {
  const data = {
    option: { ...props.option }
  }
  if (props.option.wildcard) {
    data.option.next = props.option.wildcard.next
  }
  emit('goToNextTrack', data.option)
}

const selectItem = (item: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  selection.value = hasSelection.value ? undefined : item
  hasSelection.value = !hasSelection.value
  const data = {
    option: {
      ...props.option,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      questionnaireData: item.data,
      value: inputValue.value
    } as TrackOptionsUnion,
    remove: !hasSelection.value
  }

  emit('updateSelection', data)
}
</script>
