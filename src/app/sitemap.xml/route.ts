import type { SiteMap } from '@/lib/types'
import { host } from '@/lib/config'
import { getSiteMap } from '@/lib/get-site-map'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
    if (req.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' }
        })
    }

    const siteMap = await getSiteMap()
    const sitemapContent = createSitemap(siteMap)

    return new Response(sitemapContent, {
        headers: {
            'Cache-Control': 'public, max-age=28800, stale-while-revalidate=28800',
            'Content-Type': 'text/xml'
        }
    })
}

const createSitemap = (siteMap: SiteMap) =>
    `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${host}</loc>
    </url>
    <url>
      <loc>${host}/</loc>
    </url>
    ${Object.keys(siteMap.canonicalPageMap)
        .map((canonicalPagePath) =>
            `
          <url>
            <loc>${host}/${canonicalPagePath}</loc>
          </url>
        `.trim()
        )
        .join('')}
  </urlset>`