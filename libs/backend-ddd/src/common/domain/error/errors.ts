import { AxiosError } from 'axios'
import ServiceNotFoundError from '../api/serviceNotFoundError'

/**
 * Returns a value if it is an Error, or encapsulates it inside an Error otherwise
 *
 * Javascript `throw` keyword can throw anything, not only errors, most of the time we
 * however expect errors when we use `try/catch`.
 *
 * This function helps to ensure that the `catch`ed object is indeed an error.
 *
 * @arg value - expected to be an error, e.g. retrieved with the `catch` keyword.
 */
export function ensureError(value: unknown): Error {
  if (value instanceof Error) {
    return value
  }

  let stringified = '[Unable to stringify the thrown value]'
  try {
    stringified = JSON.stringify(value)
  } catch {
    // Do nothing
  }

  return new Error(`This value was thrown as is, not through an Error: ${stringified}`)
}

export function handleException(exception: unknown): Error {
  const error = ensureError(exception)

  if (error instanceof AxiosError) {
    if (error.response && error.response.status == 404) {
      return new ServiceNotFoundError(error.message)
    }
  }

  return error
}
