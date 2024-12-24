import { NuxtError } from 'nuxt/app'
import { DefaultAsyncDataErrorValue } from 'nuxt/dist/app/defaults'
import { Ref } from 'vue'

export class ResultApi<T> {
  private readonly _data: Ref<T | null>
  private readonly _error: Ref<DefaultAsyncDataErrorValue | NuxtError<unknown>> | null

  constructor(data: Ref<T | null>, error: Ref<NuxtError<unknown> | DefaultAsyncDataErrorValue> | null) {
    this._data = data
    this._error = error
  }

  public get data() {
    return this._data.value
  }

  public get refData(): Ref<T | null> {
    return this._data
  }

  public get error(): DefaultAsyncDataErrorValue | NuxtError<unknown> | null {
    if (this._error === null) {
      return null
    }

    return this._error.value
  }

  public get refError(): Ref<DefaultAsyncDataErrorValue | NuxtError<unknown>> | null {
    return this._error
  }

  public isOk(): this is { data: T; error: null } {
    return this._data.value !== null && (this._error === null || this._error.value === null)
  }

  public isErr(): this is { error: NuxtError<unknown>; data: null } {
    return this._error !== null && this._error.value !== null && this._data.value === null
  }
}
