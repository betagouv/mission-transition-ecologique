<template>
  <nav
    role="navigation"
    :aria-label="navAriaLabel"
  >
    <ul class="fr-btns-group">
      <li
        v-for="(quickLink, index) in links"
        :key="index"
        class="fr-px-4v"
      >
        <DsfrHeaderMenuLink
          v-if="!quickLink.links"
          class="fr-py-2v fr-px-4v"
          v-bind="quickLink"
          :on-click="
            ($event) => {
              handleClick($event, quickLink)
            }
          "
        />
        <template v-else>
          <!-- DROPDOWN MENU ITEM - DISPLAY WIDER THAN MD -->
          <DsfrNavigation
            :id="idNav"
            class="fr-hidden fr-unhidden-lg fr-pr-2w fr-pr-lg-0"
            :nav-items="[{ title: 'Catalogue', links: quickLink.links }]"
            aria-label="Sous Menu secondaire"
          />
          <!-- DROPDOWN MENU ITEM - DISPLAY SMALLER THAN MD -->
          <ul class="fr-hidden-lg">
            <li
              v-for="(link, indexLink) in quickLink.links"
              :id="link.id"
              :key="indexLink"
            >
              <DsfrHeaderMenuLink
                class="fr-p-md-2w"
                v-bind="link"
                :on-click="
                  ($event) => {
                    handleClick($event, link)
                  }
                "
              />
            </li>
          </ul>
        </template>
      </li>
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

const idNav = useId()

function handleClick($event: MouseEvent, quickLink: TeeDsfrHeaderMenuLinkProps) {
  emit('linkClick', $event)
  quickLink.onClick?.($event)
}

const emit = defineEmits<{ linkClick: [event: MouseEvent] }>()
</script>
