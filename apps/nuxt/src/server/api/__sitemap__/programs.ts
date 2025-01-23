import { SitemapUrlInput } from '#sitemap/types'
import { RoutePath, ChangeFreq, Priority, ProgramType } from '@/types'
import { ProgramService } from '@tee/backend-ddd'
import { UrlBuilder } from '~/server/utils/UrlBuilder'

export default defineSitemapEventHandler(async () => {
  ProgramService.init()
  const service = new ProgramService()

  const programsIds = service.getAll().map((program: ProgramType) => program.id)
  const activeProgramsResult = service.getFilteredPrograms({})
  const activeProgramsIds = activeProgramsResult.isOk ? activeProgramsResult.value.map((program: ProgramType) => program.id) : []

  const urls: SitemapUrlInput[] = []
  for (const programId of programsIds) {
    const isActive = activeProgramsIds.includes(programId)
    const url = UrlBuilder.params(RoutePath.CatalogProgramDetail, { programId: programId })
    urls.push({
      loc: url,
      priority: isActive ? Priority.MidHigh : Priority.Null,
      changefreq: ChangeFreq.Monthly
    })
  }

  return urls
})
