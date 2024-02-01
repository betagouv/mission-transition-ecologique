import jsonMapping from '@tee/web/public/data/references/com_codes.json'
import { Maybe } from 'true-myth'

export class COG2023Mapping {
  public getRegion(cityCode: string): Maybe<string> {
    const cityRegionPair = jsonMapping.find((pair) => pair.COM === cityCode)
    return Maybe.of(cityRegionPair?.REGION)
  }
}
