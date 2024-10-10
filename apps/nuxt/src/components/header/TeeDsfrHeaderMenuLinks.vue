<template>
  <nav
    role="navigation"
    :aria-label="navAriaLabel"
  >
    <ul class="fr-btns-group">
      <li
        v-for="(quickLink, index) in links"
        :key="index">
        <DsfrHeaderMenuLink
          v-if="!quickLink.links"
          class="fr-mr-md-2w fr-p-md-2w"
          v-bind="quickLink"
          @click="handleClick($event, quickLink)"
        />
        <template v-else>
          <DsfrNavigation
            class="fr-hidden fr-unhidden-lg fr-mr-2w fr-mr-lg-0"
            :nav-items="[{ title: 'Catalogue', links: quickLink.links }]"
            aria-label="Sous Menu secondaire"
          />
          <ul>
            <li
              v-for="(link, indexLink) in quickLink.links"
              :key="indexLink"
            >
              <DsfrHeaderMenuLink
                class="fr-hidden-lg fr-p-md-2w"
                v-bind="link"
                @click="handleClick($event, link)"
              />
            </li>
          </ul>
        </template>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
import type { OhVueIcon as VIcon } from 'oh-vue-icons'
import { DsfrHeaderMenuLink, DsfrNavigation, DsfrNavigationMenuLinkProps } from '@gouvminint/vue-dsfr'

export type TeeDsfrHeaderMenuLinkProps = {
  button?: boolean
  icon?: string | InstanceType<typeof VIcon>['$props']
  iconAttrs?: InstanceType<typeof VIcon>['$props'] & import('vue').HTMLAttributes
  iconRight?: boolean
  label?: string
  target?: string
  onClick?: ($event: MouseEvent) => void
  to?: import('vue-router').RouteLocationRaw
  href?: string
  links?: DsfrNavigationMenuLinkProps[]
}

withDefaults(
  defineProps<{
    links?: TeeDsfrHeaderMenuLinkProps[]
    navAriaLabel?: string
  }>(),
  {
    links: () => [],
    navAriaLabel: 'Menu secondaire'
  }
)

function handleClick($event: MouseEvent, link: TeeDsfrHeaderMenuLinkProps) {
  emit('linkClick', $event)
  link.onClick?.($event)
}

const emit = defineEmits<{ linkClick: [event: MouseEvent] }>()
</script>
