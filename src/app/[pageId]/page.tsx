import { Suspense } from 'react'

import { domain, isDev } from '@/lib/config'
import { getSiteMap } from '@/lib/get-site-map'
import { resolveNotionPage } from '@/lib/resolve-notion-page'
import { NotionPage } from '@/components/NotionPage'
import { Loading } from "@/components/Loading"

export const revalidate = 10

export async function generateStaticParams() {
    if (isDev) {
        return []
    }

    const siteMap = await getSiteMap()
    return Object.keys(siteMap.canonicalPageMap).map((pageId) => ({
        pageId
    }))
}

export default async function Page({
                                       params,
                                   }: {
    params: Promise<{ pageId: string }>
}) {
    const slug = await params
    const props = await resolveNotionPage(domain, slug.pageId)
    return (
        <Suspense fallback={<Loading />}>
            <NotionPage {...props} />
        </Suspense>
    )
}