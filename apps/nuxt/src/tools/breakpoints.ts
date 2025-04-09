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
    try {
      return this._breakpoints.active().value
    } catch {
      return BreakpointSizeTypes.md
    }
  }

  static isLargerOrEqual(size: BreakpointNameType) {
    const currentBreakpoint = this.getCurrentBreakpoint()
    return currentBreakpoint && (currentBreakpoint === size || this._breakpoints.isGreater(size))
  }

  static isSmallerOrEqual(size: BreakpointNameType) {
    const currentBreakpoint = this.getCurrentBreakpoint()
    return currentBreakpoint && (currentBreakpoint === size || this._breakpoints.isSmaller(size))
  }

  static isMobile() {
    const currentBreakpoint = this.getCurrentBreakpoint()
    return currentBreakpoint && currentBreakpoint === BreakpointNameType.xs
  }

  static isSmallScreen() {
    const currentBreakpoint = this.getCurrentBreakpoint()
    return (
      currentBreakpoint &&
      [BreakpointNameType.xs, BreakpointNameType.sm, BreakpointNameType.md].includes(currentBreakpoint as BreakpointNameType)
    )
  }
}
