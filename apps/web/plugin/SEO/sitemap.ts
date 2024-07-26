import { ProgramService } from '@tee/backend-ddd'
import dotenv from 'dotenv'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { ChangeFreq, type PathSettings, Priority } from './type'
import { ProgramType, Project } from '@tee/data'
import { projects } from '@tee/data/static'

const specificPathSettings: PathSettings[] = [
  { path: '/', changeFreq: ChangeFreq.Weekly, priority: Priority.Highest },
  { path: '/questionnaire', changeFreq: ChangeFreq.Monthly, priority: Priority.Null },
  { path: '/ajouter-une-aide-entreprises', changeFreq: ChangeFreq.Monthly, priority: Priority.Null },
  { path: '/accessibilite', changeFreq: ChangeFreq.Monthly, priority: Priority.Low },
  { path: '/mentions-legales', changeFreq: ChangeFreq.Monthly, priority: Priority.Low },
  { path: '/donnees-personnelles', changeFreq: ChangeFreq.Monthly, priority: Priority.Low }
]
const exclusionPaths = ['/:pathMatch(.*)*']

function invalidPath(path: string): boolean {
  if (exclusionPaths.includes(path)) return true

  return path[0] != '/'
}

function generateOnePathXML(path: string, changeFreq: ChangeFreq, priority: Priority): string {
  const lastModified = new Date().toISOString()
  dotenv.config()
  const VITE_DEPLOY_URL = process.env['VITE_DEPLOY_URL']

  return `  <url>
    <loc>${encodeURI(VITE_DEPLOY_URL + path)}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${changeFreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

function generateStaticSitemap(): string | undefined {
  const staticRoutesFilePath = resolve(process.cwd(), 'src', 'router', 'routes.ts')
  const staticRoutesContent = readFileSync(staticRoutesFilePath, 'utf8')
  const regexMatches: RegExpMatchArray | null = staticRoutesContent.match(/path: '(.*)'/g)
  const staticPaths = regexMatches?.map((match) => match.slice(7, -1))

  const urlElements = staticPaths
    ?.map((path) => {
      if (invalidPath(path)) {
        return null
      } else {
        const specificPathSetting = specificPathSettings.find((specificPath) => specificPath.path === path)
        if (specificPathSetting) {
          return generateOnePathXML(path, specificPathSetting.changeFreq, specificPathSetting.priority)
        } else {
          return generateOnePathXML(path, ChangeFreq.Monthly, Priority.Mid)
        }
      }
    })
    .filter((element) => element !== null)
    .join('\n')
  return urlElements
}

function generateProgramSitemap(): string | undefined {
  ProgramService.init()
  const service = new ProgramService()

  const allProgramsIds = service.getAll().map((program: ProgramType) => program.id)
  const activeProgramsResult = service.getFilteredPrograms({})
  if (activeProgramsResult.isErr) {
    throw activeProgramsResult.error
  }
  const activeProgramsIds = activeProgramsResult.value.map((p: ProgramType) => p.id)

  return allProgramsIds
    .map((id: string) => {
      if (activeProgramsIds.includes(id)) {
        return generateOnePathXML('/aides-entreprise/' + id, ChangeFreq.Monthly, Priority.MidHigh)
      } else {
        return generateOnePathXML('/aides-entreprise/' + id, ChangeFreq.Monthly, Priority.Null)
      }
    })
    .join('\n')
}

function generateProjectSitemap(): string | undefined {
  return projects
    .map((project: Project) => {
      return generateOnePathXML('/projets-entreprise/' + project.slug, ChangeFreq.Monthly, Priority.MidHigh)
    })
    .join('\n')
}

function generateSitemapXML(): string {
  const staticElements = generateStaticSitemap()
  const programElements = generateProgramSitemap()
  const projectElements = generateProjectSitemap()

  return `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticElements + '\n' + programElements + '\n' + projectElements}
</urlset>`
}

export default function generateSitemap() {
  const sitemapXML = generateSitemapXML()
  const inFilePath = resolve(process.cwd(), 'public', 'sitemap.placeholder.xml')
  const fileContent = readFileSync(inFilePath, 'utf8')
  const newContent = fileContent.replace(/__SITEMAP_PLACEHOLDER__generation_in_plugin_SEO__/g, sitemapXML)
  const outFilePath = resolve(process.cwd(), 'public', 'sitemap.xml')
  writeFileSync(outFilePath, newContent, 'utf8')
}
