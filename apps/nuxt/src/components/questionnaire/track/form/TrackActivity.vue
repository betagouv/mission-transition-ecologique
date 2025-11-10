<template>
  <TeeDsfrSearchBar
    v-model="activityInput"
    :placeholder="option?.hint?.[Translation.lang]"
    name="activity"
    :is-loading="isLoading"
    :search-color="Color.white"
    :background-color="Color.greyLighted"
    :color="Color.blueFrance"
    :error-msg="errorMsg"
    :results="activityResults"
    @update:model-value="updateModelValue"
    @reset-search="resetActivity"
    @search="searchActivity"
  >
    <template #results>
      <div
        v-if="activityResults.length"
        id="track-activity-response"
        class="fr-bg--white"
      >
        <div
          v-for="activity in activityResults"
          :key="`resp-input-${activity.codeNAF}-${activity.codeNAF1}`"
          class="fr-card fr-card-result fr-card--no-arrow fr-card--shadow"
          @click="selectActivity(activity)"
        >
          <div class="fr-card__body">
            <div class="fr-card__content fr-py-1v fr-px-4v fr-text--blue-france">
              <div class="fr-text--blue-france">{{ `${activity.secteur} (${activity.codeNAF})` }}</div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </TeeDsfrSearchBar>
</template>
<script lang="ts" setup>
import { useEstablishmentStore } from '@/stores/establishment'
import { TrackOptionsInput, CompanyActivityType, TrackOptionItem, Color } from '@/types'
import { useDebounce } from '@vueuse/core'
import TrackStructure from '@/tools/questionnaire/track/trackStructure'
import Translation from '@/tools/translation'

interface Props {
  option: TrackOptionsInput
}
const props = defineProps<Props>()
const emit = defineEmits(['updateSelection'])
const selectedActivity = defineModel<CompanyActivityType>()
const establishmentStore = useEstablishmentStore()
const activityInput = ref<string>('')
const activityResults = ref<CompanyActivityType[]>([])
const isLoading = ref<boolean>(false)
const debouncedActivityInput = useDebounce(activityInput, 100)
watch(debouncedActivityInput, () => {
  searchActivity()
})
const errorMsg = computed<string>(() => {
  if (activityResults.value.length === 0 && debouncedActivityInput.value && !isLoading.value) {
    return Translation.t('register.activity.noResults')
  }
  return ''
})
const resetActivity = () => {
  selectedActivity.value = undefined
  activityInput.value = ''
  activityResults.value = []
}
const updateModelValue = (value: string) => {
  activityInput.value = value
}
const selectActivity = (activity: CompanyActivityType) => {
  selectedActivity.value = activity
  emit('updateSelection', createData())
}
const searchActivity = async () => {
  isLoading.value = true
  activityResults.value = await establishmentStore.searchActivities(activityInput.value)
  isLoading.value = false
}
function createData(): TrackOptionItem {
  return TrackStructure.createData(props.option, selectedActivity.value?.secteur, selectedActivity.value)
}
</script>
<style lang="scss" scoped>
#track-activity-response {
  text-align: left;
  width: calc(100% - 40px);
  max-height: 256px;
  z-index: 2000;
  position: absolute;
  overflow: hidden auto;
  box-shadow: 0 4px 8px rgb(0 0 0 / 20%);
}

#register-activity {
  position: relative;
  margin-bottom: 0;
}
</style>
