import { Suspense } from "react"
import { NotionPage } from '@/components/NotionPage'
import { domain } from '@/lib/config'
import { resolveNotionPage } from '@/lib/resolve-notion-page'
import { Loading } from "@/components/Loading"

export default async function Page() {
    try {
        const props = await resolveNotionPage(domain)
        return (
            <Suspense fallback={<Loading />}>
              <NotionPage {...props} />
            </Suspense>
        )
    } catch (err) {
        console.error('page error', domain, err)
        throw err
    }
}