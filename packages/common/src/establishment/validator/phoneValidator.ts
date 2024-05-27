export default class PhoneValidator {
  static readonly validate = (phone: string): boolean => {
    const phoneRegex: RegExp = /^[+]?\d{0,3}\(?\d{1,3}\)?\d{6,15}$/
    phone = phone.replace(/\s/g, '') // Remove spaces

    return phoneRegex.test(phone) && phone.length >= 10
  }
}
