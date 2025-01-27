import { communes } from '@tee/data/static'
import { Maybe } from 'true-myth'
import { CityToRegionMappingType } from '../../domain/spi'
import { Commune } from '@tee/common'
export class CityToRegionMapping implements CityToRegionMappingType {
  public getRegion(zipCode: string): Maybe<string> {
    const cityRegionPair = (communes as Commune[]).find((pair: { codesPostaux: string[]; region: { code: string; nom: string } }) =>
      pair.codesPostaux.includes(zipCode)
    )
    return Maybe.of(cityRegionPair?.region.nom)
  }
}
