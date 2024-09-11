<template>
  <div
    ref="$el"
    class="fr-tabs"
  >
    <div class="fr-container">
      <div class="fr-col-12 fr-col-md-10 fr-col-offset-md-2">
        <ul
          ref="tablist"
          class="fr-tabs__list fr-px-0"
          role="tablist"
          :aria-label="tabListName"
        >
          <!-- @slot Slot nommé `tab-items` pour y mettre des Titres d’onglets personnalisés. S’il est rempli, la props `tabTitles° n’aura aucun effet -->
          <slot name="tab-items">
            <DsfrTabItem
              v-for="(tabTitle, index) in tabTitles"
              :key="index"
              :icon="tabTitle.icon"
              :panel-id="tabTitle.panelId || `${getIdFromIndex(index)}-panel`"
              :tab-id="tabTitle.tabId || getIdFromIndex(index)"
              :selected="selected === index"
              @click="selectIndex(index)"
              @next="selectNext()"
              @previous="selectPrevious()"
              @first="selectFirst()"
              @last="selectLast()"
            >
              {{ tabTitle.title }}
            </DsfrTabItem>
          </slot>
        </ul>
      </div>
    </div>

    <DsfrTabContent
      v-for="(tabContent, index) in tabContents"
      :key="index"
      :panel-id="tabTitles?.[index]?.panelId || `${getIdFromIndex(index)}-panel`"
      :tab-id="tabTitles?.[index]?.tabId || getIdFromIndex(index)"
      :selected="selected === index"
      :asc="ascendant"
    >
      <p>
        {{ tabContent }}
      </p>
    </DsfrTabContent>

    <slot name="tab-content-header" />
    <!-- @slot Slot par défaut pour le contenu des onglets -->
    <slot />
  </div>
</template>
<script lang="ts" setup>
import { BreakpointNameType } from '@/types'
import { DsfrTabItem, DsfrTabContent, type DsfrTabsProps, getRandomId, DsfrTabs } from '@gouvminint/vue-dsfr'

export interface TeeDsfrTabs extends Omit<DsfrTabsProps, 'tabTitles'> {
  tabTitles?: (Omit<DsfrTabsProps['tabTitles'][number], 'title'> & { title: string | { title: string; size?: BreakpointNameType }[] })[]
}

const props = withDefaults(defineProps<TeeDsfrTabs>(), {
  tabContents: () => [],
  tabTitles: () => [],
  initialSelectedIndex: 0,
  tabListName: ''
})

const { ascendant, selected } = useTabs(true, props.initialSelectedIndex || 0)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emit = defineEmits<{ (e: 'selectTab', payload: number): void }>()

const dsfrTabs = ref<InstanceType<typeof DsfrTabs> | null>(null)
const generatedIds: Record<string, string> = reactive({})
const resizeObserver = ref<ResizeObserver | null>(null)
const $el = ref<HTMLElement | null>(null)
const tablist = ref<HTMLUListElement | null>(null)

/*
 * Need to reimplement tab-height calc
 * @see https://github.com/GouvernementFR/dsfr/blob/main/src/component/tab/script/tab/tabs-group.js#L117
 */
const renderTabs = () => {
  dsfrTabs.value?.renderTabs()
}

const getIdFromIndex = (idx: number) => {
  if (generatedIds[idx]) {
    return generatedIds[idx]
  }
  const id = getRandomId('tab')
  generatedIds[idx] = id
  return id
}

const scrollToTabItem = (idx: number, previousIdx: number) => {
  const parent = tablist.value

  if (!parent) {
    return
  }

  const previousTab = parent.children[previousIdx] as HTMLElement

  if (idx > previousIdx) {
    parent.scrollLeft += previousTab.offsetWidth
  } else {
    parent.scrollLeft -= previousTab.offsetWidth
  }
}
const selectIndex = (idx: number) => {
  const previousIdx = selected.value
  ascendant.value = idx > selected.value
  selected.value = idx
  scrollToTabItem(idx, previousIdx)
  emit('selectTab', idx)
}
const selectPrevious = () => {
  const newIndex = selected.value === 0 ? props.tabTitles.length - 1 : selected.value - 1
  selectIndex(newIndex)
}
const selectNext = () => {
  const newIndex = selected.value === props.tabTitles.length - 1 ? 0 : selected.value + 1
  selectIndex(newIndex)
}
const selectFirst = () => {
  selectIndex(0)
}
const selectLast = () => {
  selectIndex(props.tabTitles.length - 1)
}

onMounted(() => {
  /*
   * Need to use a resize-observer as tab-content height can
   * change according to its inner components.
   */
  if (window.ResizeObserver) {
    resizeObserver.value = new window.ResizeObserver(() => {
      renderTabs()
    })
  }

  $el.value?.querySelectorAll('.fr-tabs__panel').forEach((element) => {
    if (element) {
      resizeObserver.value?.observe(element)
    }
  })
})

onUnmounted(() => {
  $el.value?.querySelectorAll('.fr-tabs__panel').forEach((element) => {
    if (element) {
      resizeObserver.value?.unobserve(element)
    }
  })
})

defineExpose({
  renderTabs,
  selectIndex,
  selectFirst,
  selectLast
})
</script>
