import { CounterAnimation } from '@/tools/counterAnimation'
import { useCompanyDataStore } from '@/stores/companyData'

/**
 * Composable to manage the programs counter animation
 * Automatically synchronizes the counter with the number of filtered programs
 */
export function useCounterProgramsAnimation() {
  const { isDataFull, hasAnimationDone } = storeToRefs(useCompanyDataStore())
  const { programs } = storeToRefs(useProgramStore())

  const animatedCount = ref(0)
  const counterAnimation = new CounterAnimation((value) => {
    animatedCount.value = value
  })

  // Cleanup on unmount
  onUnmounted(() => {
    counterAnimation.destroy()
  })

  // Watch programs count: animate the counter
  watch(
    () => programs.value.length,
    (countPrograms) => {
      if (countPrograms === 0 || !isDataFull.value) {
        counterAnimation.reset()
      } else if (!hasAnimationDone.value) {
        counterAnimation.animateTo(countPrograms)
        hasAnimationDone.value = true
      } else {
        animatedCount.value = countPrograms
      }
    },
    { immediate: true }
  )

  return {
    animatedCount: readonly(animatedCount)
  }
}
