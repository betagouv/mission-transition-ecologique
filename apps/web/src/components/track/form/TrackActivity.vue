<template>
  <div id="register-activity">
    <DsfrInputGroup
      class="fr-mb-0"
      :error-message="errorMsg"
    >
      <span
        v-if="option.hint"
        class="fr-hint-text fr-mb-2v"
      >
        {{ option?.hint?.[Translation.lang] }}
      </span>
      <div
        ref="activitySearchBar"
        class="fr-search-bar fr-search-bar--yellow"
        :class="isLoading ? 'fr-search-bar--loading' : ''"
        role="search"
      >
        <DsfrInput
          v-model="activityInput"
          name="manual-register-activity"
          class="fr-input"
          type="search"
          :hint="option?.hint?.[Translation.lang]"
          @click="searchActivity"
          @update:model-value="updateModelValue"
          @keyup.enter="searchActivity"
        />
        <DsfrButton
          class="fr-bg--yellow search-button"
          tertiary
          no-outline
          @click="searchActivity"
        />
      </div>
    </DsfrInputGroup>
    <div
      v-if="activityResults.length"
      id="activity-response"
      class="fr-bg--white fr-mt-n3w"
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
  </div>
</template>
<script lang="ts" setup>
import { TrackOptionsInput, CompanyActivityType } from '@/types'
import { onClickOutside } from '@vueuse/core'
import type { TrackOptionItem } from '@/types'
import TrackStructure from '@/utils/track/trackStructure'
import { useDebounce } from '@vueuse/core'
import Translation from '@/utils/translation'

interface Props {
  option: TrackOptionsInput
}
const props = defineProps<Props>()
const emit = defineEmits(['updateSelection'])

const selectedActivity = defineModel<CompanyActivityType>()
const activityInput = ref<string>('')
const activitySearchBar = useTemplateRef('activitySearchBar')
const activityResults = ref<CompanyActivityType[]>([])
const isLoading = ref<boolean>(false)

const debouncedActivityInput = useDebounce(activityInput, 100)
watch(debouncedActivityInput, () => {
  searchActivity()
})

const errorMsg = computed<string>(() => {
  if (activityResults.value.length === 0 && debouncedActivityInput.value && !isLoading.value) {
    return "Aucun secteur d'activité n'a été trouvé."
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

onClickOutside(activitySearchBar, () => resetActivity())

const searchActivity = async () => {
  isLoading.value = true
  const results = await TrackStructure.searchActivity(activityInput.value)
  if (results.isOk) {
    activityResults.value = results.value
  }
  isLoading.value = false
}

function createData(): TrackOptionItem {
  return TrackStructure.createData(props.option, selectedActivity.value?.secteur, selectedActivity.value)
}
</script>
<style lang="scss" scoped>
#activity-response {
  text-align: left;
  width: calc(100% - 40px);
  max-height: 256px;
  z-index: 2000;
  position: absolute;
  overflow: hidden auto;
}

#register-activity {
  position: relative;
  margin-bottom: 0;
}
</style>
