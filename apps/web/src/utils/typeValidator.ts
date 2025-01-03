export class TypeValidator {
  static isOfType<T>(value: any, type: T): value is T {
    return Object.keys(type as object).every((key) => key in value)
  }
}
