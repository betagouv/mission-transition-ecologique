/**
 * Manages counter animation (rolling number effect)
 */
export class CounterAnimation {
  private _currentValue = 0
  private _targetValue = 0
  private _timer: ReturnType<typeof setInterval> | null = null
  private readonly _duration: number
  private readonly _steps: number
  private readonly _onUpdate: (value: number) => void

  /**
   * @param onUpdate - Callback called on each value update
   * @param duration - Total animation duration in ms (default: 1500ms)
   * @param steps - Number of steps for the animation (default: 60)
   */
  constructor(onUpdate: (value: number) => void, duration = 1000, steps = 60) {
    this._onUpdate = onUpdate
    this._duration = duration
    this._steps = steps
  }

  /**
   * Starts the animation to a new target value
   * @param target - Target value to reach
   */
  animateTo(target: number): void {
    // Clean up the previous animation if it exists
    this.stop()

    this._targetValue = target

    // If target is 0, update immediately
    if (target === 0) {
      this._currentValue = 0
      this._onUpdate(0)
      return
    }

    const stepDuration = this._duration / this._steps
    const increment = this._targetValue / this._steps

    let currentStep = 0

    this._timer = setInterval(() => {
      currentStep++

      if (currentStep >= this._steps) {
        this._currentValue = this._targetValue
        this._onUpdate(this._targetValue)
        this.stop()
      } else {
        this._currentValue = Math.floor(increment * currentStep)
        this._onUpdate(this._currentValue)
      }
    }, stepDuration)
  }

  /**
   * Stops the current animation
   */
  stop(): void {
    if (this._timer) {
      clearInterval(this._timer)
      this._timer = null
    }
  }

  /**
   * Resets the counter to 0 without animation
   */
  reset(): void {
    this.stop()
    this._currentValue = 0
    this._targetValue = 0
    this._onUpdate(0)
  }

  /**
   * Gets the current counter value
   */
  getCurrentValue(): number {
    return this._currentValue
  }

  /**
   * Cleans up resources (to be called on unmount)
   */
  destroy(): void {
    this.stop()
  }
}
