<script lang="ts">
import { LegalNoticeProps } from '@incubateur-ademe/legal-pages-markdown'
import html from '@incubateur-ademe/legal-pages-markdown/html/LegalNotice_withBeta.html?raw'
import { PropType } from 'vue'

export default defineComponent({
  props: {
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
    }
  },
  setup(props) {
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
    return {
      props,
      element_thirdParties
    }
  },
  template: html
})
</script>
