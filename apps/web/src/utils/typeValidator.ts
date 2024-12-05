export class TypeValidator {
  static isOfType<T>(value: any, interfaceObj: T): value is T {
    return Object.keys(interfaceObj as object).every((key) => key in value)
  }
}
