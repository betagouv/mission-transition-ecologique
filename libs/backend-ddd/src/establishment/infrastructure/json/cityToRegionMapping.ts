import { communes } from '@tee/data/references'
import { Maybe } from 'true-myth'
import { CityToRegionMappingType } from '../../domain/spi'
import { Commune } from '@tee/common'
export class CityToRegionMapping implements CityToRegionMappingType {
  public getRegion(cityCode: string): Maybe<string> {
    const cityRegionPair = (communes as Commune[]).find(
      (pair: { code: string; region: { code: string; nom: string } }) => pair.code === cityCode
    )
    return Maybe.of(cityRegionPair?.region.nom)
  }
}
