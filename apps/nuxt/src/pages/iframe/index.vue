<template>
  <TeeCtaCard
    :bg-color="Color.purple"
    object-fit="contain"
  ></TeeCtaCard>
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
  const parentUrl = params.get('parent_url')
  Analytics.sendEvent('generic_iframe_view', {
    referrer_url: parentUrl
  })
}

useHead(MetaRobots.noIndexFollow())
</script>
