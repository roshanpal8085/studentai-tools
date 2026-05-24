import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const BASE_URL = 'https://studentaitools.in';

// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

console.log('\n🗺️ Generating dynamic sitemap.xml...');

// ── Read blog data to get dynamic routes ────────────────────────────────────
const blogDataRaw = readFileSync(
  join(__dirname, '..', 'src', 'data', 'blogData.js'),
  'utf-8'
);

const blogSlugs = [];
const postRegex = /slug:\s*"([^"]+)"/g;
let match;
while ((match = postRegex.exec(blogDataRaw)) !== null) {
  blogSlugs.push(match[1]);
}

// ── Define all static and tool routes ───────────────────────────────────────
const routes = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/free-tools', priority: '0.9', changefreq: 'weekly' },
  { url: '/blog', priority: '0.9', changefreq: 'daily' },
  { url: '/about', priority: '0.7', changefreq: 'monthly' },
  { url: '/contact', priority: '0.7', changefreq: 'monthly' },
  { url: '/privacy-policy', priority: '0.6', changefreq: 'monthly' },
  { url: '/terms-conditions', priority: '0.6', changefreq: 'monthly' },
  { url: '/disclaimer', priority: '0.6', changefreq: 'monthly' },
  
  // Core AI Tools
  { url: '/ai-notes-generator', priority: '0.9', changefreq: 'weekly' },
  { url: '/ai-quiz-generator', priority: '0.9', changefreq: 'weekly' },
  { url: '/ai-study-planner', priority: '0.9', changefreq: 'weekly' },
  { url: '/chat-pdf', priority: '0.9', changefreq: 'weekly' },
  { url: '/ai-homework-helper', priority: '0.9', changefreq: 'weekly' },
  { url: '/ai-essay-writer', priority: '0.9', changefreq: 'weekly' },
  { url: '/ai-resume-generator', priority: '0.9', changefreq: 'weekly' },
  { url: '/ai-text-summarizer', priority: '0.8', changefreq: 'weekly' },
  { url: '/ai-assignment-generator', priority: '0.8', changefreq: 'weekly' },
  { url: '/presentation-generator', priority: '0.8', changefreq: 'weekly' },
  { url: '/email-writer', priority: '0.8', changefreq: 'weekly' },

  // Writing & PDF Tools
  { url: '/tools/paraphrasing-tool', priority: '0.9', changefreq: 'weekly' },
  { url: '/tools/grammar-checker', priority: '0.9', changefreq: 'weekly' },
  { url: '/free-pdf-tools', priority: '0.9', changefreq: 'weekly' },
  { url: '/tools/merge-pdf', priority: '0.8', changefreq: 'monthly' },
  { url: '/tools/split-pdf', priority: '0.7', changefreq: 'monthly' },
  { url: '/tools/compress-pdf', priority: '0.7', changefreq: 'monthly' },
  { url: '/tools/pdf-footer-editor', priority: '0.7', changefreq: 'monthly' },
  { url: '/tools/image-to-pdf', priority: '0.7', changefreq: 'monthly' },
  { url: '/tools/pdf-to-word', priority: '0.7', changefreq: 'monthly' },
];

// ── Generate XML ────────────────────────────────────────────────────────────
let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// Add static routes
for (const route of routes) {
  sitemapXml += `  <url>\n`;
  sitemapXml += `    <loc>${BASE_URL}${route.url}</loc>\n`;
  sitemapXml += `    <lastmod>${today}</lastmod>\n`;
  sitemapXml += `    <changefreq>${route.changefreq}</changefreq>\n`;
  sitemapXml += `    <priority>${route.priority}</priority>\n`;
  sitemapXml += `  </url>\n`;
}

// Add blog posts dynamically
for (const slug of blogSlugs) {
  sitemapXml += `  <url>\n`;
  sitemapXml += `    <loc>${BASE_URL}/blog/${slug}</loc>\n`;
  sitemapXml += `    <lastmod>${today}</lastmod>\n`;
  sitemapXml += `    <changefreq>weekly</changefreq>\n`;
  sitemapXml += `    <priority>0.9</priority>\n`;
  sitemapXml += `  </url>\n`;
}

sitemapXml += `</urlset>`;

// Write to dist folder (this overrides the static one from public folder during build)
writeFileSync(join(DIST, 'sitemap.xml'), sitemapXml, 'utf-8');

console.log(`  ✅ Sitemap generated successfully with ${routes.length + blogSlugs.length} URLs (lastmod: ${today})\n`);
