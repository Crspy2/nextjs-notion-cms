import type * as types from 'notion-types'
import { IoMoonSharp, IoSunnyOutline } from 'react-icons/io5'
import cs from 'classnames'
import * as React from 'react'
import { Breadcrumbs, Header, Search } from 'react-notion-x'

import { navigationStyle } from '@/lib/config'
import { useTheme } from 'next-themes'

import styles from './styles.module.css'

function ToggleThemeButton() {
  const [hasMounted, setHasMounted] = React.useState(false)
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  const onToggleTheme = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [setTheme])

  return (
    <div
      className={cs('breadcrumb', 'button', !hasMounted && styles.hidden)}
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
  // const { components, mapPageUrl } = useNotionContext()

  if (navigationStyle === 'default') {
    return <Header block={block} />
  }

  return (
    <header className='notion-header'>
      <div className='notion-nav-header'>
        <Breadcrumbs block={block} rootOnly={true} />

        <div className='notion-nav-header-rhs breadcrumbs'>
          {/*{navigationLinks*/}
          {/*  ?.map((link: { pageId: string, url: string, title: string }, index: number) => {*/}
          {/*    if (!link?.pageId && !link?.url) {*/}
          {/*      return null*/}
          {/*    }*/}

          {/*    if (link.pageId) {*/}
          {/*      return (*/}
          {/*        <components.PageLink*/}
          {/*          href={mapPageUrl(link.pageId)}*/}
          {/*          key={index}*/}
          {/*          className={cs(styles.navLink, 'breadcrumb', 'button')}*/}
          {/*        >*/}
          {/*          {link.title}*/}
          {/*        </components.PageLink>*/}
          {/*      )*/}
          {/*    } else {*/}
          {/*      return (*/}
          {/*        <components.Link*/}
          {/*          href={link.url}*/}
          {/*          key={index}*/}
          {/*          className={cs(styles.navLink, 'breadcrumb', 'button')}*/}
          {/*        >*/}
          {/*          {link.title}*/}
          {/*        </components.Link>*/}
          {/*      )*/}
          {/*    }*/}
          {/*  })*/}
          {/*  .filter(Boolean)}*/}

          <ToggleThemeButton />

          <Search block={block} title={null} />
        </div>
      </div>
    </header>
  )
}
