<script setup lang="ts">
import * as Sentry from '@sentry/nuxt'
import { useFetch } from '#imports'
function triggerClientError() {
  console.log('Triggering client error')
  throw new Error('Nuxt Button Error')
}
function getSentryData() {
  Sentry.startSpan(
    {
      name: 'Example Frontend Span',
      op: 'test'
    },
    async () => {
      await useFetch('/api/sentry-example-api')
    }
  )
}
</script>

<template>
  <div>
    <button
      id="errorBtn"
      @click="triggerClientError()"
    >
      Throw Client Error
    </button>
    <button
      type="button"
      @click="getSentryData()"
    >
      Throw Server Error
    </button>
  </div>
</template>
