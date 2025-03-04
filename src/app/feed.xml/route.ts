import { type ExtendedRecordMap } from 'notion-types'
import {
    getBlockParentPage,
    getBlockTitle,
    getPageProperty,
    idToUuid
} from 'notion-utils'
import RSS from 'rss'
import * as config from '@/lib/config'
import { getSiteMap } from '@/lib/get-site-map'
import { getSocialImageUrl } from '@/lib/get-social-image-url'
import { getCanonicalPageUrl } from '@/lib/map-page-url'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
    if (req.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' }
        })
    }

    const siteMap = await getSiteMap()
    const ttlMinutes = 24 * 60
    const ttlSeconds = ttlMinutes * 60

    const feed = new RSS({
        title: config.name,
        site_url: config.host,
        feed_url: `${config.host}/feed.xml`,
        language: config.language,
        ttl: ttlMinutes
    })

    for (const pagePath of Object.keys(siteMap.canonicalPageMap)) {
        const pageId = siteMap.canonicalPageMap[pagePath]
        const recordMap = siteMap.pageMap[pageId] as ExtendedRecordMap
        if (!recordMap) continue

        const keys = Object.keys(recordMap?.block || {})
        const block = recordMap?.block?.[keys[0]]?.value
        if (!block) continue

        const parentPage = getBlockParentPage(block, recordMap)
        const isBlogPost =
            block.type === 'page' &&
            block.parent_table === 'collection' &&
            parentPage?.id === idToUuid(config.rootNotionPageId)
        if (!isBlogPost) continue

        const title = getBlockTitle(block, recordMap) || config.name
        const description =
            getPageProperty<string>('Description', block, recordMap) ||
            config.description
        const url = getCanonicalPageUrl(config.site, recordMap)(pageId)
        const lastUpdatedTime = getPageProperty<number>(
            'Last Updated',
            block,
            recordMap
        )
        const publishedTime = getPageProperty<number>('Published', block, recordMap)
        const date = lastUpdatedTime
            ? new Date(lastUpdatedTime)
            : publishedTime
                ? new Date(publishedTime)
                : String("")
        const socialImageUrl = getSocialImageUrl(pageId)

        feed.item({
            title,
            url,
            date,
            description,
            enclosure: socialImageUrl
                ? { url: socialImageUrl, type: 'image/jpeg' }
                : undefined
        })
    }

    const feedText = feed.xml({ indent: true })

    return new Response(feedText, {
        headers: {
            'Cache-Control': `public, max-age=${ttlSeconds}, stale-while-revalidate=${ttlSeconds}`,
            'Content-Type': 'text/xml; charset=utf-8'
        }
    })
}