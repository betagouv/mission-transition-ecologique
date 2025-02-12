import { ProgramAidType, ProgramData } from '@/types'

export class ProgramSorter {
  static byFinanceAidType(programs: ProgramData[]) {
    return programs.slice().sort((a, b) => {
      const aidKey = "nature de l'aide"
      switch (true) {
        case a[aidKey] === ProgramAidType.fund && a[aidKey] !== b[aidKey]:
        case a[aidKey] === ProgramAidType.loan && b[aidKey] !== ProgramAidType.fund:
          return -1
        case a[aidKey] === b[aidKey]:
          return a.titre.localeCompare(b.titre)
        default:
          return 1
      }
    })
  }
}
