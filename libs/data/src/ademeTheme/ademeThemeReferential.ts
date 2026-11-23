import { AdemeTheme, AdemeThemeReferentialEntry } from './types/domain'

export class AdemeThemeReferential {
  // Keeps the themes with a code, without duplicates, sorted by code so that parents come before their children
  static build(themes: AdemeTheme[]): AdemeThemeReferentialEntry[] {
    const entries = new Map<string, AdemeThemeReferentialEntry>()

    for (const { code, parentCode, label } of themes) {
      if (code && !entries.has(code)) {
        entries.set(code, { code, parentCode, label })
      }
    }

    return [...entries.values()].sort((a, b) => a.code.localeCompare(b.code))
  }
}
