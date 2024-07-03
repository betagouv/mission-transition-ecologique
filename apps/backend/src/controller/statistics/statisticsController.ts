import { ErrorJSON, StatisticsService } from '@tee/backend-ddd'
import { Controller, Get, Res, Route, SuccessResponse, TsoaResponse } from 'tsoa'
import { StatsData } from '@tee/common'
import * as Sentry from '@sentry/node'

@SuccessResponse('200', 'OK')
@Route('statistics')
export class StatisticsController extends Controller {
  /**
   * Request statistics about the opportunities and programs
   */
  @Get()
  public async get(@Res() requestFailedResponse: TsoaResponse<500, ErrorJSON>): Promise<StatsData> {
    const statisticsResult = await new StatisticsService().get()

    if (statisticsResult.isErr) {
      const err = statisticsResult.error
      Sentry.captureMessage('Error in get statistics, ' + statisticsResult.error, 'error')

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return requestFailedResponse(500, { message: `Server internal error: ${err.message}` })
    }

    return statisticsResult.value
  }
}
