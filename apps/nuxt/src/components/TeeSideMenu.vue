<template>
  <div
    id="tee-sidemenu"
    class="fr-pr-0 fr-mt-6v"
  >
    <a
      v-for="item in filteredMenuItems"
      :key="item.id"
      :href="`#${item.to}`"
      class="fr-pl-4v"
      :class="[item.class ? item.class : 'fr-sidemenu__link', item.icon ? 'fr-btn--icon-left ' + item.icon : '']"
      @click.prevent="scrollTo(item.to)"
    >
      {{ item.text }}
    </a>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Scroll } from '@/tools/scroll/scroll'

export interface MenuItem {
  id: string
  text: string
  to: string
  condition?: boolean
  class?: string
  icon?: string
}

interface Props {
  items: MenuItem[]
}

const props = defineProps<Props>()

const filteredMenuItems = computed(() => props.items.filter((item) => item.condition !== false))

const scrollTo = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    Scroll.to(element)
  }
}
</script>
