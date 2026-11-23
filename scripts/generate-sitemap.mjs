import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Load environment variables
const loadEnv = (filePath) => {
  if (fs.existsSync(filePath)) {
    const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const value = trimmed.slice(idx + 1).trim().replace(/^['"](.*)['"]$/, '$1');
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
};
loadEnv(path.join(projectRoot, '.env.local'));
loadEnv(path.join(projectRoot, '.env'));

const BASE_URL = (
  process.env.SITE_URL ||
  (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes('localhost')
    ? process.env.NEXT_PUBLIC_APP_URL
    : 'https://lex-daily.vercel.app')
).replace(/\/+$/, '');

// Scan src/app for static pages
function getStaticAppRoutes() {
  const appDir = path.join(projectRoot, 'src', 'app');
  const staticRoutes = [];

  function scan(dir, currentRoute = '') {
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

async function getCases() {
  let cases = [];

  // Try MongoDB if MONGODB_URI is available
  if (process.env.MONGODB_URI) {
    try {
      const mongoose = (await import('mongoose')).default;
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URI, {
          serverSelectionTimeoutMS: 2000,
          connectTimeoutMS: 2000,
          bufferCommands: false,
        });
      }
      const col = mongoose.connection.collection('cases');
      cases = await col.find({}).toArray();
    } catch (e) {
      // Fallback to seedData
    }
  }

  if (!cases || cases.length === 0) {
    try {
      const seedModule = await import('../src/lib/seedData.ts');
      const seed = seedModule.getSeedData();
      cases = seed.cases || [];
    } catch (e) {
      // Fallback manual defaults if import needs ts loader
      cases = [
        { id: 'c-001', filingDate: '2023-08-12' },
        { id: 'c-002', filingDate: '2023-11-05' },
        { id: 'c-003', filingDate: '2024-01-15' },
        { id: 'c-004', filingDate: '2024-02-01' },
        { id: 'c-005', filingDate: '2024-02-18' },
        { id: 'c-006', filingDate: '2024-02-28' },
        { id: 'c-007', filingDate: '2024-03-05' },
        { id: 'c-008', filingDate: '2024-03-12' },
      ];
    }
  }

  return cases;
}

export async function generateSitemapXml() {
  const staticRoutes = getStaticAppRoutes();
  const cases = await getCases();

  const entries = [];

  for (const route of staticRoutes) {
    let priority = '0.7';
    let changefreq = 'weekly';
    if (route === '/') {
      priority = '1.0';
      changefreq = 'daily';
    } else if (route === '/features' || route === '/pricing') {
      priority = '0.8';
      changefreq = 'weekly';
    } else if (route === '/security' || route === '/contact') {
      priority = '0.7';
      changefreq = 'monthly';
    } else if (route === '/login' || route === '/signup') {
      priority = '0.6';
      changefreq = 'monthly';
    }

    entries.push({
      loc: route === '/' ? `${BASE_URL}/` : `${BASE_URL}${route}`,
      lastmod: new Date().toISOString(),
      changefreq,
      priority,
    });
  }

  for (const c of cases) {
    if (c && c.id) {
      const mod = c.updatedAt || c.filingDate || new Date().toISOString();
      entries.push({
        loc: `${BASE_URL}/share/case/${c.id}`,
        lastmod: new Date(mod).toISOString(),
        changefreq: 'weekly',
        priority: '0.7',
      });
    }
  }

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const item of entries) {
    xml += '  <url>\n';
    xml += `    <loc>${item.loc}</loc>\n`;
    xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
    xml += `    <priority>${item.priority}</priority>\n`;
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

  console.log(`✓ [Law Diary] Generated sitemap.xml with ${entries.length} URLs (static pages & case dockets)`);
  return xml;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await generateSitemapXml();
  process.exit(0);
}
