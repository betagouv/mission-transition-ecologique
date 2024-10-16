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
      :label="detailInfos.tagLabel"
      :select-options="detailInfos.selectOptions"
    />
  </div>
</template>
<script lang="ts" setup>
import { RegistrationDetailElement, FieldType } from '@/types'
import RegisterDetailSelectSize from './RegisterDetailSelectSize.vue'
import RegisterDetailTag from './RegisterDetailTag.vue'

interface Props {
  detailInfos: RegistrationDetailElement
}
const props = defineProps<Props>()

const currentComponent = computed(() => {
  switch (props.detailInfos.fieldType) {
    case FieldType.Tag:
      return RegisterDetailTag
    case FieldType.Select:
      return RegisterDetailSelectSize
    default:
      return '<div></div>'
  }
})
</script>
