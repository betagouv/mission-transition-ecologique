import type { Plugin } from 'vite'
import generateRobots from './robotsTxt'
import generateSitemap from './sitemap'

function SEOPlugin(): Plugin[] {
  return [
    {
      name: 'vite-plugin-SEO',
      closeBundle() {
        try {
          generateRobots()
          generateSitemap()
        } catch (error) {
          console.error('Error in the SEO plugin:', error)
        }
      }
    }
  ]
}

export default SEOPlugin
