<template>
  <TeeIframeCard
    :link="href"
    :title="`Accédez aux aides publiques pour votre projet de ${projectTitle}`"
    :image-src="currentProject?.image"
    :image-alt="`image du projet ${projectTitle}`"
  />
</template>

<script setup lang="ts">
import { MiddlewareName } from '@/middleware/type/middlewareName'
import Analytics from '@/tools/analytic/analytics'
import { MetaRobots } from '@/tools/metaRobots'
import { RouteName } from '@/types'

definePageMeta({
  layout: 'iframe',
  middleware: [MiddlewareName.hasProject]
})

const { currentProject } = storeToRefs(useProjectStore())
const projectTitle = currentProject.value?.title?.toLowerCase() || ''
const router = useRouter()
const href = router.resolve({ name: RouteName.CatalogProjectDetail, params: { projectSlug: currentProject.value?.slug } }).href

if (import.meta.client) {
  const params = new URLSearchParams(window.location.search)
  const parentUrl = params.get('parent_url')
  Analytics.sendEvent('iframe_view', {
    type: 'project',
    title: projectTitle,
    referrer_url: parentUrl
  })
}

useHead(MetaRobots.noIndexFollow())
</script>
