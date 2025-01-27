import { nafMapping } from '@tee/data/static'
import { Maybe } from 'true-myth'
import { NafRepository as NafRepositoryType } from '../../domain/spi'
import { CompanyActivityType, NAF1 } from '@tee/common'
import { Result } from 'true-myth'
import { normalizeString } from '../../../common/string'

export class NafRepository implements NafRepositoryType {
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

  public searchNAF(searchTerm: string): Result<CompanyActivityType[], Error> {
    let results = []
    const normalizedSearch = normalizeString(searchTerm)
    if (normalizedSearch === '') {
      results = nafMapping
    } else {
      const regex = /^\d{1,2}(\.?(\d{1,2}[A-Z]?)?)?$/
      const isSearchByNAfCode = regex.test(searchTerm)
      if (isSearchByNAfCode) {
        results = nafMapping.filter((pair: { NIV5: string }) => normalizeString(pair.NIV5).startsWith(normalizedSearch))
      } else if (searchTerm.length === 1) {
        results = nafMapping.filter((pair: { NIV1: string }) => normalizeString(pair.NIV1) === normalizedSearch)
      } else {
        results = nafMapping.filter((pair: { label_vf: string }) => normalizeString(pair.label_vf).includes(normalizedSearch))
      }
    }
    return Result.ok(
      results
        .sort((a: { label_vf: string }, b: { label_vf: string }) => a.label_vf.localeCompare(b.label_vf))
        .map((result) => ({ secteur: result.label_vf, codeNAF: result.NIV5, codeNAF1: result.NIV1 as NAF1 }))
    )
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
