import { regionMapping } from '@tee/data/references'
import { Maybe } from 'true-myth'
import { CityToRegionMapping } from '../../domain/spi'

export class COG2023Mapping implements CityToRegionMapping {
  public getRegion(cityCode: string): Maybe<string> {
    const cityRegionPair = regionMapping.find(
      (pair: { COM: string; REGION: string } | { COM: string; REGION: null }) => pair.COM === cityCode
    )
    return Maybe.of(cityRegionPair?.REGION)
  }
}
