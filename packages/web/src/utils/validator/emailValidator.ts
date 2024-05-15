export default class EmailValidator {
  static readonly validateEmail = (email: string): boolean => {
    const emailRegex: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/

    return emailRegex.test(email)
  }
}
