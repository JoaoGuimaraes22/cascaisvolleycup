'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { FiMapPin } from 'react-icons/fi'
import clsx from 'clsx'
import type { RegistrationFormDict } from './registration-toast'

const RegistrationToast = dynamic(() => import('./registration-toast'), {
  ssr: false
})

type Props = {
  label: string
  size?: 'sm' | 'lg'
  registrationFormDict: RegistrationFormDict
}

export default function PlanTripCta({
  label,
  size = 'sm',
  registrationFormDict
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type='button'
        onClick={() => setOpen(true)}
        className={clsx(
          'group relative overflow-hidden rounded-full bg-gradient-to-r from-sky-600 to-sky-700 font-bold text-white shadow-xl ring-1 ring-black/10 duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 motion-safe:transition-all',
          size === 'lg'
            ? 'px-8 py-4 text-base'
            : 'px-6 py-3 text-sm sm:text-base'
        )}
      >
        <span className='relative z-10 flex items-center gap-2'>
          <FiMapPin className={size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />
          {label}
        </span>
        <div className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent duration-700 group-hover:translate-x-full motion-safe:transition-transform' />
      </button>

      {open && (
        <RegistrationToast
          isOpen={open}
          onClose={() => setOpen(false)}
          dict={registrationFormDict}
        />
      )}
    </>
  )
}
