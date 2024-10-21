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
      :editable="detailInfos.editable"
      :type="detailInfos.type"
      :select-options="detailInfos.selectOptions"
      @modify-field="emit('modifyField', detailInfos.type)"
    />
  </div>
</template>
<script lang="ts" setup>
import { RegisterDetails, FieldType, RegisterDetailType } from '@/types'
import RegisterDetailSelectSize from './RegisterDetailSelectSize.vue'
import RegisterDetailTag from './RegisterDetailTag.vue'

interface Props {
  detailInfos: RegisterDetails
}
const props = defineProps<Props>()
const emit = defineEmits<{
  modifyField: [RegisterDetailType]
}>()
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
