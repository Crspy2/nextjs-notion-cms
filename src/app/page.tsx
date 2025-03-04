import { NotionPage } from '@/components/NotionPage'
import { domain } from '@/lib/config'
import { resolveNotionPage } from '@/lib/resolve-notion-page'
import {Suspense} from "react";

export default async function Page() {
    try {
        const props = await resolveNotionPage(domain)
        return (
            <Suspense fallback={<div>Loading...</div>}>
              <NotionPage {...props} />
            </Suspense>
        )
    } catch (err) {
        console.error('page error', domain, err)
        throw err
    }
}