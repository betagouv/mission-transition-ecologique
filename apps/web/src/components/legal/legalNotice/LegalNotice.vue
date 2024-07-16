<template>
  <div v-html="htmlWithProps"></div>
  <LegalNoticeThirdParties
    ref="thirdPartiesElement"
    :third-parties="thirdParties as LegalNoticePropsThirdParty[]"
    class="fr-hidden"
  />
</template>
<script setup lang="ts">
import { HtmlManipulator } from '@/utils/htmlManipulator'
import { ComponentPublicInstance, defineProps } from 'vue'
import { LegalNoticeProps, LegalNoticePropsThirdParty } from '@incubateur-ademe/legal-pages-markdown'
import html from '@incubateur-ademe/legal-pages-markdown/html/LegalNotice.html?raw'

const props = defineProps<LegalNoticeProps>()
const htmlWithProps = ref<string>('')
const thirdPartiesElement = ref<ComponentPublicInstance | null>(null)

htmlWithProps.value = html
  .replace('{{contactEmail}}', props.contactEmail)
  .replace('{{siteName}}', props.siteName)
  .replaceAll('{{siteUrl}}', props.siteUrl)
  .replaceAll('{{licenceUrl}}', props.licenceUrl)
  .replaceAll('{{privacyPolicyUrl}}', props.privacyPolicyUrl ?? '')
  .replace('{{date}}', props.date ?? '')
  .replace('{{siteHost.name}}', props.siteHost.name)
  .replaceAll('{{siteHost.email}}', props.siteHost?.email ?? '')
  .replace('{{siteHost.address}}', props.siteHost.address)
  .replace('{{siteHost.country}}', props.siteHost.country)

onMounted(() => {
  if (thirdPartiesElement.value) {
    console.log(thirdPartiesElement.value.$el)
    HtmlManipulator.replacePlaceholderByHtmlElement(htmlWithProps, '{{element_thirdParties}}', thirdPartiesElement.value.$el)
  }
})

// const render = h({
//   render: compile(html.replace('{{element_thirdParties}}', element_thirdParties).replace('{{contactEmail}}', props.contactEmail)),
//   setup: () => props
// })
// console.log(render)
</script>
