export default class Format {
  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  static truncate(str: string, maxlength: number): string {
    return str.length > maxlength ? str.slice(0, maxlength - 1) + '…' : str
  }
}
