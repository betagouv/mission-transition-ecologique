export class EmailValidator {
  static readonly validate = (email: string | undefined): boolean => {
    if (email === undefined) {
      return false
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}$/

    return emailRegex.test(email)
  }
}
