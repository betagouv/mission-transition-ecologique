<template>
  <nav
    role="navigation"
    :aria-label="navAriaLabel"
  >
    <ul class="fr-btns-group">
      <template
        v-for="(quickLink, index) in links"
        :key="index"
      >
        <li class="fr-px-4v">
          <DsfrHeaderMenuLink
            v-if="!quickLink.links"
            class="fr-mr-md-2w fr-p-2v"
            v-bind="quickLink"
            @click="handleClick($event, quickLink)"
          />
          <template v-else>
            <!-- DROPDOWN MENU ITEM - DISPLAY WIDER THAN MD -->
            <DsfrNavigation
              class="fr-hidden fr-unhidden-lg fr-pr-2w fr-pr-lg-0"
              :nav-items="[{ title: 'Catalogue', links: quickLink.links }]"
              aria-label="Sous Menu secondaire"
            />
            <!-- DROPDOWN MENU ITEM - DISPLAY SMALLER THAN MD -->
            <ul class="fr-hidden-lg">
              <li
                v-for="(childLink, childIndex) in quickLink.links"
                :key="childIndex"
              >
                <DsfrHeaderMenuLink
                  class="fr-p-md-2w"
                  v-bind="childLink"
                  @click="handleClick($event, childLink)"
                />
              </li>
            </ul>
          </template>
        </li>
      </template>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
import { DsfrHeaderMenuLink, DsfrHeaderMenuLinkProps, DsfrNavigation, DsfrNavigationMenuLinkProps } from '@gouvminint/vue-dsfr'

export interface TeeDsfrHeaderMenuLinkProps extends DsfrHeaderMenuLinkProps {
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

function handleClick($event: MouseEvent, quickLink: TeeDsfrHeaderMenuLinkProps) {
  emit('linkClick', $event)
  quickLink.onClick?.($event)
}

const emit = defineEmits<{ linkClick: [event: MouseEvent] }>()
</script>
