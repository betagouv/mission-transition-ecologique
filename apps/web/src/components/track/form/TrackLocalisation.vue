<template>
  <div>
    <DsfrInputGroup :error-message="errorMsg">
      <span
        v-if="option.hint"
        class="fr-hint-text fr-mb-2v"
      >
        {{ option?.hint?.[Translation.lang] }}
      </span>
      <div
        ref="localisationSearchBar"
        class="fr-search-bar fr-search-bar--yellow"
        :class="isLoading ? 'fr-search-bar--loading' : ''"
        role="search"
      >
        <DsfrInput
          v-model="localisationInput"
          name="manual-register-localisation"
          class="fr-input"
          type="search"
          :hint="option?.hint?.[Translation.lang]"
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
    </DsfrInputGroup>
    <div
      v-if="localisationResults.length"
      id="track-localisation-response"
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
  </div>
</template>
<script lang="ts" setup>
import { type TrackOptionsInput, ConvertedCommune, CompanyLocalisationType } from '@/types'
import CompanyDataStorage from '@/utils/storage/companyDataStorage'
import { useDebounce } from '@vueuse/core'
import type { TrackOptionItem } from '@/types'
import { computed } from 'vue'
import Translation from '@/utils/translation'
import TrackStructure from '@/utils/track/trackStructure'

interface Props {
  option: TrackOptionsInput
}
const props = defineProps<Props>()
console.log(props.option, props.option?.hint?.[Translation.lang])
const emit = defineEmits(['updateSelection'])

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

const errorMsg = computed<string>(() => {
  if (
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
const searchLocalisation = async () => {
  if (localisationInput.value && localisationInput.value.length >= 3) {
    isLoading.value = true
    const results = await TrackStructure.searchLocalisation(localisationInput.value)
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
  console.log(selectedLocalisation.value)
  emit('updateSelection', createData())
}

function createData(): TrackOptionItem {
  return TrackStructure.createData(props.option, selectedLocalisation.value?.region, selectedLocalisation.value)
}
</script>
<style lang="scss" scoped>
#track-localisation-response {
  text-align: left;
  width: calc(100% - 40px);
  max-height: 256px;
  z-index: 2000;
  overflow: hidden auto;
}
</style>
