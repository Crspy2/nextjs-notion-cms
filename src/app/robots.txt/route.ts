import { host } from '@/lib/config'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
    if (req.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' }
        })
    }

    const content =
        process.env.VERCEL_ENV === 'production'
            ? `User-agent: *
Allow: /
Disallow: /api/get-tweet-ast/*
Disallow: /api/search-notion

Sitemap: ${host}/sitemap.xml`
            : `User-agent: *
Disallow: /

Sitemap: ${host}/sitemap.xml`

    return new Response(content, {
        headers: {
            'Cache-Control': 'public, max-age=86400, immutable',
            'Content-Type': 'text/plain'
        }
    })
}