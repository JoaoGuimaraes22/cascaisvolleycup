'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState, useCallback, useTransition } from 'react'
import { FiGlobe } from 'react-icons/fi'
import clsx from 'clsx'
import { i18n, type Locale } from '@/i18n-config'

type Props = {
  currentLocale: Locale
  localeNames: Record<string, string>
}

export default function LocaleSwitcher({ currentLocale, localeNames }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  const handleLocaleChange = useCallback(
    (newLocale: Locale) => {
      const segments = pathname.split('/')
      segments[1] = newLocale
      const nextPath = segments.join('/')
      startTransition(() => {
        router.replace(nextPath)
      })
      setOpen(false)
    },
    [router, pathname]
  )

  return (
    <div className='flex items-center justify-center'>
      <div className='relative'>
        <button
          type='button'
          className={clsx(
            'inline-flex w-full items-center justify-between gap-2 text-sm font-medium motion-safe:transition-opacity',
            isPending && 'opacity-60'
          )}
          onClick={() => setOpen(v => !v)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          aria-expanded={open}
          aria-haspopup='true'
          aria-label='Select language'
        >
          {currentLocale.toUpperCase()}
          <FiGlobe className='h-4 w-4' />
        </button>

        {open && (
          <div
            className='absolute right-0 z-50 mt-2 min-w-[140px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/10'
            role='menu'
            aria-orientation='vertical'
            aria-label='Language options'
          >
            <div className='py-1'>
              {i18n.locales.map(locale => (
                <button
                  key={locale}
                  type='button'
                  lang={locale}
                  role='menuitem'
                  onMouseDown={e => {
                    e.preventDefault()
                    handleLocaleChange(locale)
                  }}
                  className={clsx(
                    'block w-full px-4 py-2 text-left text-sm motion-safe:transition-colors',
                    currentLocale === locale
                      ? 'bg-sky-50 font-medium text-sky-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  {localeNames[locale]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
