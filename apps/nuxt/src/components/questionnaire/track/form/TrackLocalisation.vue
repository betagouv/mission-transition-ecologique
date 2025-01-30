<template>
  <TeeDsfrSearchBar
    v-model="localisationInput"
    :placeholder="option?.hint?.[Translation.lang]"
    name="localisation"
    :color="Color.blueFrance"
    :error-msg="errorMsg"
    :results="localisationResults"
    @update:model-value="updateModelValue"
    @reset-search="hideResults"
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
import { type TrackOptionsInput, ConvertedCommune, CompanyLocalisationType, TrackOptionItem, Color } from '@/types'
import { CompanyData } from '@/tools/companyData'
import { useDebounce } from '@vueuse/core'
import Translation from '@/tools/translation'
import TrackStructure from '@/tools/questionnaire/track/trackStructure'

interface Props {
  option: TrackOptionsInput
}
const props = defineProps<Props>()
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
const showResults = ref<boolean>(true)
const hasInput = computed<boolean>(() => !!debouncedLocalisationInput.value && debouncedLocalisationInput.value.length >= 3)
const noResults = computed<boolean>(() => localisationResults.value.length === 0 && hasInput.value && !isLoading.value)
const errorMsg = computed<string>(() => {
  if (noResults.value && showResults.value) {
    return Translation.t('register.localisation.noResults')
  } else if (!hasInput.value && debouncedLocalisationInput.value.length > 0) {
    return Translation.t('register.localisation.tooShort')
  }
  return ''
})

const searchLocalisation = async () => {
  if (localisationInput.value && localisationInput.value.length >= 3) {
    isLoading.value = true
    showResults.value = true
    const results = await TrackStructure.searchLocalisation(localisationInput.value)
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
  emit('updateSelection', createData())
}
const hideResults = () => {
  showResults.value = false
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
  position: absolute;
  overflow: hidden auto;
}

#register-localisation {
  position: relative;
  margin-bottom: 0;
}
</style>
