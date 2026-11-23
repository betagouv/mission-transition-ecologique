import ConfigBaserow from '../../config/configBaserow'
import { AdemeTheme } from '../../ademeTheme/types/domain'
import { AbstractBaserow } from './abstractBaserow'
import { BaserowAdemeTheme } from './types'

export class AdemeThemeBaserow extends AbstractBaserow {
  async getAll(): Promise<AdemeTheme[]> {
    const baserowThemes = await this._getTableData<BaserowAdemeTheme>(ConfigBaserow.ADEME_THEME_ID)
    return baserowThemes.map((theme) => AdemeThemeBaserow.convertToDomain(theme))
  }

  static convertToDomain(baserowTheme: BaserowAdemeTheme): AdemeTheme {
    const parentCode = baserowTheme.CODE_PERE?.trim()
    return {
      id: baserowTheme.id,
      code: baserowTheme.CODE?.trim() ?? '',
      parentCode: parentCode ? parentCode : null,
      label: baserowTheme.LIBELLE?.trim() ?? ''
    }
  }
}
