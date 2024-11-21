<template>
  <p
    v-if="infos.value"
    class="fr-tag fr-mb-4v fr-bg--blue-france--lightness"
  >
    <span class="fr-pr-4v">{{ infos.tagLabel || activityText }}</span>
    <span
      class="fr-icon-close-line fr-radius-a--2v fr-btn-bg"
      @click="modifyActivity"
    />
  </p>
  <div
    v-else
    id="register-activity"
  >
    <div
      class="fr-input-group fr-mb-0"
      :class="errorMsg ? 'fr-input-group--error' : 'fr-input-group--valid'"
    >
      <div
        ref="activitySearchBar"
        class="fr-search-bar fr-search-bar--yellow"
        :class="isLoading ? 'fr-search-bar--loading' : ''"
        role="search"
      >
        <DsfrInput
          v-model="activityInput"
          name="manual-register-activity"
          class="fr-input--white fr-input"
          type="search"
          :placeholder="infos.description"
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
    </div>
    <div
      v-if="activityResults.length && !infos.value"
      id="activity-response"
      class="fr-bg--white"
    >
      <div
        v-for="activity in activityResults"
        :key="`resp-input-${activity}`"
        class="fr-card fr-card-result fr-card--no-arrow fr-card--shadow"
        @click="selectActivity(activity)"
      >
        <div class="fr-card__body">
          <div class="fr-card__content fr-py-1v fr-px-4v fr-text--blue-france">
            <div class="fr-text--blue-france">{{ activity }}</div>
          </div>
        </div>
      </div>
    </div>
    <div
      :class="errorMsg ? 'fr-error-text' : ''"
      class="fr-input--empty-text fr-mt-2v"
    >
      {{ errorMsg }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { RegisterDetailActivity, CompanyActivityType } from '@/types'
import { useDebounce } from '@vueuse/core'
import EstablishmentApi from '@/service/api/establishmentApi'
import { onClickOutside } from '@vueuse/core'
//import CompanyDataStorage from '@/utils/storage/companyDataStorage'

interface Props {
  infos: RegisterDetailActivity
  manual: boolean
  showError: boolean
}
const props = defineProps<Props>()

const selectedActivity = defineModel<CompanyActivityType>()
const activityInput = ref<string>('')
const isLoading = ref<boolean>(false)
const activitySearchBar = ref(null)
const activityResults = ref<CompanyActivityType[]>([])

onClickOutside(activitySearchBar, () => modifyActivity())

const debouncedActivityInput = useDebounce(activityInput, 1000)

const errorMsg = computed<string>(() => {
  if (props.showError && !debouncedActivityInput.value && !isLoading.value) {
    return "La sélection de votre secteur d'activité est nécessaire"
  } else if (activityResults.value.length === 0 && debouncedActivityInput.value && !isLoading.value) {
    return "Aucun secteur d'activité n'a été trouvé."
  }
  return ''
})
const modifyActivity = () => {
  selectedActivity.value = undefined
}

const updateModelValue = (value: string) => {
  activityInput.value = value
}

const selectActivity = (activity: CompanyActivityType) => {
  selectedActivity.value = activity
}

const searchActivity = async () => {
  if (activityInput.value) {
    isLoading.value = true
    const results = await new EstablishmentApi().searchActivities(activityInput.value)
    if (results.isOk) {
      activityResults.value = results.value
    }
    isLoading.value = false
  } else {
    activityResults.value = []
  }
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
}

#register-activity {
  position: relative;
  margin-bottom: 0;
}
</style>
