'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState, useCallback } from 'react'
import { FiCheck, FiAlertCircle, FiLoader } from 'react-icons/fi'
import clsx from 'clsx'

interface FormData {
  name: string
  email: string
  mobile: string
  club: string
  city: string
  country: string
  questions: string
}

interface FormErrors {
  [key: string]: string
}

type MessageType = 'success' | 'error' | 'info' | null

export default function RegistrationForm() {
  const t = useTranslations('RegistrationPage.Form')

  // Assets
  const BG = '/img/registration/hero-bg.webp'
  const PLAYER_LEFT = '/img/registration/player-left.webp'
  const PLAYER_RIGHT = '/img/registration/player.webp'

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    mobile: '',
    club: '',
    city: '',
    country: '',
    questions: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<MessageType>(null)

  // Form validation
  const validateForm = useCallback(
    (data: FormData): FormErrors => {
      const newErrors: FormErrors = {}

      if (!data.name.trim()) {
        newErrors.name =
          t('ValidationErrors.nameRequired') || 'Name is required'
      } else if (data.name.trim().length < 2) {
        newErrors.name =
          t('ValidationErrors.nameMinLength') ||
          'Name must be at least 2 characters'
      }

      if (!data.email.trim()) {
        newErrors.email =
          t('ValidationErrors.emailRequired') || 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        newErrors.email =
          t('ValidationErrors.emailInvalid') || 'Please enter a valid email'
      }

      if (!data.club.trim()) {
        newErrors.club =
          t('ValidationErrors.clubRequired') || 'Club is required'
      }

      if (!data.city.trim()) {
        newErrors.city =
          t('ValidationErrors.cityRequired') || 'City is required'
      }

      if (!data.country.trim()) {
        newErrors.country =
          t('ValidationErrors.countryRequired') || 'Country is required'
      }

      if (
        data.mobile &&
        !/^[\+]?[\s\-\(\)]*([0-9][\s\-\(\)]*){6,}$/.test(data.mobile)
      ) {
        newErrors.mobile =
          t('ValidationErrors.mobileInvalid') ||
          'Please enter a valid phone number'
      }

      return newErrors
    },
    [t]
  )

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target
      setFormData(prev => ({ ...prev, [name]: value }))

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }))
      }
    },
    [errors]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setMessageType(null)

    // Validate form
    const formErrors = validateForm(formData)
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      setMessage(
        t('ValidationErrors.fixErrors') || 'Please fix the errors above'
      )
      setMessageType('error')
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Network response failed.')
      }

      if (data.success) {
        setMessage(
          t('SuccessMessage') ||
            'Registration successful! We will contact you soon.'
        )
        setMessageType('success')
        setFormData({
          name: '',
          email: '',
          mobile: '',
          club: '',
          city: '',
          country: '',
          questions: ''
        })
      } else {
        setMessage(
          data.message ||
            t('ErrorMessage') ||
            'Registration failed. Please try again.'
        )
        setMessageType('error')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setMessage(t('ErrorMessage') || 'Something went wrong. Please try again.')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      id='registration-form'
      className='relative overflow-hidden py-12 sm:py-16 lg:py-20'
      aria-labelledby='registration-heading'
    >
      {/* Background */}
      <Image
        src={BG}
        alt=''
        role='presentation'
        fill
        sizes='100vw'
        priority
        className='absolute inset-0 -z-20 object-cover'
        quality={75}
      />

      {/* Decorative players (desktop only) */}
      <div
        className='pointer-events-none absolute inset-0 -z-10'
        aria-hidden='true'
      >
        {/* Left player */}
        <div className='absolute left-0 top-1/2 hidden -translate-y-1/2 opacity-30 lg:block'>
          <Image
            src={PLAYER_LEFT}
            alt=''
            width={420}
            height={640}
            className='h-auto w-auto'
            loading='lazy'
            quality={75}
          />
        </div>
        {/* Right player */}
        <div className='absolute right-0 top-1/2 hidden -translate-y-1/2 opacity-30 lg:block'>
          <Image
            src={PLAYER_RIGHT}
            alt=''
            width={420}
            height={640}
            className='h-auto w-auto'
            loading='lazy'
            quality={75}
          />
        </div>
      </div>

      {/* Form container */}
      <div className='mx-auto max-w-screen-md px-4'>
        <div className='rounded-2xl bg-white/95 p-6 shadow-lg ring-1 ring-black/10 backdrop-blur-sm sm:p-8'>
          <form onSubmit={handleSubmit} className='space-y-6' noValidate>
            <div className='text-center'>
              <h2
                id='registration-heading'
                className='text-2xl font-extrabold text-sky-500 sm:text-3xl'
              >
                {t('FormTitle') || 'Tournament Registration'}
              </h2>
              <p className='mt-2 text-sm text-slate-600'>
                {t('FormDescription') ||
                  'Fill out the form below to register for the Cascais Volley Cup 2026'}
              </p>
            </div>

            {/* Name */}
            <FormField
              label={t('Name') || 'Full Name'}
              required
              error={errors.name}
            >
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                className={inputClassName(errors.name)}
                placeholder={t('NamePlaceholder') || 'Enter your full name'}
                required
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
            </FormField>

            {/* Email + Mobile */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <FormField label='Email' required error={errors.email}>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClassName(errors.email)}
                  placeholder='your@email.com'
                  required
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
              </FormField>

              <FormField
                label={t('Mobile') || 'Phone Number'}
                error={errors.mobile}
              >
                <input
                  type='tel'
                  name='mobile'
                  value={formData.mobile}
                  onChange={handleChange}
                  className={inputClassName(errors.mobile)}
                  placeholder='+351 123 456 789'
                  aria-describedby={errors.mobile ? 'mobile-error' : undefined}
                />
              </FormField>
            </div>

            {/* Club */}
            <FormField
              label={t('Club') || 'Club/Team Name'}
              required
              error={errors.club}
            >
              <input
                type='text'
                name='club'
                value={formData.club}
                onChange={handleChange}
                className={inputClassName(errors.club)}
                placeholder={
                  t('ClubPlaceholder') || 'Enter your club or team name'
                }
                required
                aria-describedby={errors.club ? 'club-error' : undefined}
              />
            </FormField>

            {/* City + Country */}
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <FormField
                label={t('City') || 'City'}
                required
                error={errors.city}
              >
                <input
                  type='text'
                  name='city'
                  value={formData.city}
                  onChange={handleChange}
                  className={inputClassName(errors.city)}
                  placeholder={t('CityPlaceholder') || 'Your city'}
                  required
                  aria-describedby={errors.city ? 'city-error' : undefined}
                />
              </FormField>

              <FormField
                label={t('Country') || 'Country'}
                required
                error={errors.country}
              >
                <input
                  type='text'
                  name='country'
                  value={formData.country}
                  onChange={handleChange}
                  className={inputClassName(errors.country)}
                  placeholder={t('CountryPlaceholder') || 'Your country'}
                  required
                  aria-describedby={
                    errors.country ? 'country-error' : undefined
                  }
                />
              </FormField>
            </div>

            {/* Questions */}
            <FormField
              label={t('Questions') || 'Additional Questions or Comments'}
              error={errors.questions}
            >
              <textarea
                name='questions'
                value={formData.questions}
                onChange={handleChange}
                rows={4}
                className={inputClassName(errors.questions)}
                placeholder={
                  t('QuestionsPlaceholder') ||
                  'Any questions, dietary requirements, or special requests...'
                }
                aria-describedby={
                  errors.questions ? 'questions-error' : undefined
                }
              />
            </FormField>

            {/* Submit Button */}
            <div className='pt-4'>
              <button
                type='submit'
                disabled={loading}
                className={clsx(
                  'flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-base font-semibold text-white shadow-lg transition-all',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2',
                  loading
                    ? 'cursor-not-allowed bg-slate-400'
                    : 'bg-sky-700 hover:scale-105 hover:bg-sky-800 hover:shadow-xl active:scale-95'
                )}
                aria-describedby={message ? 'form-message' : undefined}
              >
                {loading ? (
                  <>
                    <FiLoader
                      className='h-5 w-5 animate-spin'
                      aria-hidden='true'
                    />
                    {t('Submitting') || 'Submitting...'}
                  </>
                ) : (
                  <>
                    <FiCheck className='h-5 w-5' aria-hidden='true' />
                    {t('Submit') || 'Submit Registration'}
                  </>
                )}
              </button>
            </div>

            {/* Message */}
            {message && (
              <div
                id='form-message'
                className={clsx(
                  'flex items-center gap-2 rounded-lg p-4 text-sm',
                  messageType === 'success' &&
                    'border border-green-200 bg-green-50 text-green-800',
                  messageType === 'error' &&
                    'border border-red-200 bg-red-50 text-red-800',
                  messageType === 'info' &&
                    'border border-blue-200 bg-blue-50 text-blue-800'
                )}
                role={messageType === 'error' ? 'alert' : 'status'}
                aria-live='polite'
              >
                {messageType === 'success' && (
                  <FiCheck className='h-4 w-4 flex-shrink-0' />
                )}
                {messageType === 'error' && (
                  <FiAlertCircle className='h-4 w-4 flex-shrink-0' />
                )}
                <span>{message}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}

/* Helper Components */

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  error,
  children
}) => {
  return (
    <div>
      <label className='mb-1 block text-sm font-medium text-sky-700'>
        {label}
        {required && (
          <span className='ml-1 text-red-500' aria-label='required'>
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p className='mt-1 text-xs text-red-600' role='alert'>
          {error}
        </p>
      )}
    </div>
  )
}

/* Helper Functions */

const inputClassName = (error?: string) =>
  clsx(
    'w-full rounded-lg border px-3 py-2 text-sm transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500',
    error
      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-300'
      : 'border-slate-300 bg-white hover:border-slate-400'
  )
