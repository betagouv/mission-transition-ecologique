<template>
  <div
    class="fr-grid-row"
    :class="linkClasses"
  >
    <div
      v-if="img"
      class="image-container fr-col-12 fr-col-md-3 fr-mb-2v fr-mb-md-0"
      :class="imgContainerClass"
    >
      <img
        :src="img"
        alt=""
        class="image"
        :class="imgClass"
      />
    </div>
    <div
      class="content fr-col-12"
      :class="contentClass"
    >
      <h5 v-if="title">
        {{ title }}
      </h5>
      <p><slot /></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CalloutType } from '@/types/elementsPropsTypes'

interface Props {
  type?: CalloutType
  title?: string | number | undefined
  contentClass?: string | undefined
  img?: string | undefined
  imgContainerClass?: string | undefined
  imgClass?: string | undefined
}

const props = withDefaults(defineProps<Props>(), {
  type: CalloutType.Default,
  title: undefined,
  contentClass: undefined,
  img: undefined,
  imgContainerClass: undefined,
  imgClass: undefined
})

const linkClasses = {
  'fr-callout': true,
  'default-callout': props.type === CalloutType.Default,
  'warning-callout': props.type === CalloutType.Warning,
  'custom-callout': props.type === CalloutType.FormInput
}
</script>
