import dotenv from 'dotenv'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import ProgramService from '@tee/backend/src/program/application/programService'
import type { Program } from '@tee/data/src/type/program'

enum ChangeFreq {
  Hourly = 'hourly',
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
  Yearly = 'yearly',
  Never = 'never'
}

enum Priority {
  Highest = '1.0',
  High = '0.8',
  Mid = '0.5',
  Low = '0.2',
  Lowest = '0.0'
}

interface PathSettings {
  path: string
  changeFreq: ChangeFreq
  priority: Priority
}
const specificPathSettings: PathSettings[] = [
  { path: '/', changeFreq: ChangeFreq.Weekly, priority: Priority.Highest },
  { path: '/mentions-legales', changeFreq: ChangeFreq.Monthly, priority: Priority.Low }
]
const exclusionPaths = ['', '/:pathMatch(.*)*', ':programId']

function generateRobots() {
  try {
    dotenv.config()
    const VITE_DEPLOY_URL = process.env.VITE_DEPLOY_URL

    const inFilePath = resolve(process.cwd(), 'public', 'robots.txt')
    const fileContent = readFileSync(inFilePath, 'utf8')
    const newContent = fileContent.replace(/__VITE_DEPLOY_URL__/g, VITE_DEPLOY_URL as string)
    const outFilePath = resolve(process.cwd(), 'dist', 'robots.txt')
    writeFileSync(outFilePath, newContent, 'utf8')
  } catch (error) {
    console.error('Error while generating robots.txt:', error)
  }
}

function generateOnePathXml(path: string, changefreq: ChangeFreq, priority: Priority): string {
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

import { routes } from '../router/routes'

function generateSitemapXml(): string {
  const staticRoutesFilePath = resolve(process.cwd(), 'src', 'router', 'routes.ts')
  const staticRoutesContent = readFileSync(staticRoutesFilePath, 'utf8')
  const regexMatches: RegExpMatchArray | null = staticRoutesContent.match(/path: '(.*)'/g)
  const staticPaths = regexMatches?.map((match) => match.slice(7, -1))

  const routesFromJSvariable = routes

  const urlElements = staticPaths
    ?.map((path) => {
      if (exclusionPaths.includes(path)) {
        return null
      } else {
        const specificPathSetting = specificPathSettings.find((specificPath) => specificPath.path === path)
        if (specificPathSetting) {
          return generateOnePathXml(path, specificPathSetting.changeFreq, specificPathSetting.priority)
        } else {
          return generateOnePathXml(path, ChangeFreq.Monthly, Priority.Mid)
        }
      }
    })
    .filter((element) => element !== null)
    .join('\n')

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
        return generateOnePathXml('/aides-entreprise/' + id, ChangeFreq.Monthly, Priority.Mid)
      } else {
        return generateOnePathXml('/aides-entreprise/' + id, ChangeFreq.Monthly, Priority.Lowest)
      }
    })
    .join('\n')

  return `<urlset>
  ${urlElements + '\n' + programElements}
</urlset>`
}

function generateSitemap() {
  const sitemap: string = generateSitemapXml()
  try {
    const inFilePath = resolve(process.cwd(), '..', 'web', 'public', 'sitemap.xml')
    const fileContent = readFileSync(inFilePath, 'utf8')
    const newContent = fileContent.replace(/__SITEMAP_PLACEHOLDER_generation_in_utils_robotsts__/g, sitemap)
    const outFilePath = resolve(process.cwd(), 'dist', 'sitemap.xml')
    writeFileSync(outFilePath, newContent, 'utf8')
  } catch (error) {
    console.error('Error while generating the sitemap :', error)
  }
}

generateRobots()
generateSitemap()
