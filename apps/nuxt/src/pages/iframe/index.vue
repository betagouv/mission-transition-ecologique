<template>
  <TeeIframeCard
    :img-bg-color="Color.purple"
    object-fit="contain"
  />
</template>

<script setup lang="ts">
import Analytics from '@/tools/analytic/analytics'
import { MetaRobots } from '@/tools/metaRobots'
import { Color } from '@/types'
definePageMeta({
  layout: 'iframe'
})

if (import.meta.client) {
  const params = new URLSearchParams(window.location.search)
  Analytics.sendEvent('generic_iframe_view', {
    referrer_url: params.get('parent_url')
  })
}

useHead(MetaRobots.noIndexFollow())
</script>
