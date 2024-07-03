<template>
  <div>
    <p
      v-for="({ name, url, text }, index) in thirdParties"
      :key="`${index}-thirdParties`"
    >
      {{ text }}
      <a
        :href="url"
        target="_blank"
        rel="noopener noreferrer"
        >{{ name }}</a
      >
    </p>
  </div>
</template>

<script setup lang="ts">
import { LegalNoticePropsWithThirdPartiesAsArray } from '@incubateur-ademe/legal-pages-markdown'
import { defineProps } from 'vue'

defineProps<LegalNoticePropsWithThirdPartiesAsArray>()
</script>
