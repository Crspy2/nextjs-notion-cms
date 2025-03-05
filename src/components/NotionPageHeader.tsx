"use client"

import { useCallback, useEffect, useState } from "react"
import { useTheme } from 'next-themes'
import { Breadcrumbs, Header, Search, useNotionContext } from 'react-notion-x'
import type * as types from 'notion-types'

import { IoMoonSharp, IoSunnyOutline } from 'react-icons/io5'
import { navigationStyle } from '@/lib/config'
import { cn } from "@/lib/utils"

import styles from './styles.module.css'

function ToggleThemeButton() {
  const [hasMounted, setHasMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const onToggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [setTheme])

  return (
    <div
      className={cn('breadcrumb', 'button', !hasMounted && styles.hidden)}
      onClick={onToggleTheme}
    >
      {hasMounted && theme === "dark" ? <IoMoonSharp /> : <IoSunnyOutline />}
    </div>
  )
}

export function NotionPageHeader({
  block
}: {
  block: types.CollectionViewPageBlock | types.PageBlock
}) {
  const { components, mapPageUrl } = useNotionContext()

  if (navigationStyle === 'default') {
    return <Header block={block} />
  }

  return (
    <header className='notion-header'>
      <div className='notion-nav-header'>
        <Breadcrumbs block={block} rootOnly={true} />

        <div className='notion-nav-header-rhs breadcrumbs'>
          {[]
            ?.map((link: { pageId: string, url: string, title: string }, index: number) => {
              if (!link?.pageId && !link?.url) {
                return null
              }

              if (link.pageId) {
                return (
                  <components.PageLink
                    href={mapPageUrl(link.pageId)}
                    key={index}
                    className={cn(styles.navLink, 'breadcrumb', 'button')}
                  >
                    {link.title}
                  </components.PageLink>
                )
              } else {
                return (
                  <components.Link
                    href={link.url}
                    key={index}
                    className={cn(styles.navLink, 'breadcrumb', 'button')}
                  >
                    {link.title}
                  </components.Link>
                )
              }
            })
            .filter(Boolean)}

          <ToggleThemeButton />

          <Search block={block} title={null} />
        </div>
      </div>
    </header>
  )
}
