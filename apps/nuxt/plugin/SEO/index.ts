import generateRobots from './robotsTxt'
import generateSitemap from './sitemapRollback'

export const PATH_FOLDER_FILE = 'public'

try {
  generateRobots()
  generateSitemap()
} catch (error) {
  console.error('Error in the SEO plugin:', error)
}
