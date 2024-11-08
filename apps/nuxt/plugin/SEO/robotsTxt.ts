import dotenv from 'dotenv'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

export default function generateRobots() {
  dotenv.config()
  const basePath = resolve(process.cwd(), 'src', 'public')
  const VITE_DEPLOY_URL = process.env['VITE_DEPLOY_URL']
  const inFilePath = resolve(basePath, 'robots.placeholder.txt')
  const fileContent = readFileSync(inFilePath, 'utf8')
  const newContent = fileContent.replace(/__VITE_DEPLOY_URL__/g, VITE_DEPLOY_URL as string)
  const outFilePath = resolve(basePath, 'robots.txt')
  writeFileSync(outFilePath, newContent, 'utf8')
}
