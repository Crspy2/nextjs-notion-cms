import { PropsWithChildren } from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@/app/providers"

import 'katex/dist/katex.min.css'
import 'prismjs/themes/prism-coy.css'
import 'react-notion-x/src/styles.css'
import '@/styles/global.css'
import '@/styles/notion.css'
import '@/styles/prism-theme.css'

const geistSans = Geist({
      variable: "--font-geist-sans",
      subsets: ["latin"],
})

const geistMono = Geist_Mono({
      variable: "--font-geist-mono",
      subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "Notion Blog",
    description: "NextJS Project that uses Notion as a CMS",
}

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
            <ThemeProvider enableSystem defaultTheme="system">
                {children}
            </ThemeProvider>
            </body>
        </html>
    )
}
