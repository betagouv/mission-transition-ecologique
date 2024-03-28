import type { Plugin } from 'vite'
import dotenv from 'dotenv'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import path from 'path'
import fs from 'fs'
import { promisify } from 'util'

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

const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)

async function processProgramDirectory(directoryPath: string): Promise<string[]> {
  const filesToInclude: string[] = []

  try {
    const filenames = await readdir(directoryPath)

    for (const filename of filenames) {
      const filePath: string = path.join(directoryPath, filename)
      const fileContent = await readFile(filePath, 'utf-8')

      if (hasValidExpiryDate(fileContent)) {
        const expiryDate = extractExpiryDate(fileContent)
        if (expiryDate > new Date()) {
          filesToInclude.push(filename)
        }
      } else {
        filesToInclude.push(filename)
      }
    }
  } catch (error) {
    console.error('Error reading directory in sitemap plugin:', error)
  }

  return filesToInclude
}

function hasValidExpiryDate(fileContent: string): boolean {
  return /fin de validité: \d{2}\/\d{2}\/\d{4}/.test(fileContent)
}

function extractExpiryDate(fileContent: string): Date {
  const match = /fin de validité: (\d{2}\/\d{2}\/\d{4})/.exec(fileContent)
  if (match) {
    const [, dateString] = match
    const [day, month, year] = dateString.split('/').map(Number)
    return new Date(year, month - 1, day) // month - 1 because months are 0-indexed in JavaScript
  }
  throw new Error('Expiry date not found')
}

import ProgramServiceJS from '@tee/backend/build/backend/src/program/application/programService'
async function generateSitemapXml(): Promise<string> {
  const ProgramService = ProgramServiceJS.default
  ProgramService.init()
  const service = new ProgramService()

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
          return generateOnePathXml(path, specificPathSetting.changeFreq, specificPathSetting.priority)
        } else {
          return generateOnePathXml(path, ChangeFreq.Monthly, Priority.Mid)
        }
      }
    })
    .filter((element) => element !== null)
    .join('\n')

  const programList: string[] = await processProgramDirectory('../data/programs')
  const programElements = programList
    .map((path) => {
      return generateOnePathXml('/aides-entreprise/' + path.slice(0, -5), ChangeFreq.Monthly, Priority.Mid)
    })
    .join('\n')
  return `<urlset>
  ${urlElements + '\n' + programElements}
</urlset>`
}

async function generateSitemap() {
  const sitemap: string = await generateSitemapXml()
  try {
    const inFilePath = resolve(process.cwd(), 'public', 'sitemap.xml')
    const fileContent = readFileSync(inFilePath, 'utf8')
    const newContent = fileContent.replace(/__SITEMAP_PLACEHOLDER_generation_in_utils_robotsts__/g, sitemap)
    const outFilePath = resolve(process.cwd(), 'dist', 'sitemap.xml')
    writeFileSync(outFilePath, newContent, 'utf8')
  } catch (error) {
    console.error('Error while generating the sitemap :', error)
  }
}

function sitemapPlugin(): Plugin[] {
  return [
    {
      name: 'vite-plugin-sitemap',
      closeBundle() {
        generateRobots()
        generateSitemap()
          .then(() => {})
          .catch((error) => {
            console.error('Error in the sitemap plugin:', error)
          })
      }
    }
  ]
}

export default sitemapPlugin
