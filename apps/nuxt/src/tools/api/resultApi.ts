import { NuxtError } from 'nuxt/app'
import { _AsyncData } from 'nuxt/dist/app/composables/asyncData'
import { DefaultAsyncDataErrorValue } from 'nuxt/dist/app/defaults'
import { Ref } from 'vue'

export class ResultApi<T> {
  private readonly _data: Ref<T | null>
  private readonly _error: Ref<DefaultAsyncDataErrorValue | NuxtError<unknown>>

  constructor(private _result: _AsyncData<T | null, NuxtError | null>) {
    this._data = this._result.data
    this._error = this._result.error
  }

  public get data() {
    return this._data.value
  }

  public get refData(): Ref<T | null> {
    return this._data
  }

  public get error(): DefaultAsyncDataErrorValue | NuxtError<unknown> {
    return this._error.value
  }

  public get refError(): Ref<DefaultAsyncDataErrorValue | NuxtError<unknown>> {
    return this._error
  }

  public isOk(): this is { data: T; error: null } {
    return this._data.value !== null && this._error.value === null
  }

  public isErr(): this is { error: NuxtError<unknown>; data: null } {
    return this._error.value !== null && this._data.value === null
  }

  public async refresh(): Promise<void> {
    await this._result.refresh()
  }

  public async execute(): Promise<void> {
    await this._result.execute()
  }

  public clear(): void {
    this._result.clear()
  }

  public get status(): string {
    return this._result.status.value
  }

  public get refStatus(): Ref<string> {
    return this._result.status
  }

  public get pending(): Ref<boolean> {
    return ref(this._result.status.value === 'pending')
  }
}
