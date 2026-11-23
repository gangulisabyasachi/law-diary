import fs from 'fs';
import path from 'path';
import { connectToDatabase } from './mongodb';
import { CaseModel } from '@/models';
import { getSeedData } from './seedData';

const projectRoot = process.cwd();

const BASE_URL = (
  process.env.SITE_URL ||
  (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes('localhost')
    ? process.env.NEXT_PUBLIC_APP_URL
    : 'https://lex-daily.vercel.app')
).replace(/\/+$/, '');

// Scan src/app for static pages
function getStaticAppRoutes(): string[] {
  const appDir = path.join(projectRoot, 'src', 'app');
  const staticRoutes: string[] = [];

  function scan(dir: string, currentRoute = '') {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (
        entry.name.startsWith('_') ||
        entry.name.startsWith('.') ||
        entry.name === 'api' ||
        entry.name === 'admin' ||
        entry.name === 'dashboard' ||
        entry.name === 'node_modules'
      ) {
        continue;
      }
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const seg = entry.name.startsWith('(') && entry.name.endsWith(')')
          ? currentRoute
          : `${currentRoute}/${entry.name}`;
        scan(fullPath, seg);
      } else if (entry.isFile() && /^page\.(tsx|ts|jsx|js)$/.test(entry.name)) {
        const finalRoute = currentRoute === '' ? '/' : currentRoute;
        if (!finalRoute.includes('[')) {
          staticRoutes.push(finalRoute);
        }
      }
    }
  }

  scan(appDir);
  return Array.from(new Set(['/', ...staticRoutes]));
}

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export async function getDynamicCaseEntries(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];
  let cases: any[] = [];

  try {
    const { isConnected } = await connectToDatabase();
    if (isConnected) {
      cases = await CaseModel.find({}, 'id status updatedAt filingDate title').lean();
    }
  } catch (err: any) {
    console.warn('MongoDB connection deferred for sitemap:', err.message);
  }

  // Fallback to seed cases if DB empty or disconnected
  if (!cases || cases.length === 0) {
    try {
      const seed = getSeedData();
      cases = seed.cases || [];
    } catch (e: any) {
      console.warn('Fallback seed data failed:', e.message);
    }
  }

  if (Array.isArray(cases)) {
    for (const c of cases) {
      if (c && c.id) {
        const dateStr = c.updatedAt || c.filingDate || new Date();
        entries.push({
          url: `${BASE_URL}/share/case/${c.id}`,
          lastModified: new Date(dateStr),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    }
  }

  return entries;
}

export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const staticRoutes = getStaticAppRoutes();
  const staticEntries: SitemapEntry[] = staticRoutes.map((route) => {
    let priority = 0.7;
    let changeFrequency: SitemapEntry['changeFrequency'] = 'weekly';

    if (route === '/') {
      priority = 1.0;
      changeFrequency = 'daily';
    } else if (route === '/features' || route === '/pricing') {
      priority = 0.8;
      changeFrequency = 'weekly';
    } else if (route === '/security' || route === '/contact') {
      priority = 0.7;
      changeFrequency = 'monthly';
    } else if (route === '/login' || route === '/signup') {
      priority = 0.6;
      changeFrequency = 'monthly';
    }

    return {
      url: route === '/' ? `${BASE_URL}/` : `${BASE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    };
  });

  const dynamicEntries = await getDynamicCaseEntries();
  return [...staticEntries, ...dynamicEntries];
}

export async function generateSitemapXml(): Promise<string> {
  const entries = await getSitemapEntries();

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const item of entries) {
    const modIso = item.lastModified instanceof Date
      ? item.lastModified.toISOString()
      : new Date(item.lastModified).toISOString();

    xml += '  <url>\n';
    xml += `    <loc>${item.url}</loc>\n`;
    xml += `    <lastmod>${modIso}</lastmod>\n`;
    xml += `    <changefreq>${item.changeFrequency}</changefreq>\n`;
    xml += `    <priority>${item.priority.toFixed(1)}</priority>\n`;
    xml += '  </url>\n';
  }

  xml += '</urlset>\n';

  // 1. Write repo root sitemap.xml
  fs.writeFileSync(path.join(projectRoot, 'sitemap.xml'), xml, 'utf-8');

  // 2. Write public/robots.txt
  const publicDir = path.join(projectRoot, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const robotsTxt = `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /dashboard\nDisallow: /api/\n\nSitemap: ${BASE_URL}/sitemap.xml\n`;
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf-8');

  console.log(`✓ [Law Diary] Sitemap updated with ${entries.length} URLs (static pages & public case dockets)`);
  return xml;
}

export function triggerSitemapRegeneration(): void {
  setTimeout(async () => {
    try {
      await generateSitemapXml();
    } catch (err: any) {
      console.error('Background sitemap regeneration failed in Law Diary:', err.message);
    }
  }, 100);
}
