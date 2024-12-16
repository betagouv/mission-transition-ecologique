import { ErrorJSON, Monitor, StatisticsService } from '@tee/backend-ddd'
import { Controller, Get, Res, Route, SuccessResponse, Tags, TsoaResponse } from 'tsoa'
import { StatsData } from '@tee/common'
import { PosthogUpdater } from '@tee/data'

@SuccessResponse('200', 'OK')
@Route('statistics')
@Tags('statistics')
export class StatisticsController extends Controller {
  /**
   * Request statistics about the opportunities and programs
   */
  @Get()
  public async get(@Res() requestFailedResponse: TsoaResponse<500, ErrorJSON>): Promise<StatsData> {
    const statisticsResult = await new StatisticsService().get()

    if (statisticsResult.isErr) {
      const err = statisticsResult.error
      Monitor.error('Error in get statistics', { error: statisticsResult.error })

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return requestFailedResponse(500, { message: `Server internal error: ${err.message}` })
    }

    return statisticsResult.value
  }

  /**
   * Update PostHog data
   */
  @Get('/update_posthog_data')
  public async updatePosthogData(@Res() requestFailedResponse: TsoaResponse<500, ErrorJSON>): Promise<string> {
    try {
      const updater = PosthogUpdater.getInstance()
      return updater.updatePosthogData()
    } catch (error) {
      Monitor.error('Error during the data update', { error })
      return requestFailedResponse(500, { message: `Server internal error: ${error}` })
    }
  }
}
