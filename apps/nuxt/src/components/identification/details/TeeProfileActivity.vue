<template>
  <p
    v-if="infos.value"
    class="fr-tag fr-mb-4v fr-bg--blue-france--lightness"
  >
    <span class="fr-pr-4v">{{ activityLabel }}</span>
    <span
      class="fr-icon-close-line fr-radius-a--2v fr-btn-bg"
      @click="resetActivity"
    />
  </p>
  <TeeDsfrSearchBar
    v-else
    v-model="activityInput"
    :placeholder="infos.description"
    name="activity"
    :error-msg="errorMsg"
    :results="activityResults"
    @update:model-value="updateModelValue"
    @reset-search="resetActivity"
    @search="searchLocalisation"
  >
    <template #results>
      <div
        v-if="activityResults.length && showResults"
        id="activity-response"
        class="fr-bg--white"
      >
        <div
          v-for="localisation in activityResults"
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
import { RegisterDetailActivity, CompanyActivityType } from '@/types'
import { useDebounce } from '@vueuse/core'
import EstablishmentApi from '@/tools/api/establishmentApi'
import Translation from '@/tools/translation'

interface Props {
  infos: RegisterDetailActivity
  manual: boolean
  showError: boolean
}
const props = defineProps<Props>()

const selectedActivity = defineModel<CompanyActivityType>()

const activityInput = ref<string>('')
const isLoading = ref<boolean>(false)
const activityResults = ref<CompanyActivityType[]>([])
const activityLabel = computed<string>(() => {
  return `${props.infos.value?.secteur} (${props.infos.value?.codeNAF})`
})

const debouncedActivityInput = useDebounce(activityInput, 100)
watch(debouncedActivityInput, () => {
  searchActivity()
})

const errorMsg = computed<string>(() => {
  if (props.showError && !debouncedActivityInput.value && !isLoading.value) {
    return Translation.t('register.activity.mandatory')
  } else if (activityResults.value.length === 0 && debouncedActivityInput.value && !isLoading.value) {
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
}

const searchActivity = async () => {
  isLoading.value = true
  const results = await new EstablishmentApi().searchActivities(activityInput.value)
  if (results.isOk()) {
    activityResults.value = results.data
  }
  isLoading.value = false
}
</script>
<style lang="scss" scoped>
#activity-response {
  text-align: left;
  width: calc(100% - 40px);
  max-height: 128px;
  z-index: 2000;
  position: absolute;
  overflow: hidden auto;
  box-shadow: 0 4px 8px rgb(0 0 0 / 20%);
}
</style>
