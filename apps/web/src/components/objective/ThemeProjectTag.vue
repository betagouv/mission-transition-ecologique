<template>
  <DsfrButton
    label=""
    secondary
    size="sm"
    :class="`fr-radius-a--2v fr-mx-1v fr-btn--secondary--${color}`"
  />
</template>
<script setup lang="ts">
import { ProjectId } from '@tee/data'
import { Color } from '@/types'

interface Props {
  projectId: ProjectId
  color: Color
}
defineProps<Props>()
</script>
