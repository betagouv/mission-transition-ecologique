import { nafMapping } from '@tee/data/references'
import { Maybe } from 'true-myth'
import { NafMappingType } from '../../domain/spi'
import { CompanyActivityType } from '@tee/common'

export class NafJsonMapping implements NafMappingType {
  private _lastNafCode = ''
  private _lastNafData: NafData | undefined

  public getLabel(nafCode: string): Maybe<string> {
    const nafData = this._findNafData(nafCode)
    return Maybe.of(nafData?.label_vf)
  }

  public getSectionCode(nafCode: string): Maybe<string> {
    const nafData = this._findNafData(nafCode)
    return Maybe.of(nafData?.NIV1)
  }

  public searchNAF(searchTerm: string): CompanyActivityType[] {
    const normalizeString = (str: string) =>
      str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[-\s]/g, '')
        .trim()
    
    return nafMapping.filter((pair: { nom: string }) => {
      const normalizedCity = normalizeString(pair.nom)
      const normalizedSearch = normalizeString(searchValue)

      return normalizedCity.startsWith(normalizedSearch)
    })
  }

  private _findNafData(nafCode: string): NafData | undefined {
    if (this._lastNafCode !== nafCode) {
      this._lastNafCode = nafCode
      this._lastNafData = nafMapping.find((data: data) => data.NIV5 === nafCode)
    }
    return this._lastNafData
  }
}

type data = {
  tags: string[]
  tagsFr: string[]
  NIV5: string
  NIV4: string
  NIV3: string
  NIV2: string
  NIV1: string
  label_vf: string
}

interface NafData {
  NIV5: string
  NIV4: string
  NIV3: string
  NIV2: string
  NIV1: string
  label_vf: string
}
