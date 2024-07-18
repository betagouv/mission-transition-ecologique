import { Project } from '../src/project/types'
import { default as projectsJson } from './projects.json'

export const projects = projectsJson as unknown as Project[]
