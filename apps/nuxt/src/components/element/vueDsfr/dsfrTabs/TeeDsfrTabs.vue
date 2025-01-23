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
              v-for="(tabTitle, index) in titles"
              :key="index"
              :icon="tabTitle.icon"
              :panel-id="tabTitle.panelId || `${getIdFromIndex(index)}-panel`"
              :tab-id="tabTitle.tabId || getIdFromIndex(index)"
              @click="activeTab = index"
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
      :panel-id="titles?.[index]?.panelId || `${getIdFromIndex(index)}-panel`"
      :tab-id="titles?.[index]?.tabId || getIdFromIndex(index)"
    >
      {{ tabContent }}
    </DsfrTabContent>

    <slot name="tab-content-header" />
    <!-- @slot Slot par défaut pour le contenu des onglets -->
    <slot />
  </div>
</template>
<script lang="ts" setup>
import { BreakpointNameType } from '@/types'
import Breakpoint from '@/tools/breakpoints'
import { DsfrTabItem, DsfrTabContent, type DsfrTabsProps, DsfrTabs, registerTabKey, useRandomId } from '@gouvminint/vue-dsfr'
import { DsfrTabItemProps } from '@gouvminint/vue-dsfr/types/components/DsfrTabs/DsfrTabs.types'

interface TitleTab {
  title: string
  size?: BreakpointNameType
}

export interface TeeDsfrTabsProps extends Omit<DsfrTabsProps, 'tabTitles'> {
  tabTitles?: (DsfrTabItemProps & { title: TitleTab[] })[]
}

const props = withDefaults(defineProps<TeeDsfrTabsProps>(), {
  tabContents: () => [],
  tabTitles: () => [],
  modelValue: 0
})

const emit = defineEmits<{ 'update:modelValue': [tabIndex: number] }>()

const asc = ref(false)
const activeTab = computed({
  get: () => props.modelValue,
  set(tabIndex: number) {
    emit('update:modelValue', tabIndex)
  }
})

const tabs = ref(new Map<number, string>())
const currentIndex = ref(0)
provide(registerTabKey, (tabId: Ref<string>) => {
  const asc = ref(true)
  watch(activeTab, (newIndex, lastIndex) => {
    asc.value = newIndex > lastIndex
  })

  if ([...tabs.value.values()].includes(tabId.value)) {
    return { isVisible: computed(() => tabs.value.get(activeTab.value) === tabId.value), asc }
  }
  const myIndex = currentIndex.value++
  tabs.value.set(myIndex, tabId.value)

  const isVisible = computed(() => myIndex === activeTab.value)

  watch(tabId, () => {
    tabs.value.set(myIndex, tabId.value)
  })

  onUnmounted(() => {
    tabs.value.delete(myIndex)
  })

  return { isVisible }
})

const $el = ref<HTMLElement | null>(null)
const tablist = ref<HTMLUListElement | null>(null)

const generatedIds: Record<string, string> = reactive({})
const getIdFromIndex = (idx: number) => {
  if (generatedIds[idx]) {
    return generatedIds[idx]
  }
  const id = useRandomId('tab')
  generatedIds[idx] = id
  return id
}

const selectPrevious = async () => {
  const newIndex = activeTab.value === 0 ? props.tabTitles.length - 1 : activeTab.value - 1
  asc.value = false
  activeTab.value = newIndex
}
const selectNext = async () => {
  const newIndex = activeTab.value === props.tabTitles.length - 1 ? 0 : activeTab.value + 1
  asc.value = true
  activeTab.value = newIndex
}
const selectFirst = async () => {
  activeTab.value = 0
}
const selectLast = async () => {
  activeTab.value = props.tabTitles.length - 1
}

const dsfrTabs = ref<InstanceType<typeof DsfrTabs> | null>(null)
/*
 * Use metgods from DsfrTabs component to render tabs which are exposed
 */
const renderTabs = () => {
  dsfrTabs.value?.renderTabs()
}

const resizeObserver = ref<ResizeObserver | null>(null)

const titles = computed(() => {
  const filteredTitles =
    props.tabTitles?.map((tab) => {
      return {
        ...tab,
        title: tab.title
          .filter((titleItem) => {
            return (titleItem.size && Breakpoint.isLargerOrEqual(titleItem.size)) || (!titleItem.size && Breakpoint.isMobile())
          })
          .find(() => true)?.title
      }
    }) || []
  return filteredTitles.flat()
})

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
  selectFirst,
  selectLast
})
</script>
