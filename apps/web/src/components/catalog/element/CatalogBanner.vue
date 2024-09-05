<template>
  <TeeBanner
    class="fr-pt-4v fr-py-md-6w fr-text-center"
    :bg-color="bgColor ?? Color.blueLight"
  >
    <template #title>
      <div class="fr-col-10 fr-col-lg-8">
        <h1 class="fr-text--blue-france">
          <slot name="title" />
        </h1>
      </div>
    </template>
    <template #description>
      <div class="fr-col-12 fr-col-lg-10 fr-col-xl-9 fr-px-1v">
        <p class="fr-text--md">
          <slot name="description" />
        </p>
      </div>
    </template>
  </TeeBanner>
</template>

<script lang="ts" setup>
import { Color } from '@/types'

interface Props {
  bgColor?: Color
}
defineProps<Props>()
</script>
