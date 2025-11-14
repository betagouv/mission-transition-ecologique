import Engine from 'publicodes'
import { evaluateRule } from './publicodes'
import { Result } from 'true-myth'
import { ensureError } from '../../common/domain/error/errors'
import { ProgramEligibility, ProgramEligibilityStatus, ProgramType, ProgramTypeWithEligibility } from '@tee/data'
import { QuestionnaireData } from '@tee/common'
import { EligibilityEvaluator } from '../domain/spi'

export class PublicodesService implements EligibilityEvaluator {
  private static instance: PublicodesService

  private readonly _publicodeEngines: Record<string, Engine>

  private constructor(programs: ProgramType[]) {
    this._publicodeEngines = initializePublicodesEngineForAllPrograms(programs)
  }

  public static init(programs: ProgramType[]): void {
    PublicodesService.instance = new PublicodesService(programs)
  }

  public static getInstance(): PublicodesService {
    return PublicodesService.instance
  }

  public evaluate(program: ProgramType, questionnaireData: QuestionnaireData): Result<ProgramTypeWithEligibility, Error> {
    const evaluation = this.evaluation(program, questionnaireData)

    if (evaluation.isErr) {
      return Result.err(evaluation.error)
    }

    // since publicodes return a single boolean or undefined value and we want to know if ineligible programs
    // are ineligible because of the questionnaireData or because of their EOL, we need another publicodes evaluation for this specific question
    const dateEvaluation = this.evaluation(program, {})
    if (dateEvaluation.isErr) {
      return Result.err(dateEvaluation.error)
    }

    return Result.ok(this._setEligibility(program, evaluation.value, dateEvaluation.value))
  }

  protected evaluation(program: ProgramType, questionnaireData: QuestionnaireData): Result<boolean | undefined, Error> {
    const rule = 'entreprise . est ciblée'
    const currentDate = this._getCurrentDate()

    const engine = this._publicodeEngines[program.id]
    if (!engine) {
      return Result.err(
        new Error(`Trying to evaluate a rule on a program for
      which the publicodes engine has not been initialized : ${program.id}`)
      )
    }

    return evaluateRule(rule, engine, program, questionnaireData, currentDate)
  }

  private _getCurrentDate = () => {
    return new Date().toLocaleDateString('fr-FR')
  }

  private _setEligibility(
    program: ProgramType,
    evaluationValue: boolean | undefined,
    dateEvaluation: boolean | undefined
  ): ProgramTypeWithEligibility {
    let eligibility: ProgramEligibilityStatus

    if (dateEvaluation === false) {
      eligibility = ProgramEligibilityStatus.ProgramEol
      return { ...program, eligibility }
    }

    const isEligible = typeof evaluationValue === 'undefined' || evaluationValue
    // if (typeof evaluationValue === 'undefined') {
    //   eligibility = ProgramEligibilityStatus.Unknown
    // }
    // TODO, analyse the undefined returns from publicodes
    // there are a dozen of programs that return 'undefined' values.
    if (isEligible) {
      eligibility = ProgramEligibility.isPartiallyEligible(program)
        ? ProgramEligibilityStatus.PartiallyEligible
        : ProgramEligibilityStatus.Eligible
    } else {
      eligibility = ProgramEligibilityStatus.NotEligible
    }

    return { ...program, eligibility }
  }
}

const initializePublicodesEngineForAllPrograms = (programs: ProgramType[]): Record<string, Engine> => {
  return programs.reduce(
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
}

const initializePublicodesEngine = (rules: object): Result<Engine, Error> => {
  let engine: Engine
  try {
    engine = new Engine(rules, { strict: { noOrphanRule: false } })
  } catch (e) {
    const err = ensureError(e)
    return Result.err(err)
  }

  return Result.ok(engine)
}
