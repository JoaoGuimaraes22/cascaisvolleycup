'use client'

import Image from 'next/image'
import { useState } from 'react'
import { FiMail } from 'react-icons/fi'
import clsx from 'clsx'
import { useIntersectionObserver } from '../../_hooks/use-intersection-observer'
import { WAVE_HEIGHT, GLOBAL_ASSETS } from '../../_lib/constants'
import ContactToast from '../global/contact-toast'

type AccommodationHeroDict = {
  title: string
  schools: {
    title: string
    p1: string
    list: Record<string, string>
    p2: string
    p2Bold: string
    p2_cont: string
  }
  hotel: {
    title: string
    p1: string
    pBold: string
    p1_cont: string
  }
  food: {
    title: string
    p1: string
    scheduleTitle: string
    breakfast: string
    lunch: string
    dinner: string
    intolerances: string
    contactButton: string
  }
  playerAlt: string
}

type ContactToastDict = React.ComponentProps<typeof ContactToast>['dict']

type Props = {
  dict: AccommodationHeroDict
  contactToastDict: ContactToastDict
}

export default function AccommodationHero({ dict, contactToastDict }: Props) {
  const { ref: sectionRef, isVisible } = useIntersectionObserver<HTMLElement>()
  const [backgroundLoaded, setBackgroundLoaded] = useState(false)
  const [showContactToast, setShowContactToast] = useState(false)

  // ===== Constants =====
  const ASSETS = {
    background: '/img/accommodation/hero-bg.webp',
    wave: GLOBAL_ASSETS.wave,
    player: '/img/accommodation/ac-player.webp'
  } as const

  return (
    <section
      ref={sectionRef}
      className='relative min-h-[90vh] w-full overflow-hidden'
      style={{ paddingBottom: `${WAVE_HEIGHT}px` }}
      aria-labelledby='accommodation-title'
    >
      {/* Enhanced Background */}
      <div className='absolute inset-0 -z-10'>
        <div className='absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100' />
        <Image
          src={ASSETS.background}
          alt=''
          role='presentation'
          fill
          className={clsx(
            'object-cover duration-700 motion-safe:transition-opacity',
            backgroundLoaded ? 'opacity-100' : 'opacity-0'
          )}
          sizes='100vw'
          priority
          quality={75}
          onLoad={() => setBackgroundLoaded(true)}
        />
      </div>

      {/* Mobile: Enhanced player background */}
      <div className='pointer-events-none absolute inset-x-0 top-0 z-0 h-[80vh] lg:hidden'>
        <Image
          src={ASSETS.player}
          alt=''
          role='presentation'
          fill
          quality={60}
          loading='lazy'
          className={clsx(
            'object-contain object-top duration-1000 motion-safe:transition-opacity',
            isVisible ? 'opacity-20' : 'opacity-10'
          )}
          sizes='(max-width: 1024px) 100vw, 0px'
        />
      </div>

      {/* Content */}
      <div className='relative z-10 mx-auto max-w-screen-xl px-4 pt-8 sm:pt-12'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-12'>
          {/* LEFT CONTENT */}
          <div className='relative lg:col-span-7'>
            {/* Title */}
            <div
              className={clsx(
                'mb-8 duration-1000 ease-out motion-safe:transition-all',
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              )}
            >
              <h1
                id='accommodation-title'
                className='text-2xl font-extrabold tracking-wide text-sky-500 uppercase sm:text-3xl lg:text-4xl'
              >
                {dict.title}
              </h1>
            </div>

            {/* Schools Section */}
            <AccommodationSection
              title={dict.schools.title}
              delay={200}
              isVisible={isVisible}
            >
              <p className='mb-4 text-sm leading-relaxed text-slate-800/90 sm:text-base'>
                {dict.schools.p1}
              </p>
              <p className='text-sm leading-relaxed text-slate-800/90 sm:text-base'>
                {dict.schools.p2} <strong>{dict.schools.p2Bold}</strong>{' '}
                {dict.schools.p2_cont}
              </p>
            </AccommodationSection>

            {/* Food Section */}
            <AccommodationSection
              title={dict.food.title}
              delay={600}
              isVisible={isVisible}
            >
              <p className='mb-4 text-sm leading-relaxed text-slate-800/90 sm:text-base'>
                {dict.food.p1}
              </p>

              <p className='mb-4 text-sm leading-relaxed text-slate-800/90 sm:text-base'>
                {dict.food.scheduleTitle}
              </p>

              <ul className='mb-4 space-y-3'>
                <li className='flex items-start gap-3 text-sm leading-relaxed text-slate-800/90 sm:text-base'>
                  <span className='mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sky-500' />
                  <span>
                    <span className='font-semibold'>{dict.food.breakfast}</span>
                  </span>
                </li>
                <li className='flex items-start gap-3 text-sm leading-relaxed text-slate-800/90 sm:text-base'>
                  <span className='mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sky-500' />
                  <span>
                    <span className='font-semibold'>{dict.food.lunch}</span>
                  </span>
                </li>
                <li className='flex items-start gap-3 text-sm leading-relaxed text-slate-800/90 sm:text-base'>
                  <span className='mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sky-500' />
                  <span>
                    <span className='font-semibold'>{dict.food.dinner}</span>
                  </span>
                </li>
              </ul>

              <p className='mb-6 text-sm leading-relaxed text-slate-800/90 sm:text-base'>
                {dict.food.intolerances}
              </p>
            </AccommodationSection>

            {/* Hotel Section */}
            <AccommodationSection
              title={dict.hotel.title}
              delay={400}
              isVisible={isVisible}
            >
              <p className='mb-6 text-sm leading-relaxed text-slate-800/90 sm:text-base'>
                {dict.hotel.p1}
                <strong>{dict.hotel.pBold}</strong>
                {dict.hotel.p1_cont}
              </p>

              <ContactOSportsButton
                onOpenModal={() => setShowContactToast(true)}
              />
            </AccommodationSection>
          </div>

          {/* RIGHT CONTENT - Player Image WITH FADE EFFECT */}
          <div className='relative lg:col-span-5'>
            <div
              className={clsx(
                'absolute inset-y-0 hidden w-[45vw] max-w-[900px] duration-1000 ease-out motion-safe:transition-all lg:block',
                // Add the fade mask effect here
                '[-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_75%,transparent_100%)]',
                '[mask-image:linear-gradient(to_bottom,black_0%,black_75%,transparent_100%)]',
                isVisible
                  ? 'translate-x-0 opacity-100'
                  : 'translate-x-8 opacity-0'
              )}
              style={{ transitionDelay: '600ms' }}
            >
              <Image
                quality={70}
                loading='lazy'
                src={ASSETS.player}
                alt={dict.playerAlt}
                fill
                className='object-contain object-bottom duration-300 hover:scale-105 motion-safe:transition-transform'
                sizes='(max-width: 1280px) 65vw, 900px'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Simple Wave without Stats */}
      <SimpleWave waveSrc={ASSETS.wave} waveHeight={WAVE_HEIGHT} />

      {/* ContactToast Modal - Outside of content containers */}
      <ContactToast
        isOpen={showContactToast}
        onClose={() => setShowContactToast(false)}
        dict={contactToastDict}
      />
    </section>
  )
}

/* --- Enhanced Components --- */

interface AccommodationSectionProps {
  title: string
  children: React.ReactNode
  delay: number
  isVisible: boolean
}

function AccommodationSection({
  title,
  children,
  delay,
  isVisible
}: AccommodationSectionProps) {
  return (
    <section
      className={clsx(
        'mb-8 space-y-4 duration-700 ease-out motion-safe:transition-all',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <h2 className='text-lg font-extrabold tracking-wide text-sky-600 uppercase sm:text-xl'>
        {title}
      </h2>
      {children}
    </section>
  )
}

function ContactOSportsButton({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <button
      onClick={onOpenModal}
      className='group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-sky-600 px-6 py-3 text-sm font-bold text-white shadow-lg ring-1 ring-black/10 duration-300 hover:scale-105 hover:bg-sky-700 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 motion-safe:transition-all sm:text-base'
    >
      <FiMail className='h-4 w-4 duration-300 group-hover:-translate-y-0.5 motion-safe:transition-transform' />
      <span>Contact O&apos;Sports</span>
    </button>
  )
}

function SimpleWave({
  waveSrc,
  waveHeight
}: {
  waveSrc: string
  waveHeight: number
}) {
  return (
    <div className='pointer-events-none absolute bottom-0 left-1/2 w-screen -translate-x-1/2'>
      <div className='relative' style={{ height: `${waveHeight}px` }}>
        <Image
          src={waveSrc}
          alt=''
          role='presentation'
          fill
          sizes='100vw'
          className='object-cover object-top'
          loading='lazy'
          unoptimized
        />
      </div>
    </div>
  )
}
