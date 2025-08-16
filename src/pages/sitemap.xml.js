import { SITE } from '../config';
import { sortPosts } from '../util';

export async function GET() {
  const allPosts = Object.values(import.meta.glob('./posts/*.md', { eager: true }));
  const sortedPosts = sortPosts(allPosts);
  
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- 首页 -->
  <url>
    <loc>${SITE.homePage}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- RSS页面 -->
  <url>
    <loc>${SITE.homePage}/rss.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- 投资周刊文章 -->
  ${sortedPosts.map(post => {
    const postDate = post.frontmatter.date;
    // 将日期格式从 YYYY/MM/DD 转换为 YYYY-MM-DD
    const isoDate = postDate ? postDate.replace(/\//g, '-') : new Date().toISOString().split('T')[0];
    
    return `
  <url>
    <loc>${SITE.homePage}${post.url}</loc>
    <lastmod>${isoDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`;
  }).join('')}
</urlset>`;

  return new Response(sitemapContent, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
