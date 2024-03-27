import type { Plugin } from 'vite';
import replace from 'replace-in-file';
import dotenv from 'dotenv';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
// import { routes } from '../router/route';

function generateRobots() {
  try {
    dotenv.config();
    const VITE_DEPLOY_URL = process.env.VITE_DEPLOY_URL;

    const inFilePath = resolve(process.cwd(), 'public', 'robots.txt');
    const fileContent = readFileSync(inFilePath, 'utf8');
    const newContent = fileContent.replace(/__VITE_DEPLOY_URL__/g, VITE_DEPLOY_URL as string);
    const outFilePath = resolve(process.cwd(), 'dist', 'robots.txt');
    writeFileSync(outFilePath, newContent, 'utf8');
  } catch (error) {
    console.error('Error while generating robots.txt:', error);
  }
}

function generateSitemap() {

  const sitemap = ` TO MAKE DYNAMIC
  <urlset>
  <url>
  <loc>http://localhost/</loc>
  <lastmod>2024-03-26T21:50:07.101Z</lastmod>
  <changefreq>daily</changefreq>
  <priority>1.0</priority>
  </url>
  <url>
  <loc>http://localhost/widget</loc>
  <lastmod>2024-03-26T21:50:07.101Z</lastmod>
  <changefreq>daily</changefreq>
  <priority>1.0</priority>
  </url>
  <url>
  <loc>http://localhost/archives</loc>
  <lastmod>2024-03-26T21:50:07.101Z</lastmod>
  <changefreq>daily</changefreq>
  <priority>565656.0</priority>
  </url>
  </urlset>
  `;

  const currentDate = new Date();
  const iso8601DateTime = currentDate.toISOString();

  // const allPaths = routes.map(route => route.path);
  // console.log(allPaths);
  // enum ChangeFreq {
  //   Hourly = 'hourly',
  //   Daily = 'daily',
  //   Weekly = 'weekly',
  //   Monthly = 'monthly',
  //   Yearly = 'yearly',
  //   Never = 'never'
  // }

  // enum Priority {
  //   Highest = '1.0',
  //   High = '0.8',
  //   Mid = '0.5',
  //   Low = '0.2',
  //   Lowest = '0.0'
  // }

  try {
    const inFilePath = resolve(process.cwd(), 'public', 'sitemap.xml');
    const fileContent = readFileSync(inFilePath, 'utf8');
    const newContent = fileContent.replace(/__SITEMAP_PLACEHOLDER_generation_in_robotsts__/g, sitemap);
    const outFilePath = resolve(process.cwd(), 'dist', 'sitemap.xml');
    writeFileSync(outFilePath, newContent, 'utf8');
  } catch (error) {
    console.error('Error while generating the sitemap :', error);
  }
}

function sitemapPlugin(): Plugin[] {
  return [{
    name: 'vite-plugin-sitemap',
    closeBundle() {
      generateRobots();
      generateSitemap();
    },
  }];
}

export default sitemapPlugin