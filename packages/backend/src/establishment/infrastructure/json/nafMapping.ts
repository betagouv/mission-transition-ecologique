import nafMapping from '@tee/data/references/nafMapping.json'
import { Maybe } from 'true-myth'

export class NAF_JSONMapping {
  private _lastNafCode: string = ''
  private _lastNafData: NafData | undefined

  public getLabel(nafCode: string): Maybe<string> {
    const nafData = this._findNafData(nafCode)
    return Maybe.of(nafData?.label_vf)
  }

  public getSectionCode(nafCode: string): Maybe<string> {
    const nafData = this._findNafData(nafCode)
    return Maybe.of(nafData?.NIV1)
  }

  private _findNafData(nafCode: string): NafData | undefined {
    if (this._lastNafCode !== nafCode) {
      this._lastNafCode = nafCode
      this._lastNafData = nafMapping.find((data) => data.NIV5 === nafCode)
    }
    return this._lastNafData
  }
}

interface NafData {
  NIV5: string
  NIV4: string
  NIV3: string
  NIV2: string
  NIV1: string
  label_vf: string
}
