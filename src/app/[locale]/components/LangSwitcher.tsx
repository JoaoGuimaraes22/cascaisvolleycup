// src/app/[locale]/components/LangSwitcher.tsx
'use client'

import { useRouter, usePathname } from '@/src/navigation'
import { useLocale } from 'next-intl'
import React, { useState, useCallback, useTransition } from 'react'
import { FiGlobe } from 'react-icons/fi'
import clsx from 'clsx'

interface LangOption {
  country: string
  code: string
}

const LANG_OPTIONS: LangOption[] = [
  { country: 'English', code: 'en' },
  { country: 'Português', code: 'pt' },
  { country: 'Français', code: 'fr' },
  { country: 'Español', code: 'es' }
]

const LangSwitcher: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()
  const currentLocale = useLocale()
  const [isPending, startTransition] = useTransition()
  const [isOptionsExpanded, setIsOptionsExpanded] = useState(false)

  const handleLocaleChange = useCallback(
    (newLocale: string) => {
      startTransition(() => {
        router.replace({ pathname }, { locale: newLocale })
      })
      setIsOptionsExpanded(false)
    },
    [router, pathname]
  )

  return (
    <div className='flex items-center justify-center'>
      <div className='relative'>
        <button
          className={clsx(
            'inline-flex w-full items-center justify-between gap-2 text-sm font-medium motion-safe:transition-opacity',
            isPending && 'opacity-60'
          )}
          onClick={() => setIsOptionsExpanded(!isOptionsExpanded)}
          onBlur={() => {
            // Delay to allow click on menu items
            setTimeout(() => setIsOptionsExpanded(false), 150)
          }}
          aria-expanded={isOptionsExpanded}
          aria-haspopup='true'
          aria-label='Select language'
        >
          {currentLocale.toUpperCase()}
          <FiGlobe className='h-4 w-4' />
        </button>

        {isOptionsExpanded && (
          <div
            className='absolute right-0 z-50 mt-2 min-w-[140px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/10'
            role='menu'
            aria-orientation='vertical'
            aria-label='Language options'
          >
            <div className='py-1'>
              {LANG_OPTIONS.map(lang => (
                <button
                  key={lang.code}
                  lang={lang.code}
                  role='menuitem'
                  onMouseDown={e => {
                    e.preventDefault()
                    handleLocaleChange(lang.code)
                  }}
                  className={clsx(
                    'block w-full px-4 py-2 text-left text-sm motion-safe:transition-colors',
                    currentLocale === lang.code
                      ? 'bg-sky-50 font-medium text-sky-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  {lang.country}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LangSwitcher
