// Updated ContactToast component with form functionality
'use client'

import { useState, useCallback, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { FiX, FiCheck, FiAlertCircle, FiLoader } from 'react-icons/fi'
import Image from 'next/image'
import clsx from 'clsx'

interface FormData {
  teamName: string
  country: string
  teamManagerName: string
  phone: string
  email: string
  ageGroup: string
  numberOfPeople: string
  message: string
}

interface FormErrors {
  [key: string]: string
}

type MessageType = 'success' | 'error' | 'info' | null

interface ContactToastProps {
  isOpen: boolean
  onClose: () => void
}

function ContactToast({ isOpen, onClose }: ContactToastProps) {
  const t = useTranslations('ContactModal')

  const [formData, setFormData] = useState<FormData>({
    teamName: '',
    country: '',
    teamManagerName: '',
    phone: '',
    email: '',
    ageGroup: '',
    numberOfPeople: '',
    message: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<MessageType>(null)

  // Form validation
  const validateForm = useCallback(
    (data: FormData): FormErrors => {
      const newErrors: FormErrors = {}

      if (!data.teamName.trim()) {
        newErrors.teamName =
          t('validation.teamNameRequired') || 'Team name is required'
      }

      if (!data.country.trim()) {
        newErrors.country =
          t('validation.countryRequired') || 'Country is required'
      }

      if (!data.teamManagerName.trim()) {
        newErrors.teamManagerName =
          t('validation.managerNameRequired') || 'Team manager name is required'
      } else if (data.teamManagerName.trim().length < 2) {
        newErrors.teamManagerName =
          t('validation.managerNameMinLength') ||
          'Name must be at least 2 characters'
      }

      if (!data.email.trim()) {
        newErrors.email = t('validation.emailRequired') || 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        newErrors.email =
          t('validation.emailInvalid') || 'Please enter a valid email'
      }

      if (!data.ageGroup.trim()) {
        newErrors.ageGroup =
          t('validation.ageGroupRequired') || 'Age group is required'
      }

      if (!data.numberOfPeople.trim()) {
        newErrors.numberOfPeople =
          t('validation.numberOfPeopleRequired') ||
          'Number of people is required'
      } else if (
        isNaN(Number(data.numberOfPeople)) ||
        Number(data.numberOfPeople) < 1
      ) {
        newErrors.numberOfPeople =
          t('validation.numberOfPeopleInvalid') || 'Please enter a valid number'
      }

      if (
        data.phone &&
        !/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/.test(data.phone.replace(/\s/g, ''))
      ) {
        newErrors.phone =
          t('validation.phoneInvalid') || 'Please enter a valid phone number'
      }

      return newErrors
    },
    [t]
  )

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
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

    const newErrors = validateForm(formData)
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    setLoading(true)
    setMessage('')
    setMessageType(null)

    try {
      // Here you would typically send the data to your API
      const response = await fetch('/api/osports-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(
          t('successMessage') ||
            'Your accommodation request has been sent successfully!'
        )
        setMessageType('success')
        setFormData({
          teamName: '',
          country: '',
          teamManagerName: '',
          phone: '',
          email: '',
          ageGroup: '',
          numberOfPeople: '',
          message: ''
        })
        // Close modal after 3 seconds on success
        setTimeout(() => {
          onClose()
        }, 3000)
      } else {
        setMessage(
          data.message ||
            t('errorMessage') ||
            'Failed to send request. Please try again.'
        )
        setMessageType('error')
      }
    } catch (error) {
      console.error('Contact error:', error)
      setMessage(t('errorMessage') || 'Something went wrong. Please try again.')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      teamName: '',
      country: '',
      teamManagerName: '',
      phone: '',
      email: '',
      ageGroup: '',
      numberOfPeople: '',
      message: ''
    })
    setErrors({})
    setMessage('')
    setMessageType(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop - Exact same as Registration Hero */}
      <div
        className='fixed inset-0 z-50 bg-black/10 transition-opacity'
        onClick={handleClose}
      />

      {/* Toast/Modal - Responsive sizing with proper viewport constraints */}
      <div className='fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-lg -translate-x-1/2 -translate-y-1/2 transform px-4 sm:mx-4 sm:w-full'>
        <div className='max-h-[80vh] overflow-y-auto rounded-lg border border-gray-200 bg-white p-4 shadow-2xl sm:max-h-[95vh] sm:p-6'>
          {/* Header */}
          <div className='mb-4 flex items-center justify-between'>
            <div className='flex items-center gap-2 sm:gap-3'>
              <Image
                src='/img/sponsors/o-sports.webp'
                alt='O-Sports'
                width={60}
                height={30}
                className='h-auto w-[40px] opacity-80 sm:w-[50px]'
                loading='lazy'
                quality={80}
              />
              <h3 className='text-base font-bold text-gray-900 sm:text-lg'>
                {t('title') || 'Contact O-Sports'}
              </h3>
            </div>
            <button
              onClick={handleClose}
              className='rounded-full p-1 transition-colors hover:bg-gray-100'
              aria-label={t('closeButton') || 'Close modal'}
            >
              <FiX className='h-5 w-5 text-gray-500' />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-4' noValidate>
            <div className='space-y-4'>
              {/* Team Name */}
              <FormField
                label={t('fields.teamName') || 'Team Name'}
                required
                error={errors.teamName}
              >
                <input
                  type='text'
                  name='teamName'
                  value={formData.teamName}
                  onChange={handleChange}
                  className={inputClassName(errors.teamName)}
                  placeholder={
                    t('placeholders.teamName') || 'Enter your team name'
                  }
                  required
                />
              </FormField>

              {/* Country and Age Group Row */}
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <FormField
                  label={t('fields.country') || 'Country'}
                  required
                  error={errors.country}
                >
                  <input
                    type='text'
                    name='country'
                    value={formData.country}
                    onChange={handleChange}
                    className={inputClassName(errors.country)}
                    placeholder={
                      t('placeholders.country') || 'Enter your country'
                    }
                    required
                  />
                </FormField>

                <FormField
                  label={t('fields.ageGroup') || 'Age Group'}
                  required
                  error={errors.ageGroup}
                >
                  <select
                    name='ageGroup'
                    value={formData.ageGroup}
                    onChange={handleChange}
                    className={inputClassName(errors.ageGroup)}
                    required
                  >
                    <option value=''>
                      {t('placeholders.ageGroup') || 'Select age group'}
                    </option>
                    <option value='U15'>U15</option>
                    <option value='U17'>U17</option>
                    <option value='Open'>Open</option>
                  </select>
                </FormField>
              </div>

              {/* Team Manager Name */}
              <FormField
                label={t('fields.teamManagerName') || 'Team Manager Name'}
                required
                error={errors.teamManagerName}
              >
                <input
                  type='text'
                  name='teamManagerName'
                  value={formData.teamManagerName}
                  onChange={handleChange}
                  className={inputClassName(errors.teamManagerName)}
                  placeholder={
                    t('placeholders.teamManagerName') ||
                    'Enter team manager name'
                  }
                  required
                />
              </FormField>

              {/* Email and Phone Row */}
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <FormField
                  label={t('fields.email') || 'Email'}
                  required
                  error={errors.email}
                >
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClassName(errors.email)}
                    placeholder={
                      t('placeholders.email') || 'Enter email address'
                    }
                    required
                  />
                </FormField>

                <FormField
                  label={t('fields.phone') || 'Phone'}
                  error={errors.phone}
                >
                  <input
                    type='tel'
                    name='phone'
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClassName(errors.phone)}
                    placeholder={
                      t('placeholders.phone') || 'Enter phone number'
                    }
                  />
                </FormField>
              </div>

              {/* Number of People */}
              <FormField
                label={t('fields.numberOfPeople') || 'Number of People'}
                required
                error={errors.numberOfPeople}
              >
                <input
                  type='number'
                  name='numberOfPeople'
                  value={formData.numberOfPeople}
                  onChange={handleChange}
                  className={inputClassName(errors.numberOfPeople)}
                  placeholder={
                    t('placeholders.numberOfPeople') ||
                    'Enter total number of people'
                  }
                  min='1'
                  required
                />
              </FormField>

              {/* Message */}
              <FormField
                label={t('fields.message') || 'Additional Message'}
                error={errors.message}
              >
                <textarea
                  name='message'
                  value={formData.message}
                  onChange={handleChange}
                  className={textareaClassName(errors.message)}
                  placeholder={
                    t('placeholders.message') ||
                    'Enter any additional information or special requests...'
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
                    {t('submitting') || 'Sending...'}
                  </>
                ) : (
                  <>
                    <FiCheck className='h-5 w-5' aria-hidden='true' />
                    {t('submit') || 'Send Accommodation Request'}
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

export default ContactToast
