<template>
  <div :class="`fr-container${containerFrom ? `-${containerFrom}` : ''}`">
    <slot name="title">
      <component
        :is="titleTag"
        :class="titleClass"
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
  titleTag?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  titleClass?: string
}

withDefaults(defineProps<Props>(), {
  content: undefined,
  containerFrom: undefined,
  titleTag: 'h3',
  titleClass: undefined
})
</script>
