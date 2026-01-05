export class SlugValidator {
  private static _slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

  public static validate(slug: string): boolean {
    if (!SlugValidator._slugRegex.test(slug)) {
      return false
    }
    return true
  }
}
