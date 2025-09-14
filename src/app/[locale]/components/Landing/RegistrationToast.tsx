// RegistrationToast component with registration form functionality
'use client'

import { useState, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { FiX, FiCheck, FiAlertCircle, FiLoader } from 'react-icons/fi'
import Image from 'next/image'
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

interface RegistrationToastProps {
  isOpen: boolean
  onClose: () => void
}

function RegistrationToast({ isOpen, onClose }: RegistrationToastProps) {
  const t = useTranslations('RegistrationPage.Form')

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
        !/^[\+]?[1-9]\d{1,14}$/.test(data.mobile.replace(/\s/g, ''))
      ) {
        newErrors.mobile =
          t('ValidationErrors.mobileInvalid') ||
          'Please enter a valid phone number'
      }

      return newErrors
    },
    [t]
  )

  // Handle form input changes
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setFormData(prev => ({ ...prev, [name]: value }))

      // Clear field error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }))
      }
    },
    [errors]
  )

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = validateForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setMessage('')
    setMessageType(null)

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          type: 'tournament_registration'
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(
          data.message ||
            t('SuccessMessage') ||
            'Registration submitted successfully! We will contact you soon.'
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

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      name: '',
      email: '',
      mobile: '',
      club: '',
      city: '',
      country: '',
      questions: ''
    })
    setErrors({})
    setMessage('')
    setMessageType(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 z-50 bg-black/10 transition-opacity'
        onClick={handleClose}
      />

      {/* Modal */}
      <div className='fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 transform px-4 sm:mx-4 sm:w-full'>
        <div className='max-h-[90vh] overflow-y-auto rounded-lg border border-gray-200 bg-white p-4 shadow-2xl sm:max-h-[95vh] sm:p-6'>
          {/* Header */}
          <div className='mb-4 flex items-center justify-between'>
            <div className='flex items-center gap-2 sm:gap-3'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-sky-100'>
                <FiCheck className='h-4 w-4 text-sky-600' />
              </div>
              <h3 className='text-base font-bold text-gray-900 sm:text-lg'>
                {t('FormTitle') || 'Tournament Registration'}
              </h3>
            </div>
            <button
              onClick={handleClose}
              className='rounded-full p-1 transition-colors hover:bg-gray-100'
              aria-label='Close modal'
            >
              <FiX className='h-5 w-5 text-gray-500' />
            </button>
          </div>

          <p className='mb-6 text-sm text-gray-600'>
            {t('FormDescription') ||
              'Fill out the form below to register for the Cascais Volley Cup 2026'}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-4' noValidate>
            <div className='space-y-4'>
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
                  className={textareaClassName(errors.questions)}
                  placeholder={
                    t('QuestionsPlaceholder') ||
                    'Any questions, dietary requirements, or special requests...'
                  }
                  rows={4}
                />
              </FormField>
            </div>

            {/* Submit Button */}
            <div className='mt-6'>
              <button
                type='submit'
                disabled={loading}
                className={clsx(
                  'flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white transition-all duration-300',
                  loading
                    ? 'cursor-not-allowed bg-slate-400'
                    : 'bg-sky-700 hover:scale-105 hover:bg-sky-800 hover:shadow-xl active:scale-95'
                )}
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
                className={clsx(
                  'mt-4 flex items-center gap-2 rounded-lg p-4 text-sm',
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
    </>
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

const textareaClassName = (error?: string) =>
  clsx(
    'w-full rounded-lg border px-3 py-2 text-sm transition-colors resize-none',
    'focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500',
    error
      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-300'
      : 'border-slate-300 bg-white hover:border-slate-400'
  )

export default RegistrationToast
