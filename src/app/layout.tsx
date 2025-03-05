import { PropsWithChildren } from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/app/providers"

import 'katex/dist/katex.min.css'
import 'prismjs/themes/prism-coy.css'
import 'react-notion-x/src/styles.css'
import '@/styles/global.css'
import '@/styles/notion.css'
import '@/styles/prism-theme.css'

export const metadata: Metadata = {
    title: "Notion Blog",
    description: "NextJS Project that uses Notion as a CMS",
}

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="antialiased">
            <ThemeProvider enableSystem>
                {children}
            </ThemeProvider>
            </body>
        </html>
    )
}
