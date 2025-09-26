import { Id, LinkObject } from './types'

export class ReplacerBaserow {
  static replaceLinkObjectByTableData<T extends Id, O extends boolean = false>(
    links: LinkObject[],
    referencedTableData: T[],
    one?: O
  ): O extends true ? T | undefined : T[] {
    if (!links) {
      return (one ? undefined : []) as O extends true ? T | undefined : T[]
    }

    const tableData = links.map((link) => referencedTableData.find((object) => link.id === object.id))

    if (tableData.includes(undefined)) {
      console.warn("warning, a baserow link isn't defined, it should never happen", links)
    }

    const filtered = tableData.filter((item) => item !== undefined) as T[]
    return (one ? filtered[0] : filtered) as O extends true ? T | undefined : T[]
  }

  static replaceLinkObjectByValue<T = string>(linkObject: LinkObject | undefined | null): T | undefined {
    return linkObject ? (linkObject.value as T) : undefined
  }
}
