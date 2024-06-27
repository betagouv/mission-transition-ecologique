export class PhoneValidator {
  static readonly validate = (phone: string | undefined): boolean => {
    if (phone === undefined) {
      return false
    }

    const phoneRegex = /^[+]?\d{0,3}\(?\d{1,3}\)?\d{6,15}$/
    phone = phone.replace(/\s/g, '') // Remove spaces

    return phoneRegex.test(phone) && phone.length >= 10
  }
}
