<template>
  <div>
    <div class="fr-text--white fr-py-2v">
      <span
        class="fr-pr-2v"
        :class="detailInfos.icon"
      />
      {{ detailInfos.title }}
    </div>
    <component
      :is="currentComponent"
      :infos="detailInfos"
      :manual="manual"
      @modify-siret="emit('modifySiret')"
    />
  </div>
</template>
<script lang="ts" setup>
import { RegisterDetails, RegisterDetailType } from '@/types'
import RegisterDetailSize from './RegisterDetailSize.vue'
import RegisterDetailSiret from './RegisterDetailSiret.vue'
import RegisterDetailActivity from './RegisterDetailActivity.vue'
import RegisterDetailLocalisation from './RegisterDetailLocalisation.vue'

interface Props {
  detailInfos: RegisterDetails
  manual: boolean
}
const props = defineProps<Props>()
const emit = defineEmits<{
  modifySiret: []
}>()
const currentComponent = computed(() => {
  switch (props.detailInfos.type) {
    case RegisterDetailType.Siret:
      return RegisterDetailSiret
    case RegisterDetailType.Localisation:
      return RegisterDetailLocalisation
    case RegisterDetailType.Activity:
      return RegisterDetailActivity
    case RegisterDetailType.Size:
      return RegisterDetailSize
    default:
      return '<div></div>'
  }
})
</script>
