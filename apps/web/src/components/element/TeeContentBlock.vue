<template>
  <div class="fr-container">
    <slot name="title">
      <h3>{{ title }}</h3>
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
}

defineProps<Props>()
</script>
