<template>
  <p
    v-if="infos.value"
    class="fr-tag fr-mb-4v fr-bg--blue-france--lightness"
  >
    <span class="fr-pr-4v">{{ infos.tagLabel || activityText }}</span>
    <span
      v-if="manual"
      class="fr-icon-close-line fr-radius-a--2v fr-btn-bg"
      @click="modifyActivity"
    />
  </p>
  <DsfrSelect
    v-else-if="manual"
    v-model="selectedActivity"
    class="fr-mb-0"
    :options="sectorOptions"
    :default-unselected-text="infos.description"
  />
  <div
    v-if="hasError"
    :class="errorMessage ? 'fr-error-text' : ''"
    class="fr-input--empty-text fr-mt-2v"
  >
    {{ errorMessage }}
  </div>
</template>
<script lang="ts" setup>
import { RegisterDetailActivity, Sector } from '@/types'

interface Props {
  infos: RegisterDetailActivity
  manual: boolean
  showError: boolean
}
const props = defineProps<Props>()
const selectedActivity = defineModel<Sector>()
const errorMessage = computed<string>(() => {
  if (hasError) {
    return "La sélection de votre secteur d'activité est nécessaire"
  }
  return ''
})
const hasError = computed<boolean>(() => {
  return !props.infos.value && props.showError
})
const modifyActivity = () => {
  selectedActivity.value = undefined
}
const sectorOptions = [
  {
    value: Sector.Craftsmanship,
    text: '👩‍🎨 J’ai une activité artisanale'
  },
  {
    value: Sector.Industry,
    text: '👩‍🔧 J’ai une activité industrielle, fabrication, production'
  },
  {
    value: Sector.Tourism,
    text: '🤵‍♂️ J’ai une activité de tourisme, restauration'
  },
  {
    value: Sector.Tertiary,
    text: '🧑‍⚖️ J’ai une activité tertiaire, de services'
  },
  {
    value: Sector.Agriculture,
    text: '👩‍🌾 J’ai une activité agricole'
  },
  {
    value: Sector.Other,
    text: "Je suis dans un autre secteur d'activité"
  }
]
const activityText = computed(() => {
  const activityOption = sectorOptions.find((el: { value: Sector; text: string }) => el.value === props.infos.value)
  return activityOption?.text
})
</script>
