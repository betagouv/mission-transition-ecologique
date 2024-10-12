import { useBreakpoints } from '@vueuse/core'
import { BreakpointNameType, BreakpointSizeTypes } from '@/types'
export default class Breakpoint {
  private static readonly _breakpoints = useBreakpoints({
    [BreakpointNameType.xs]: BreakpointSizeTypes.xs,
    [BreakpointNameType.sm]: BreakpointSizeTypes.sm,
    [BreakpointNameType.md]: BreakpointSizeTypes.md,
    [BreakpointNameType.lg]: BreakpointSizeTypes.lg,
    [BreakpointNameType.xl]: BreakpointSizeTypes.xl
  })

  static getCurrentBreakpoint() {
    return this._breakpoints.active()
  }

  static isLargerOrEqual(size: BreakpointNameType) {
    const currentBreakpoint = this.getCurrentBreakpoint()
    return currentBreakpoint.value === size || this._breakpoints.isGreater(size)
  }

  static isMobile() {
    const currentBreakpoint = this.getCurrentBreakpoint()
    return currentBreakpoint.value === BreakpointNameType.xs
  }
}
