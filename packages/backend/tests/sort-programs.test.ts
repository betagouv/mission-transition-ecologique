import { sortPrograms } from '@tee/backend/src/domain/sort-programs'
import { ProgramData } from '@tee/web/src/types'
import { makeProgram } from './testing'

describe(`
 GIVEN a list of programs
  WHEN sorting the programs
EXPECT that the programs respect a set of given rules
`, () => {
  test('', () => {
    const programs: ProgramData[] = []
    expect(sortPrograms(programs)).toHaveLength(0)

    const program = makeProgram('')
    const programs2: ProgramData[] = [program]
    expect(sortPrograms(programs2)[0]).toBe(program)
  })
})
