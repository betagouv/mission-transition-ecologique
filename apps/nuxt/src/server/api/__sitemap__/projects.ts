import { SitemapUrlInput } from '#sitemap/types'
import { RoutePath } from '@/types'
import { UrlBuilder } from '~/server/utils/UrlBuilder'
import ProjectApi from '~/service/api/projectApi'
import { ChangeFreq, Priority } from '~/types/sitemapType'

export default defineSitemapEventHandler(async () => {
  const urls: SitemapUrlInput[] = []

  const projects = await new ProjectApi().get()
  if (projects.isOk) {
    for (const project of projects.value) {
      const url = UrlBuilder.params(RoutePath.CatalogProjectDetail, { projectSlug: project.slug })
      urls.push({
        loc: url,
        priority: Priority.MidHigh,
        changefreq: ChangeFreq.Monthly
      })
    }
  }

  return urls
})
