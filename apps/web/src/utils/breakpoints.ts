import { useBreakpoints } from '@vueuse/core'
import { BreakpointTypes } from '@/types'
export default class Breakpoint {
  private static readonly _breakpoints = useBreakpoints({
    xs: BreakpointTypes.xs,
    sm: BreakpointTypes.sm,
    md: BreakpointTypes.md,
    lg: BreakpointTypes.lg,
    xl: BreakpointTypes.xl
  })

  static getCurrentBreakpoint() {
    return this._breakpoints.active()
  }

  static isMobile() {
    const currentBreakpoint = this.getCurrentBreakpoint()
    return this._breakpoints.isSmaller('xs') || currentBreakpoint.value === 'xs'
  }
}
