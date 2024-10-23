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
      v-model="detailModel"
      :infos="detailInfos"
      :manual="manual"
      @update:model-value="updateValue"
      @update:siret="emit('update:siret')"
    />
  </div>
</template>
<script lang="ts" setup>
import { RegisterDetailUnion, RegisterDetailType, Sector, StructureSize } from '@/types'
import TeeProfileSize from './TeeProfileSize.vue'
import TeeProfileSiret from './TeeProfileSiret.vue'
import TeeProfileActivity from './TeeProfileActivity.vue'
import TeeProfileLocalisation from './TeeProfileLocalisation.vue'

interface Props {
  detailInfos: RegisterDetailUnion
  manual: boolean
}

const props = defineProps<Props>()
const detailModel = ref<string | undefined | Sector | StructureSize>(props.detailInfos.value)
const localDetail = ref<RegisterDetailUnion>(props.detailInfos)
const emit = defineEmits<{
  'update:siret': []
}>()

const updateValue = (v: string) => {
  localDetail.value.value = v
}

const currentComponent = computed(() => {
  switch (props.detailInfos.type) {
    case RegisterDetailType.Siret:
      return TeeProfileSiret
    case RegisterDetailType.Localisation:
      return TeeProfileLocalisation
    case RegisterDetailType.Activity:
      return TeeProfileActivity
    case RegisterDetailType.Size:
      return TeeProfileSize
    default:
      return '<div></div>'
  }
})
</script>
