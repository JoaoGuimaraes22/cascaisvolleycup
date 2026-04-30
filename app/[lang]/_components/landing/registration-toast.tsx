'use client'

import { useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { FiX, FiCheck, FiAlertCircle, FiLoader } from 'react-icons/fi'
import clsx from 'clsx'
import {
  validateRegistrationForm,
  REGISTRATION_INITIAL_DATA,
  type RegistrationFormData,
  type FormErrors
} from '../../_lib/validation'
import { useIsClient } from '../../_hooks/use-is-client'

type MessageType = 'success' | 'error' | 'info' | null

type ValidationErrorsDict = {
  nameRequired: string
  nameMinLength: string
  emailRequired: string
  emailInvalid: string
  clubRequired: string
  cityRequired: string
  countryRequired: string
  mobileInvalid: string
  fixErrors: string
}

export type RegistrationFormDict = {
  FormTitle: string
  FormDescription: string
  Name: string
  NamePlaceholder: string
  Mobile: string
  Club: string
  ClubPlaceholder: string
  City: string
  CityPlaceholder: string
  Country: string
  CountryPlaceholder: string
  Questions: string
  QuestionsPlaceholder: string
  Submit: string
  Submitting: string
  SuccessMessage: string
  ErrorMessage: string
  ValidationErrors: ValidationErrorsDict
}

interface RegistrationToastProps {
  isOpen: boolean
  onClose: () => void
  dict: RegistrationFormDict
}

function RegistrationToast({ isOpen, onClose, dict }: RegistrationToastProps) {
  const [formData, setFormData] = useState<RegistrationFormData>(
    REGISTRATION_INITIAL_DATA
  )

  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<MessageType>(null)

  const validateForm = useCallback(
    (data: RegistrationFormData): FormErrors =>
      validateRegistrationForm(
        data,
        key =>
          (dict.ValidationErrors as unknown as Record<string, string>)[key] ??
          key
      ),
    [dict]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setFormData(prev => ({ ...prev, [name]: value }))

      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }))
      }
    },
    [errors]
  )

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
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message || dict.SuccessMessage)
        setMessageType('success')
        setFormData({ ...REGISTRATION_INITIAL_DATA })
      } else {
        setMessage(data.message || dict.ErrorMessage)
        setMessageType('error')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setMessage(dict.ErrorMessage)
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({ ...REGISTRATION_INITIAL_DATA })
    setErrors({})
    setMessage('')
    setMessageType(null)
    onClose()
  }

  const isClient = useIsClient()

  if (!isOpen || !isClient) return null

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 z-[300] bg-black/10 motion-safe:transition-opacity'
        onClick={handleClose}
      />

      {/* Modal */}
      <div className='fixed inset-0 z-[300] flex items-center justify-center px-4 pt-20 pb-4 sm:pt-4'>
        <div className='max-h-[80vh] w-[95vw] max-w-2xl overflow-y-auto rounded-lg border border-gray-200 bg-white p-4 shadow-2xl sm:max-h-[90vh] sm:p-6'>
          {/* Header */}
          <div className='mb-4 flex items-center justify-between'>
            <div className='flex items-center gap-2 sm:gap-3'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-sky-100'>
                <FiCheck className='h-4 w-4 text-sky-600' />
              </div>
              <h3 className='text-base font-bold text-gray-900 sm:text-lg'>
                {dict.FormTitle}
              </h3>
            </div>
            <button
              onClick={handleClose}
              className='rounded-full p-1 hover:bg-gray-100 motion-safe:transition-colors'
              aria-label='Close modal'
            >
              <FiX className='h-5 w-5 text-gray-500' />
            </button>
          </div>

          <p className='mb-6 text-sm text-gray-600'>{dict.FormDescription}</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-4' noValidate>
            <div className='space-y-4'>
              {/* Name */}
              <FormField label={dict.Name} required error={errors.name}>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClassName(errors.name)}
                  placeholder={dict.NamePlaceholder}
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

                <FormField label={dict.Mobile} error={errors.mobile}>
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
              <FormField label={dict.Club} required error={errors.club}>
                <input
                  type='text'
                  name='club'
                  value={formData.club}
                  onChange={handleChange}
                  className={inputClassName(errors.club)}
                  placeholder={dict.ClubPlaceholder}
                  required
                />
              </FormField>

              {/* City + Country */}
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <FormField label={dict.City} required error={errors.city}>
                  <input
                    type='text'
                    name='city'
                    value={formData.city}
                    onChange={handleChange}
                    className={inputClassName(errors.city)}
                    placeholder={dict.CityPlaceholder}
                    required
                  />
                </FormField>

                <FormField label={dict.Country} required error={errors.country}>
                  <input
                    type='text'
                    name='country'
                    value={formData.country}
                    onChange={handleChange}
                    className={inputClassName(errors.country)}
                    placeholder={dict.CountryPlaceholder}
                    required
                  />
                </FormField>
              </div>

              {/* Questions */}
              <FormField label={dict.Questions} error={errors.questions}>
                <textarea
                  name='questions'
                  value={formData.questions}
                  onChange={handleChange}
                  className={textareaClassName(errors.questions)}
                  placeholder={dict.QuestionsPlaceholder}
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
                  'flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold text-white duration-300 motion-safe:transition-all',
                  loading
                    ? 'cursor-not-allowed bg-slate-400'
                    : 'bg-sky-700 hover:scale-105 hover:bg-sky-800 hover:shadow-xl active:scale-95'
                )}
              >
                {loading ? (
                  <>
                    <FiLoader
                      className='h-5 w-5 motion-safe:animate-spin'
                      aria-hidden='true'
                    />
                    {dict.Submitting}
                  </>
                ) : (
                  <>
                    <FiCheck className='h-5 w-5' aria-hidden='true' />
                    {dict.Submit}
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
    </>,
    document.body
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
    'w-full rounded-lg border px-3 py-2 text-sm motion-safe:transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500',
    error
      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-300'
      : 'border-slate-300 bg-white hover:border-slate-400'
  )

const textareaClassName = (error?: string) =>
  clsx(
    'w-full rounded-lg border px-3 py-2 text-sm motion-safe:transition-colors resize-none',
    'focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500',
    error
      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-300'
      : 'border-slate-300 bg-white hover:border-slate-400'
  )

export default RegistrationToast
