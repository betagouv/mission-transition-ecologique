export class SlugValidator {
  private static slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

  public static validate(slug: string): boolean {
    if (!SlugValidator.slugRegex.test(slug)) {
      return false
    }
    return true
  }
}
