<template>
  <render />
</template>
<script setup lang="ts">
import { defineProps, compile, PropType } from 'vue'
import { LegalNoticeProps } from '@incubateur-ademe/legal-pages-markdown'
import html from '@incubateur-ademe/legal-pages-markdown/html/LegalNotice.html?raw'

const props = defineProps({
  date: {
    type: String,
    required: true
  },
  licenceUrl: {
    type: String,
    required: true
  },
  privacyPolicyUrl: {
    type: String,
    required: true
  },
  siteUrl: {
    type: String,
    required: true
  },
  siteName: {
    type: String,
    required: true
  },
  thirdParties: {
    type: Array as PropType<LegalNoticeProps['thirdParties']>,
    required: false,
    default: () => []
  },
  siteHost: {
    type: Object as PropType<LegalNoticeProps['siteHost']>,
    required: false,
    default: () => ({})
  },
  contactEmail: {
    type: String,
    required: true
  }
})

let element_thirdParties = ''
if (props.thirdParties) {
  for (const { name, url, text } of props.thirdParties) {
    element_thirdParties += `
    <p>
      ${text} <a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a>
    </p>
  `
  }
}

const render = h({
  render: compile(html.replace('{{element_thirdParties}}', element_thirdParties).replace('{{contactEmail}}', props.contactEmail)),
  setup: () => props
})
</script>
