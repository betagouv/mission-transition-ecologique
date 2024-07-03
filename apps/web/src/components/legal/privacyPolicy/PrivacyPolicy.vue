<template>
  <div v-html="htmlWithProps"></div>
  <PrivacyPolicyThirdPartiesTable
    ref="tableThirdParties"
    :third-parties="thirdParties as PrivacyPolicyPropsThirdParty[]"
    class="fr-hidden"
  />
  <PrivacyPolicyCookiesTable
    ref="tableCookies"
    :cookies="cookies as PrivacyPolicyPropsCookie[]"
    class="fr-hidden"
  />
</template>

<script setup lang="ts">
import PrivacyPolicyThirdPartiesTable from '@/components/legal/privacyPolicy/PrivacyPolicyThirdPartiesTable.vue'
import { HtmlManipulator } from '@/utils/htmlManipulator'
import { ComponentPublicInstance, defineProps } from 'vue'
import { PrivacyPolicyProps, PrivacyPolicyPropsCookie, PrivacyPolicyPropsThirdParty } from '@incubateur-ademe/legal-pages-markdown'
import html from '@incubateur-ademe/legal-pages-markdown/html/PrivacyPolicy.html?raw'

const props = defineProps<PrivacyPolicyProps>()
const htmlWithProps = ref<string>('')
const tableThirdParties = ref<ComponentPublicInstance | null>(null)
const tableCookies = ref<ComponentPublicInstance | null>(null)

htmlWithProps.value = html
  .replace('{{siteName}}', props.siteName)
  .replace('{{date}}', props.date ?? '')
  .replace('{{cookieConsentButton}}', props.cookieConsentButton ?? '')

onMounted(() => {
  if (tableThirdParties.value) {
    HtmlManipulator.replacePlaceholderByHtmlElement(htmlWithProps, '{{table_thirdParties}}', tableThirdParties.value.$el)
  }
  if (tableCookies.value) {
    HtmlManipulator.replacePlaceholderByHtmlElement(htmlWithProps, '{{table_cookies}}', tableCookies.value.$el)
  }
})

// const render = h({
//   render: compile(html.replace('{{table_thirdParties}}', tableThirdParties).replace('{{table_cookies}}', tableCookies)),
//   setup: () => props
// })
</script>
