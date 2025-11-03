<template>
  <div
    id="eligibility-bar"
    ref="eligibilityCriteria"
    class="fr-container--fluid"
    :class="bgClass"
  >
    <div class="fr-container fr-grid-row fr-grid-row--center fr-grid-row--middle fr-py-3v">
      <div
        class="fr-px-sm-2v fr-my-auto fr-col-12 fr-px-0 fr-text-center"
        :class="fontColor"
      >
        <div
          v-if="message"
          class="fr-ml-sm-2v fr-text--bold"
          :role="message.role ?? undefined"
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
    <div
      v-if="messageDetail"
      class="fr-px-sm-2v fr-my-auto fr-col-12 fr-px-0 fr-text-center fr-pb-3v"
      :class="fontColor"
    >
      {{ messageDetail }}
    </div>
  </div>
</template>

<script setup lang="ts">
import Breakpoint from '@/tools/breakpoints'
import Navigation from '@/tools/navigation'
import { Scroll } from '@/tools/scroll/scroll'
import AddClassOnScroll from '@/tools/scroll/addClassOnScroll'
import { Color, RouteName } from '@/types'
import type { RouteLocationRaw } from 'vue-router'

export interface TeeEligibilityBarMessage {
  default: string
  mobile?: string
  icon?: string
  role?: 'alert' | 'status'
}

export type TeeEligibilityBarLink = TeeEligibilityBarLinkButton | TeeEligibilityBarLinkHash

export interface TeeEligibilityBarLinkButton {
  url: RouteName
  label: string
  labelMobile?: string
  isButtonLink: true
  callback?: CallableFunction
}

export interface TeeEligibilityBarLinkHash {
  hash: string
  label: string
  labelMobile?: string
  isButtonLink?: false
}

interface Props {
  bgColor?: Color
  color?: Color
  message?: TeeEligibilityBarMessage
  messageIcon?: string
  link?: TeeEligibilityBarLink
  messageDetail?: string
}
const props = withDefaults(defineProps<Props>(), {
  bgColor: undefined,
  color: Color.blueFrance,
  message: undefined,
  messageIcon: undefined,
  link: undefined,
  messageDetail: undefined
})
const eligibilityCriteria = ref<HTMLElement>()
const stickyWithOffset = ref<AddClassOnScroll | null>(null)

const fontColor = computed(() => {
  return props.color ? `fr-text--${props.color}` : undefined
})

const navigation = new Navigation()

function isProgramDetailPage() {
  return navigation.isByRouteName([RouteName.CatalogProgramDetail, RouteName.ProgramResultDetail])
}

onMounted(async () => {
  if (isProgramDetailPage()) {
    await nextTick()
    stickyWithOffset.value = new AddClassOnScroll(eligibilityCriteria.value, document.getElementById('tee-header'))
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
    return `fr-bg--${props.bgColor}`
  }

  return undefined
})

const scrollTo = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    Scroll.toWithEligibilityBarOffset(element)
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
