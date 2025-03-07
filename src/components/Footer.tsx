"use client"

import { memo, MouseEvent, useCallback, useEffect, useState } from "react"
import { useTheme } from 'next-themes'
import { IoMoonSharp, IoSunnyOutline } from "react-icons/io5"
import { FaGithub, FaTwitter, FaYoutube, FaLinkedin } from "react-icons/fa"

import * as config from '@/lib/config'

import styles from './styles.module.css'

export function FooterImpl() {
  const [hasMounted, setHasMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const currentYear = new Date().getFullYear()

  const onToggleDarkMode = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()
      setTheme(theme === "dark" ? "light" : "dark")
    },
    [setTheme]
  )

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return (
    <footer className={styles.footer}>
      <div className={styles.copyright}>
        Copyright {currentYear} {config.author}
      </div>

      <div className={styles.settings}>
        {hasMounted && (
          <a
            className={styles.toggleDarkMode}
            href='#'
            role='button'
            onClick={onToggleDarkMode}
            title='Toggle dark mode'
          >
            {theme === "dark" ? <IoMoonSharp /> : <IoSunnyOutline />}
          </a>
        )}
      </div>

      <div className={styles.social}>
        {config.twitter && (
          <a
            className={styles.twitter}
            href={`https://twitter.com/${config.twitter}`}
            title={`Twitter @${config.twitter}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaTwitter />
          </a>
        )}

        {config.github && (
          <a
            className={styles.github}
            href={`https://github.com/${config.github}`}
            title={`GitHub @${config.github}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaGithub />
          </a>
        )}

        {config.linkedin && (
          <a
            className={styles.linkedin}
            href={`https://www.linkedin.com/${config.linkedin}`}
            title={`LinkedIn ${config.author}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaLinkedin />
          </a>
        )}

        {config.youtube && (
          <a
            className={styles.youtube}
            href={`https://www.youtube.com/${config.youtube}`}
            title={`YouTube ${config.author}`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <FaYoutube />
          </a>
        )}
      </div>
    </footer>
  )
}

export const Footer = memo(FooterImpl)
