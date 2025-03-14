<template>
  <span v-if="count">
    {{ count }}
    {{ count > 1 ? Translation.t('results.results') : Translation.t('results.result') }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ProgramType, ProjectType } from '@/types'
import Translation from '@/tools/translation'

interface Props {
  toCount?: ProjectType[] | ProgramType[]
}

const props = defineProps<Props>()

const count = computed(() => {
  return props.toCount?.length || 0
})
</script>
