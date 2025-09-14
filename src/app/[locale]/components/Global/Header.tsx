'use client'

import {
  FC,
  useCallback,
  useEffect,
  useState,
  MouseEvent,
  startTransition,
  useLayoutEffect,
  useRef,
  useMemo
} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Link } from '@/src/navigation'
import { useTranslations } from 'next-intl'
import LangSwitcher from '../LangSwitcher'
import { FiMenu, FiX } from 'react-icons/fi'

import Image from 'next/image'
import Logo from '@/public/img/global/cascais-volley-cup-1.webp'
import type { ValidPathname } from '@/src/navigation'
import clsx from 'clsx'

interface Props {
  locale: string
}

type StaticPathname = Exclude<ValidPathname, '/gallery/[year]'>
const HEADER_BG = '/img/footer/footer-bg.webp'

// Custom hook for header height management
const useHeaderHeight = (
  headerRef: React.RefObject<HTMLElement>,
  menuOpen: boolean
) => {
  const syncHeaderHeight = useCallback(() => {
    const h = headerRef.current?.offsetHeight ?? 0
    document.documentElement.style.setProperty('--header-h', `${h}px`)
  }, [headerRef])

  useLayoutEffect(() => {
    syncHeaderHeight()
    if (!headerRef.current) return

    const ro = new ResizeObserver(syncHeaderHeight)
    ro.observe(headerRef.current)
    return () => ro.disconnect()
  }, [syncHeaderHeight])

  // Re-measure after mobile menu transition
  useEffect(() => {
    const id = setTimeout(syncHeaderHeight, 320)
    return () => clearTimeout(id)
  }, [menuOpen, syncHeaderHeight])
}

// Custom hook for mobile menu management
const useMobileMenu = (pathname: string) => {
  const [menuOpen, setMenuOpen] = useState(false)

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Lock page scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [menuOpen])

  const toggleMenu = useCallback(() => {
    setMenuOpen(prev => !prev)
  }, [])

  return { menuOpen, toggleMenu }
}

export const Header: FC<Props> = ({ locale }) => {
  const pathname = usePathname()
  const router = useRouter()
  const headerRef = useRef<HTMLElement | null>(null)

  const { menuOpen, toggleMenu } = useMobileMenu(pathname)
  useHeaderHeight(headerRef, menuOpen)

  const handleLogoClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      const isHome = pathname === `/${locale}` || pathname === `/${locale}/`

      if (isHome) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth' // Changed from 'instant' for better UX
        })
        return
      }

      startTransition(() => {
        router.push('/', { scroll: false })
        // Simplified scroll logic
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, behavior: 'instant' })
        })
      })
    },
    [pathname, locale, router]
  )

  // Handle escape key for mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        toggleMenu()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [menuOpen, toggleMenu])

  return (
    <header
      ref={headerRef}
      role='banner'
      className='fixed inset-x-0 top-0 z-[200] w-full bg-slate-100/95 shadow-md backdrop-blur-sm'
      style={{
        backgroundImage: `url(${HEADER_BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className='mx-auto flex max-w-screen-2xl flex-col items-center justify-between px-3 py-2 sm:px-5 sm:py-4 lg:flex-row'>
        {/* Logo */}
        <div className='ml-1 flex w-full items-center justify-between sm:ml-3 lg:ml-6 lg:w-auto'>
          <Link
            lang={locale}
            href='/'
            aria-label='Cascais Volley Cup 2026 - Go to homepage'
            onClick={handleLogoClick}
            className='rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2'
          >
            <Image
              src={Logo}
              alt='Cascais Volley Cup 2026'
              loading='eager'
              quality={80}
              sizes='(max-width: 640px) 150px, (max-width: 1024px) 190px, 240px'
              className='h-8 w-auto transition-transform hover:scale-105 sm:h-10 md:h-12 lg:h-14'
            />
          </Link>

          {/* Lang + Mobile/Tablet menu button */}
          <div className='flex items-center gap-3 lg:hidden'>
            <LangButton />
            <button
              onClick={toggleMenu}
              aria-label={
                menuOpen ? 'Close navigation menu' : 'Open navigation menu'
              }
              aria-expanded={menuOpen}
              aria-controls='mobile-nav'
              className='rounded-md p-2 transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300'
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

        {/* Desktop nav (only on lg+ screens) */}
        <nav
          aria-label='Primary navigation'
          className='hidden items-center gap-7 lg:inline-flex xl:gap-8'
        >
          <NavLinks locale={locale} />
          <LangButton />
        </nav>

        {/* Mobile/Tablet dropdown */}
        <nav
          id='mobile-nav'
          aria-label='Mobile navigation'
          aria-hidden={!menuOpen}
          className={clsx(
            'w-full flex-col items-start gap-4 overflow-hidden transition-all ease-in-out motion-safe:duration-300 lg:hidden',
            menuOpen
              ? 'mt-3 flex max-h-[65vh] translate-y-0 opacity-100'
              : 'pointer-events-none max-h-0 -translate-y-2 opacity-0'
          )}
        >
          <NavLinks locale={locale} isMobile />
        </nav>
      </div>
    </header>
  )
}

const NavLinks: FC<{
  locale: string
  isMobile?: boolean
}> = ({ locale, isMobile = false }) => {
  const t = useTranslations('Header')
  const pathname = usePathname()

  const links = useMemo(
    () => [
      { href: '/about' as StaticPathname, label: t('About') },
      { href: '/accommodation' as StaticPathname, label: t('Accommodation') },
      { href: '/program' as StaticPathname, label: t('Program') },
      { href: '/competition' as StaticPathname, label: t('Competition') },
      { href: '/gallery' as StaticPathname, label: t('Gallery') },
      { href: '/hall-of-fame' as StaticPathname, label: t('Hall_of_Fame') },
      {
        href: '/registration' as StaticPathname,
        label: t('Registration'),
        cta: true
      }
    ],
    [t]
  )

  const isActive = useCallback(
    (href: string) => {
      const withLocale = `/${locale}${href}`
      return pathname === withLocale || pathname.startsWith(withLocale + '/')
    },
    [pathname, locale]
  )

  return (
    <>
      {links.map(({ href, label, cta }) => {
        const active = isActive(href)

        if (cta) {
          return (
            <Link
              key={href}
              lang={locale}
              href={href}
              aria-current={active ? 'page' : undefined}
              aria-label={`${label} - Call to action`}
              className={clsx(
                'inline-flex items-center font-semibold shadow-sm motion-safe:transition-all motion-safe:duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2',
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
            lang={locale}
            href={href}
            className={clsx(
              'group relative pb-0.5 font-medium transition-colors hover:text-sky-700',
              'rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2',
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

const LangButton: FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={clsx(
        'lang-sky inline-flex items-center rounded bg-sky-700/90 px-2 py-0.5 text-xs font-medium text-white shadow-sm backdrop-blur-sm',
        'focus-within:outline-none focus-within:ring-2 focus-within:ring-sky-300 focus-within:ring-offset-2',
        'transition-all hover:bg-sky-800 hover:shadow-md sm:rounded-md sm:px-2.5 sm:py-1 sm:text-sm',
        className
      )}
    >
      <LangSwitcher />
    </div>
  )
}
