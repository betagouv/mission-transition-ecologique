<template>
  <div
    id="eligibility-bar"
    ref="eligibilityCriteria"
    :class="bgClass"
  >
    <div class="fr-container fr-grid-row fr-grid-row--center fr-grid-row--middle fr-p-0 fr-py-3v">
      <div class="fr-px-sm-2v fr-my-auto fr-col-12 fr-px-0 fr-text-center">
        <div
          v-if="message"
          class="fr-ml-sm-2v fr-text--blue-france fr-text--bold"
        >
          <span
            v-if="message.icon"
            class="fr-mr-1-5v"
            :class="message.icon"
            aria-hidden="true"
          />
          {{ getMessage() }}
          <span
            v-if="link"
            class="fr-ml-2v"
          >
            <TeeButtonLink
              v-if="link.isButtonLink"
              :to="getRouteToUrl(link.url as RouteName)"
              size="sm"
              secondary
              class="fr-ml-sm-2v"
              @click="link.callback"
            >
              {{ getLinkLabel() }}
            </TeeButtonLink>
            <a
              v-else
              :href="link.hash"
              @click.prevent="scrollTo(link.hash)"
            >
              {{ getLinkLabel() }}
            </a>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navigation from '@/tools/navigation'
import { Color, RouteName } from '@/types'
import StickyWithOffset from '@/tools/stickyWithOffset'
import { Scroll } from '@/tools/scroll'
import type { RouteLocationRaw } from 'vue-router'
import Breakpoint from '@/tools/breakpoints'

interface Props {
  bgColor?: Color
  message?: TeeEligibilityBarMessage
  messageIcon?: string
  link?: TeeEligibilityBarLink
}

export interface TeeEligibilityBarMessage {
  default: string
  mobile?: string
  icon?: string
}

export type TeeEligibilityBarLink = TeeEligibilityBarLinkButton | TeeEligibilityBarLinkHash

export interface TeeEligibilityBarLinkButton {
  url: RouteName
  label: string
  labelMobile?: string
  isButtonLink: true
  callback?: () => void
}

export interface TeeEligibilityBarLinkHash {
  hash: string
  label: string
  labelMobile?: string
  isButtonLink?: false
}

const props = defineProps<Props>()
const eligibilityCriteria = ref<HTMLElement>()
const stickyWithOffset = ref<StickyWithOffset | null>(null)

const navigation = new Navigation()

function isProgramDetailPage() {
  return navigation.isByRouteName([RouteName.CatalogProgramDetail, RouteName.ProgramResultDetail])
}

onMounted(async () => {
  if (isProgramDetailPage()) {
    await nextTick()
    stickyWithOffset.value = new StickyWithOffset(eligibilityCriteria.value, document.getElementById('tee-header'))
    stickyWithOffset.value.addEventListenerOnScroll()
  }
})

onUnmounted(() => {
  if (isProgramDetailPage()) {
    stickyWithOffset.value?.removeEventListenerOnScroll()
  }
})

const bgClass = computed(() => {
  if (props.bgColor) {
    return [`fr-bg--${props.bgColor}`]
  }

  return []
})

const scrollTo = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    Scroll.toWithTopBarOffset(element)
  }
}

const getMessage = () => {
  return props.message?.mobile && Breakpoint.isMobile() ? props.message.mobile : props.message?.default
}

const getLinkLabel = () => {
  return props.link?.labelMobile && Breakpoint.isMobile() ? props.link.labelMobile : props.link?.label
}

const getRouteToUrl = (routeName: RouteName): RouteLocationRaw => {
  return {
    name: routeName,
    query: undefined
  }
}
</script>
