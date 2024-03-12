import Engine from 'publicodes'
import { evaluateRule } from './publicodes'
import { Result } from 'true-myth'
import { ensureError } from '../../common/domain/error/errors'
import { Program, QuestionnaireData } from '../domain/types'

export class PublicodesService {
  private readonly _publicodeEngines: Record<string, Engine>

  constructor(programs: Program[]) {
    const engines = programs.reduce(
      (accu, program) => {
        const engineResult = initializePublicodesEngine(program.publicodes as object)

        if (engineResult.isErr) {
          throw engineResult.error
        }
        accu[program.id] = engineResult.value
        return accu
      },
      {} as Record<string, Engine>
    )

    this._publicodeEngines = engines
  }

  public evaluate(
    rule: string,
    program: Program,
    questionnaireData: QuestionnaireData,
    currentDate: string
  ): Result<boolean | undefined, Error> {
    const engine = this._publicodeEngines[program.id]
    if (!engine) {
      return Result.err(
        new Error(`Trying to evaluate a rule on a program for
      which the publicodes engine has not been initialized : ${program.id}`)
      )
    }
    return evaluateRule(rule, engine, program, questionnaireData, currentDate)
  }
}

const initializePublicodesEngine = (rules: object): Result<Engine, Error> => {
  let engine: Engine
  try {
    engine = new Engine(rules)
  } catch (e) {
    const err = ensureError(e)
    return Result.err(err)
  }

  return Result.ok(engine)
}
