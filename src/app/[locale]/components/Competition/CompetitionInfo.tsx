'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { FiDownload } from 'react-icons/fi'
import clsx from 'clsx'

// Types
interface RuleItemProps {
  children: React.ReactNode
  index: number
  isVisible: boolean
}

// Constants for better maintainability
const ASSETS = {
  background: '/img/about/about-bg.webp',
  waveTop: '/img/global/ondas-5.webp',
  waveBottom: '/img/global/ondas-3.webp',
  sponsors: {
    fpv: '/img/sponsors/fpv.webp',
    cascais: '/img/sponsors/cascais-camara.webp',
    camFord: '/img/sponsors/cam-ford.webp',
    cascaisEstoril: '/img/sponsors/cascais-estoril.webp'
  }
} as const

export default function CompetitionInfo() {
  const t = useTranslations('CompetitionPage.Info')
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Sponsor data for the 2x2 grid
  const sponsors = [
    {
      src: ASSETS.sponsors.fpv,
      alt: 'Federação Portuguesa de Voleibol',
      width: 160,
      height: 64
    },
    {
      src: ASSETS.sponsors.cascais,
      alt: 'Câmara Municipal de Cascais',
      width: 160,
      height: 64
    },
    {
      src: ASSETS.sponsors.camFord,
      alt: 'C.A.M. Ford',
      width: 160,
      height: 64
    },
    {
      src: ASSETS.sponsors.cascaisEstoril,
      alt: 'Cascais Estoril',
      width: 160,
      height: 64
    }
  ] as const

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Prepare rule items
  const ruleItems = [
    t.rich('rules.item1', {
      b: chunks => (
        <strong className='font-extrabold text-sky-700'>{chunks}</strong>
      )
    }),
    t.rich('rules.item2', {
      b: chunks => (
        <strong className='font-extrabold text-sky-700'>{chunks}</strong>
      )
    }),
    t.rich('rules.item3', {
      b: chunks => (
        <strong className='font-extrabold text-sky-700'>{chunks}</strong>
      )
    }),
    t.rich('rules.item4', {
      b: chunks => (
        <strong className='font-extrabold text-sky-700'>{chunks}</strong>
      )
    }),
    t.rich('rules.item5', {
      b: chunks => (
        <strong className='font-extrabold text-sky-700'>{chunks}</strong>
      )
    })
  ].filter(Boolean)

  const noteItems = [
    t.rich('notes.p1', {
      b: chunks => (
        <strong className='font-extrabold text-sky-700'>{chunks}</strong>
      )
    }),
    t('notes.p2'),
    t.rich('notes.p3', {
      b: chunks => (
        <strong className='font-extrabold text-sky-700'>{chunks}</strong>
      )
    }),
    t.rich('notes.p4', {
      b: chunks => (
        <strong className='font-extrabold text-sky-700'>{chunks}</strong>
      )
    })
  ].filter(Boolean)

  return (
    <section
      ref={sectionRef}
      className='relative w-full overflow-hidden'
      aria-labelledby='competition-info-title'
    >
      {/* Background Layer */}
      <BackgroundImage />

      {/* Main Content */}
      <div className='relative z-10 mx-auto max-w-screen-xl px-4 pb-12 pt-8 sm:pb-16 sm:pt-10 lg:pb-20 lg:pt-12'>
        <div className='grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12'>
          {/* Content Section */}
          <ContentSection
            title={t('title')}
            intro={t('intro')}
            ruleItems={ruleItems}
            noteItems={noteItems}
            isVisible={isVisible}
          />

          {/* Sponsors Section - Right Side */}
          <SponsorsSection sponsors={sponsors} isVisible={isVisible} />
        </div>
      </div>

      {/* Wave Section - No sponsor overlay here now */}
      <WaveSection isVisible={isVisible} />
    </section>
  )
}

// Background component
function BackgroundImage() {
  return (
    <div className='absolute inset-0 -z-10'>
      <Image
        src={ASSETS.background}
        alt=''
        fill
        className='object-cover'
        quality={75}
        placeholder='blur'
        blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
        loading='eager'
        draggable={false}
        aria-hidden='true'
      />
    </div>
  )
}

// Content section component
function ContentSection({
  title,
  intro,
  ruleItems,
  noteItems,
  isVisible
}: {
  title: string
  intro: string
  ruleItems: React.ReactNode[]
  noteItems: React.ReactNode[]
  isVisible: boolean
}) {
  return (
    <div className='space-y-6 lg:col-span-7'>
      {/* Title */}
      <header>
        <h1
          id='competition-info-title'
          className={clsx(
            'text-2xl font-extrabold uppercase tracking-wide text-sky-500 sm:text-3xl lg:text-4xl',
            'transition-all duration-1000 ease-out',
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          )}
        >
          {title}
        </h1>
      </header>

      {/* Introduction */}
      {intro && (
        <div
          className={clsx(
            'transition-all delay-200 duration-1000 ease-out',
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          )}
        >
          <p className='text-sm leading-relaxed text-slate-800/90 sm:text-base lg:text-lg'>
            {intro}
          </p>
        </div>
      )}

      {/* Rules List */}
      {ruleItems.length > 0 && (
        <div
          className={clsx(
            'delay-400 transition-all duration-1000 ease-out',
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          )}
        >
          <RulesList items={ruleItems} isVisible={isVisible} />
        </div>
      )}

      {/* Notes Section */}
      {noteItems.length > 0 && (
        <div
          className={clsx(
            'delay-600 space-y-4 transition-all duration-1000 ease-out',
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          )}
        >
          {noteItems.map((note, index) => (
            <p
              key={index}
              className='text-sm leading-relaxed text-slate-800/90 sm:text-base lg:text-lg'
            >
              {note}
            </p>
          ))}
        </div>
      )}

      {/* Regulations Download Button */}
      <div
        className={clsx(
          'delay-800 transition-all duration-1000 ease-out',
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        )}
      >
        <RegulationsButton />
      </div>
    </div>
  )
}

// Rules list component
function RulesList({
  items,
  isVisible
}: {
  items: React.ReactNode[]
  isVisible: boolean
}) {
  return (
    <ul className='space-y-3 pl-5' role='list' aria-label='Competition rules'>
      {items.map((item, index) => (
        <RuleItem key={index} index={index} isVisible={isVisible}>
          {item}
        </RuleItem>
      ))}
    </ul>
  )
}

// Individual rule item with staggered animation
function RuleItem({ children, index, isVisible }: RuleItemProps) {
  return (
    <li
      className={clsx(
        'relative text-sm leading-relaxed text-slate-800/90 transition-all duration-700 ease-out sm:text-base lg:text-lg',
        'before:absolute before:-left-5 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-sky-500',
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
      )}
      style={{
        transitionDelay: `${800 + index * 100}ms`
      }}
    >
      <div className='pl-1'>{children}</div>
    </li>
  )
}

// Sponsors section component with 2x2 grid
function SponsorsSection({
  sponsors,
  isVisible
}: {
  sponsors: readonly {
    src: string
    alt: string
    width: number
    height: number
  }[]
  isVisible: boolean
}) {
  return (
    <div className='flex items-center lg:col-span-5'>
      <div
        className={clsx(
          'sponsors-container relative z-20 mx-auto flex h-auto w-full max-w-[400px] flex-col items-center justify-center',
          'transition-all delay-300 duration-1000 ease-out',
          isVisible
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-12 scale-95 opacity-0'
        )}
      >
        {/* Desktop: 2x2 Grid */}
        <div className='hidden sm:grid sm:grid-cols-2 sm:gap-10 lg:gap-16'>
          {sponsors.map((sponsor, index) => (
            <div
              key={sponsor.alt}
              className={clsx(
                'flex items-center justify-center transition-all duration-700 ease-out',
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              )}
              style={{
                transitionDelay: `${500 + index * 150}ms`
              }}
            >
              <Image
                src={sponsor.src}
                alt={sponsor.alt}
                width={sponsor.width}
                height={sponsor.height}
                className='h-auto w-full max-w-[160px] object-contain drop-shadow-lg transition-transform duration-300 hover:scale-105'
                sizes='(max-width: 1024px) 160px, 160px'
                quality={80}
                loading='lazy'
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Mobile: 2x2 Grid with smaller spacing */}
        <div className='grid grid-cols-2 gap-10 sm:hidden'>
          {sponsors.map((sponsor, index) => (
            <div
              key={sponsor.alt}
              className={clsx(
                'flex items-center justify-center transition-all duration-700 ease-out',
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              )}
              style={{
                transitionDelay: `${500 + index * 150}ms`
              }}
            >
              <Image
                src={sponsor.src}
                alt={sponsor.alt}
                width={sponsor.width}
                height={sponsor.height}
                className='h-auto w-full max-w-[120px] object-contain drop-shadow-lg transition-transform duration-300 hover:scale-105'
                sizes='120px'
                quality={80}
                loading='lazy'
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Simplified Regulations download button component
function RegulationsButton() {
  return (
    <a
      href='/docs/CVCUP-2026-Regulamento-PT.pdf'
      download='CVCUP-2026-Regulamento-PT.pdf'
      className={clsx(
        'group inline-flex items-center gap-3 rounded-lg px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300',
        'bg-gradient-to-r from-sky-600 to-sky-700',
        'hover:scale-105 hover:from-sky-700 hover:to-sky-800 hover:shadow-xl',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2',
        'active:scale-95'
      )}
      aria-label='Download tournament regulations PDF'
    >
      <FiDownload
        className='h-4 w-4 transition-transform duration-300 group-hover:scale-110'
        aria-hidden='true'
      />
      <span className='text-sm sm:text-base'>Regulations</span>
    </a>
  )
}

// Wave section without sponsor overlay
function WaveSection({ isVisible }: { isVisible: boolean }) {
  return (
    <div className='relative -mt-6 sm:-mt-8 lg:-mt-10'>
      {/* Wave Image */}
      <Image
        src={ASSETS.waveBottom}
        alt=''
        width={2048}
        height={160}
        className='block h-[110px] w-full object-cover sm:h-[130px] lg:h-auto lg:object-contain'
        quality={75}
        loading='lazy'
        draggable={false}
        aria-hidden='true'
      />
    </div>
  )
}
