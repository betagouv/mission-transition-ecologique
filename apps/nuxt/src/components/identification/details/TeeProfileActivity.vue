<template>
  <p
    v-if="infos.value"
    class="fr-tag fr-mb-4v fr-bg--blue--lightness"
  >
    <span class="fr-pr-4v">{{ activityLabel }}</span>
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
    </div>
    <div
      v-if="activityResults.length && !infos.value"
      id="activity-response"
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
import EstablishmentApi from '@/tools/api/establishmentApi'
import { onClickOutside } from '@vueuse/core'
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
const activitySearchBar = ref(null)
const activityResults = ref<CompanyActivityType[]>([])
const activityLabel = computed<string>(() => {
  return `${props.infos.value?.secteur} (${props.infos.value?.codeNAF})`
})

onClickOutside(activitySearchBar, () => modifyActivity())

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

const modifyActivity = () => {
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

#register-activity {
  position: relative;
  margin-bottom: 0;
}
</style>
