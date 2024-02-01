import jsonMapping from '@tee/data/references/regionMapping.json'
import { Maybe } from 'true-myth'

export class COG2023Mapping {
  public getRegion(cityCode: string): Maybe<string> {
    const cityRegionPair = jsonMapping.find((pair) => pair.COM === cityCode)
    return Maybe.of(cityRegionPair?.REGION)
  }
}
