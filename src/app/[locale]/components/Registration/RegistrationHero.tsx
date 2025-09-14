'use client'

import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { MouseEvent, useState } from 'react'
import { FiMail } from 'react-icons/fi'
import ContactToast from '../Global/ContactToast'

export default function RegistrationHero() {
  const t = useTranslations('RegistrationPage.RegistrationHero')
  const locale = useLocale()
  const [showContactToast, setShowContactToast] = useState(false)

  // Assets
  const ASSETS = {
    background: '/img/registration/hero-bg.webp',
    player: '/img/global/players-1.webp',
    wave: '/img/global/ondas-3.webp'
  } as const

  // Language mapping for brochure files
  const getLanguageCode = (locale: string) => {
    const languageMap = {
      en: 'UK',
      es: 'ESP',
      pt: 'PT',
      fr: 'FRAN'
    } as const

    return languageMap[locale as keyof typeof languageMap] || 'UK'
  }

  const getBrochureFileName = () => {
    const langCode = getLanguageCode(locale)
    return `CVCUP-2026-CONVITE-${langCode}.pdf`
  }

  const WAVE_HEIGHT = 135

  const handleScrollToForm = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const formElement = document.getElementById('registration-form')

    if (!formElement) {
      window.location.hash = '#registration-form'
      return
    }

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    formElement.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start'
    })
  }

  return (
    <section
      className='relative w-full overflow-hidden'
      style={{
        minHeight: '89svh',
        maxHeight: 'none'
      }}
      aria-labelledby='registration-title'
    >
      {/* Background Image - Default background for desktop */}
      <div className='absolute inset-0 -z-20 hidden lg:block'>
        <Image
          src={ASSETS.background}
          alt=''
          fill
          priority
          sizes='100vw'
          className='object-cover'
          quality={75}
        />
      </div>

      {/* Mobile Background - Player image as background with opacity and greyscale */}
      <div className='absolute inset-0 -z-10 lg:hidden'>
        {/* Original background */}
        <Image
          src={ASSETS.background}
          alt=''
          fill
          priority
          sizes='100vw'
          className='object-cover'
          quality={75}
        />
        {/* Player image overlay - Centered and more visible */}
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='relative h-[500px] w-[300px] sm:h-[600px] sm:w-[400px]'>
            <Image
              src={ASSETS.player}
              alt=''
              role='presentation'
              fill
              sizes='(max-width: 640px) 300px, 400px'
              className='object-contain object-center opacity-15 grayscale-[60%]'
              quality={75}
              priority
            />
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div
        className='relative z-10 mx-auto max-w-screen-xl px-4 pt-8 sm:pt-12'
        style={{ paddingBottom: `${WAVE_HEIGHT + 40}px` }}
      >
        {/* Content Grid */}
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-12'>
          {/* Left Column: Registration Content */}
          <div className='flex flex-col justify-center lg:col-span-7'>
            <div className='space-y-6'>
              {/* Main Title */}
              <h1
                id='registration-title'
                className='text-2xl font-extrabold uppercase tracking-wide text-sky-500 sm:text-3xl lg:text-4xl'
              >
                {t('title')}
              </h1>

              {/* School Accommodation Section */}
              <div className='space-y-4'>
                <h2 className='text-lg font-extrabold uppercase tracking-wide text-sky-600 sm:text-xl'>
                  {t('schoolAccommodation.title')}
                </h2>

                <p className='text-sm leading-relaxed text-slate-800/90 sm:text-base'>
                  {t('schoolAccommodation.description')}
                </p>

                {/* Pricing Options - Tab Style */}
                <div className='space-y-1'>
                  {/* Early Bird Tab */}
                  <div className='rounded-lg bg-transparent p-4 shadow-sm'>
                    <div className='mb-2 flex flex-wrap items-baseline gap-2'>
                      <span className='font-extrabold uppercase tracking-wide text-sky-700'>
                        {t('pricing.earlyBird.label')}
                      </span>
                      <span className='text-sm text-slate-700'>
                        {t('pricing.earlyBird.period')}
                      </span>
                      <span className='font-bold text-sky-800'>
                        {t('pricing.earlyBird.price')}
                      </span>
                    </div>
                    <p className='text-sm text-slate-700'>
                      {t('pricing.earlyBird.details')}
                    </p>
                  </div>

                  {/* Regular Bird Tab */}
                  <div className='rounded-lg bg-transparent p-4 shadow-sm'>
                    <div className='mb-2 flex flex-wrap items-baseline gap-2'>
                      <span className='font-extrabold uppercase tracking-wide text-sky-700'>
                        {t('pricing.regularBird.label')}
                      </span>
                      <span className='text-sm text-slate-700'>
                        {t('pricing.regularBird.period')}
                      </span>
                      <span className='font-bold text-sky-800'>
                        {t('pricing.regularBird.price')}
                      </span>
                    </div>
                    <p className='text-sm text-slate-700'>
                      {t('pricing.regularBird.details')}
                    </p>
                  </div>
                </div>

                {/* Team Requirements */}
                <p className='text-sm text-slate-700 sm:text-base'>
                  {t('teamRequirements')}
                </p>

                {/* Payment Information */}
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-slate-700'>
                    {t('paymentInfo.instruction')}
                  </p>

                  <div className='rounded-lg bg-transparent p-4 text-sm'>
                    <p className='font-bold uppercase text-sky-700'>
                      {t('paymentInfo.account.name')}
                    </p>
                    <p className='text-slate-700'>
                      <span className='font-medium'>IBAN:</span>{' '}
                      {t('paymentInfo.account.iban')}
                    </p>
                    <p className='text-slate-700'>
                      <span className='font-medium'>BIC/Swift:</span>{' '}
                      {t('paymentInfo.account.bic')}
                    </p>
                    <p className='text-slate-700'>
                      <span className='font-medium'>NIB:</span>{' '}
                      {t('paymentInfo.account.nib')}
                    </p>
                  </div>
                </div>

                {/* Registration Notice */}
                <p className='text-sm text-slate-700 sm:text-base'>
                  {t('registrationNotice')}
                </p>

                {/* Action Buttons */}
                <div className='flex flex-col gap-4 pt-4 sm:flex-row'>
                  <a
                    href={`/docs/${getBrochureFileName()}`}
                    download={getBrochureFileName()}
                    className='inline-flex items-center justify-center rounded-lg bg-sky-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-sky-700 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2'
                  >
                    {t('buttons.brochure')}
                  </a>

                  <button
                    onClick={handleScrollToForm}
                    className='inline-flex items-center justify-center rounded-lg bg-sky-700 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-sky-800 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2'
                  >
                    {t('buttons.registerTeams')}
                  </button>
                </div>
              </div>

              {/* Hotel Accommodation Section */}
              <div className='space-y-4 border-t border-sky-200 pt-6'>
                <h2 className='text-lg font-extrabold uppercase tracking-wide text-sky-600 sm:text-xl'>
                  {t('hotelAccommodation.title')}
                </h2>

                <p className='text-sm leading-relaxed text-slate-800/90 sm:text-base'>
                  {t('hotelAccommodation.description')}
                </p>

                <ContactOSportsButton
                  onOpenModal={() => setShowContactToast(true)}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Player Image - Desktop Only */}
          <div className='relative hidden lg:col-span-5 lg:flex lg:items-center lg:justify-center'>
            <div className='relative h-[500px] w-full max-w-[400px] xl:h-[600px] xl:max-w-[480px]'>
              <div
                className='absolute inset-0'
                style={{
                  maskImage:
                    'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)',
                  WebkitMaskImage:
                    'linear-gradient(to bottom, black 0%, black 70%, transparent 100%)'
                }}
              >
                <Image
                  src={ASSETS.player}
                  alt={t('playerAlt') || 'Beach volleyball player'}
                  fill
                  sizes='(max-width: 1280px) 400px, 480px'
                  className='object-contain object-bottom transition-transform duration-300 hover:scale-105'
                  priority
                  quality={80}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave - No Stats */}
      <div className='relative z-0'>
        <WaveSection waveAsset={ASSETS.wave} waveHeight={WAVE_HEIGHT} />
      </div>

      {/* ContactToast Modal - Outside of content containers */}
      <ContactToast
        isOpen={showContactToast}
        onClose={() => setShowContactToast(false)}
      />
    </section>
  )
}

/* -------- Wave Section Component -------- */
interface WaveSectionProps {
  waveAsset: string
  waveHeight: number
}

function WaveSection({ waveAsset, waveHeight }: WaveSectionProps) {
  return (
    <div className='absolute bottom-0 left-1/2 w-screen -translate-x-1/2'>
      {/* Desktop Version */}
      <div className='relative hidden lg:block'>
        <Image
          src={waveAsset}
          alt=''
          width={2048}
          height={waveHeight}
          sizes='100vw'
          className='-mb-px block h-auto w-full'
          style={{ height: `${waveHeight}px` }}
          quality={75}
          loading='lazy'
        />
      </div>

      {/* Mobile Version */}
      <div
        className='relative lg:hidden'
        style={{
          backgroundImage: `url(${waveAsset})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: `${waveHeight}px`
        }}
      />
    </div>
  )
}

/* -------- Contact O-Sports Components -------- */

// Updated Contact Button using Global ContactToast
interface ContactOSportsButtonProps {
  onOpenModal: () => void
}

function ContactOSportsButton({ onOpenModal }: ContactOSportsButtonProps) {
  const t = useTranslations('RegistrationPage.RegistrationHero')

  return (
    <button
      onClick={onOpenModal}
      className='group inline-flex items-center gap-2 rounded-lg bg-sky-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-sky-700 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2'
    >
      <FiMail className='h-4 w-4 transition-transform duration-300 group-hover:rotate-12' />
      <span>{t('buttons.osports')}</span>
    </button>
  )
}
