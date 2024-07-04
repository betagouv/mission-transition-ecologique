export default class CustomError extends Error {
  constructor(...args: Array<string>) {
    super(...args)
    this.name = this.constructor.name
    Error.captureStackTrace(this, CustomError)
  }
}
