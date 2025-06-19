<template>
  <div :class="`fr-container${containerFrom ? `-${containerFrom}` : ''}`">
    <slot name="title">
      <component
        :is="tagTitle"
        :class="classTitle"
      >
        {{ title }}
      </component>
    </slot>
    <slot name="content">
      <div>{{ content }}</div>
    </slot>
  </div>
</template>
<script lang="ts" setup>
interface Props {
  title: string
  content?: string
  containerFrom?: 'sm' | 'md' | 'lg' | 'xl'
  tagTitle?: 'h3' | 'h4' | 'h5' | 'h6'
  classTitle?: string
}

withDefaults(defineProps<Props>(), {
  content: undefined,
  containerFrom: 'md',
  tagTitle: 'h3',
  classTitle: undefined
})
</script>
