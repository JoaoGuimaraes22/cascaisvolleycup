'use client'

import {
  useCallback,
  useEffect,
  useState,
  useMemo,
  startTransition,
  type FC,
  type MouseEvent
} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { FiMenu, FiX } from 'react-icons/fi'
import clsx from 'clsx'
import Logo from '@/public/img/global/cascais-volley-cup-1.webp'
import LocaleSwitcher from './locale-switcher'
import type { Locale } from '@/i18n-config'
import { localeHref } from '../../_lib/seo'

type HeaderDict = {
  About: string
  Accommodation: string
  Program: string
  Competition: string
  Gallery: string
  News: string
  Hall_of_Fame: string
  Registration: string
}

type Props = {
  lang: Locale
  dict: HeaderDict
  localeNames: Record<string, string>
}

const HEADER_BG = '/img/footer/footer-bg.webp'

function useMobileMenu(pathname: string) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [lastPathname, setLastPathname] = useState(pathname)

  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setMenuOpen(false)
  }

  useEffect(() => {
    if (menuOpen) {
      const original = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = original
      }
    }
  }, [menuOpen])

  const toggleMenu = useCallback(() => {
    setMenuOpen(v => !v)
  }, [])

  return { menuOpen, toggleMenu }
}

export default function Header({ lang, dict, localeNames }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  const { menuOpen, toggleMenu } = useMobileMenu(pathname)

  const handleLogoClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      const isHome = pathname === `/${lang}` || pathname === `/${lang}/`

      if (isHome) {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        return
      }

      startTransition(() => {
        router.push(`/${lang}`, { scroll: false })
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: 'instant' })
        })
      })
    },
    [pathname, lang, router]
  )

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) toggleMenu()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [menuOpen, toggleMenu])

  return (
    <header
      role='banner'
      className='fixed inset-x-0 top-0 z-[200] w-full bg-slate-100/95 shadow-md backdrop-blur-sm'
      style={{
        backgroundImage: `url(${HEADER_BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className='mx-auto flex max-w-screen-2xl flex-col items-center justify-between px-3 py-2 sm:px-5 sm:py-4 lg:flex-row'>
        <div className='ml-1 flex w-full items-center justify-between sm:ml-3 lg:ml-6 lg:w-auto'>
          <Link
            href={`/${lang}`}
            aria-label='Cascais Volley Cup 2026 - Go to homepage'
            onClick={handleLogoClick}
            className='rounded-sm focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:outline-none'
          >
            <Image
              src={Logo}
              alt='Cascais Volley Cup 2026'
              priority
              quality={80}
              sizes='(max-width: 640px) 150px, (max-width: 1024px) 190px, 240px'
              className='max-h-8 hover:scale-105 motion-safe:transition-transform sm:max-h-10 md:max-h-12 lg:max-h-14'
              style={{ width: 'auto', height: 'auto' }}
            />
          </Link>

          <div className='flex items-center gap-3 lg:hidden'>
            <LangButton lang={lang} localeNames={localeNames} />
            <button
              type='button'
              onClick={toggleMenu}
              aria-label={
                menuOpen ? 'Close navigation menu' : 'Open navigation menu'
              }
              aria-expanded={menuOpen}
              aria-controls='mobile-nav'
              className='rounded-md p-2 hover:bg-slate-200 focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:outline-none motion-safe:transition-colors'
            >
              <span className='sr-only'>
                {menuOpen ? 'Close menu' : 'Open menu'}
              </span>
              {menuOpen ? (
                <FiX size={24} aria-hidden='true' />
              ) : (
                <FiMenu size={24} aria-hidden='true' />
              )}
            </button>
          </div>
        </div>

        <nav
          aria-label='Primary navigation'
          className='hidden items-center gap-7 lg:inline-flex xl:gap-8'
        >
          <NavLinks lang={lang} dict={dict} pathname={pathname} />
          <LangButton lang={lang} localeNames={localeNames} />
        </nav>

        <nav
          id='mobile-nav'
          aria-label='Mobile navigation'
          aria-hidden={!menuOpen}
          className={clsx(
            'w-full flex-col items-start gap-4 overflow-hidden ease-in-out motion-safe:transition-all motion-safe:duration-300 lg:hidden',
            menuOpen
              ? 'mt-3 flex max-h-[65vh] translate-y-0 opacity-100'
              : 'pointer-events-none max-h-0 -translate-y-2 opacity-0'
          )}
        >
          <NavLinks lang={lang} dict={dict} pathname={pathname} isMobile />
        </nav>
      </div>
    </header>
  )
}

const NavLinks: FC<{
  lang: Locale
  dict: HeaderDict
  pathname: string
  isMobile?: boolean
}> = ({ lang, dict, pathname, isMobile = false }) => {
  const links = useMemo(
    () => [
      { href: '/about', label: dict.About },
      { href: '/accommodation', label: dict.Accommodation },
      { href: '/program', label: dict.Program },
      { href: '/competition', label: dict.Competition },
      { href: '/gallery', label: dict.Gallery },
      { href: '/news', label: dict.News },
      { href: '/hall-of-fame', label: dict.Hall_of_Fame },
      { href: '/registration', label: dict.Registration, cta: true }
    ],
    [dict]
  )

  const isActive = useCallback(
    (href: string) => {
      const withLang = `/${lang}${href}`
      return pathname === withLang || pathname.startsWith(withLang + '/')
    },
    [pathname, lang]
  )

  return (
    <>
      {links.map(({ href, label, cta }) => {
        const active = isActive(href)
        const fullHref = localeHref(lang, href)

        if (cta) {
          return (
            <Link
              key={href}
              href={fullHref}
              aria-current={active ? 'page' : undefined}
              aria-label={`${label} - Call to action`}
              className={clsx(
                'inline-flex items-center font-semibold shadow-sm motion-safe:transition-all motion-safe:duration-200',
                'focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:outline-none',
                isMobile
                  ? 'w-full justify-center rounded-md px-3 py-2 text-sm'
                  : 'rounded-full px-4 py-1.5 text-xs xl:text-sm',
                active
                  ? 'bg-sky-800 text-white'
                  : 'bg-sky-700 text-white hover:scale-105 hover:bg-sky-800 hover:shadow-md focus-visible:bg-sky-800'
              )}
            >
              {label}
            </Link>
          )
        }

        return (
          <Link
            key={href}
            href={fullHref}
            className={clsx(
              'group relative pb-0.5 font-medium hover:text-sky-700 motion-safe:transition-colors',
              'rounded-sm focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:outline-none',
              active ? 'text-sky-700' : 'text-slate-600',
              isMobile ? 'block w-full py-1 text-sm' : 'text-xs xl:text-sm'
            )}
            aria-current={active ? 'page' : undefined}
          >
            {label}
            <span
              className={clsx(
                'absolute bottom-0 left-0 h-px w-full origin-left transform bg-sky-700',
                'motion-safe:transition-transform motion-safe:duration-300',
                active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              )}
              aria-hidden='true'
            />
          </Link>
        )
      })}
    </>
  )
}

const LangButton: FC<{ lang: Locale; localeNames: Record<string, string> }> = ({
  lang,
  localeNames
}) => (
  <div
    className={clsx(
      'lang-sky inline-flex items-center rounded bg-sky-700/90 px-2 py-0.5 text-xs font-medium text-white shadow-sm backdrop-blur-sm',
      'focus-within:ring-2 focus-within:ring-sky-300 focus-within:ring-offset-2 focus-within:outline-none',
      'hover:bg-sky-800 hover:shadow-md motion-safe:transition-all sm:rounded-md sm:px-2.5 sm:py-1 sm:text-sm'
    )}
  >
    <LocaleSwitcher currentLocale={lang} localeNames={localeNames} />
  </div>
)
