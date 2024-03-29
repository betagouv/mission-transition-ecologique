import dotenv from 'dotenv'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

import { type PathSettings, ChangeFreq, Priority } from './type'
import ProgramServiceJS from '@tee/backend/build/backend/src/program/application/programService'
import type { Program } from '@tee/data/src/type/program'

const specificPathSettings: PathSettings[] = [
  { path: '/', changeFreq: ChangeFreq.Weekly, priority: Priority.Highest },
  { path: '/questionnaire', changeFreq: ChangeFreq.Monthly, priority: Priority.Null },
  { path: '/ajouter-une-aide-entreprises', changeFreq: ChangeFreq.Monthly, priority: Priority.Null },
  { path: '/accessibilite', changeFreq: ChangeFreq.Monthly, priority: Priority.Low },
  { path: '/mentions-legales', changeFreq: ChangeFreq.Monthly, priority: Priority.Low },
  { path: '/donnees-personnelles', changeFreq: ChangeFreq.Monthly, priority: Priority.Low }
]
const exclusionPaths = ['', '/:pathMatch(.*)*', ':programId']

function generateOnePathXML(path: string, changefreq: ChangeFreq, priority: Priority): string {
  const lastModified = new Date().toISOString()
  dotenv.config()
  const VITE_DEPLOY_URL = process.env.VITE_DEPLOY_URL

  return `  <url>
    <loc>${encodeURIComponent(VITE_DEPLOY_URL + path)}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${changefreq}</changefreq>
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
      if (exclusionPaths.includes(path)) {
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
  const ProgramService = ProgramServiceJS.default
  ProgramService.init()
  const service = new ProgramService()

  const allProgramsIds = service.getAll().map((program: Program) => program.id)
  const activeProgramsResult = service.getFilteredPrograms({})
  if (activeProgramsResult.isErr) {
    throw activeProgramsResult.error
  }
  const activeProgramsIds = activeProgramsResult.value.map((p: Program) => p.id)

  const programElements = allProgramsIds
    .map((id: string) => {
      if (activeProgramsIds.includes(id)) {
        return generateOnePathXML('/aides-entreprise/' + id, ChangeFreq.Monthly, Priority.MidHigh)
      } else {
        return generateOnePathXML('/aides-entreprise/' + id, ChangeFreq.Monthly, Priority.Null)
      }
    })
    .join('\n')
  return programElements
}

function generateSitemapXML(): string {
  const staticElements = generateStaticSitemap()
  const programElements = generateProgramSitemap()

  return `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticElements + '\n' + programElements}
</urlset>`
}

export default function generateSitemap() {
  const sitemapXML: string = generateSitemapXML()
  const inFilePath = resolve(process.cwd(), 'public', 'sitemap.xml')
  const fileContent = readFileSync(inFilePath, 'utf8')
  const newContent = fileContent.replace(/__SITEMAP_PLACEHOLDER__generation_in_plugin_SEO__/g, sitemapXML)
  const outFilePath = resolve(process.cwd(), 'dist', 'sitemap.xml')
  writeFileSync(outFilePath, newContent, 'utf8')
}
