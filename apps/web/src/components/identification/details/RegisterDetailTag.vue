<template>
  <DsfrTag :label="label" />
</template>
<script lang="ts" setup>
interface Props {
  label: string
}
defineProps<Props>()
</script>
