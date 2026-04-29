// src/lib/validation.ts
// Unified form validation utilities
// Replaces the 3 different validation implementations in:
// - RegistrationForm (registration page)
// - RegistrationToast (landing page modal)
// - ContactToast (accommodation contact modal)

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export interface FormErrors {
  [key: string]: string
}

// ──────────────────────────────────────────────
// Individual field validators
// ──────────────────────────────────────────────

/** Validate an email address */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Validate a phone number (international format).
 * Accepts optional +, digits, spaces, hyphens, parentheses.
 * Requires at least 6 digits.
 *
 * Previously there were 3 different regex patterns:
 * - RegistrationToast:  /^[\+]?[1-9]\d{1,14}$/ (E.164 strict, no spaces)
 * - RegistrationForm:   /^[\+]?[\s\-\(\)]*([0-9][\s\-\(\)]*){6,}$/ (lenient)
 * - ContactToast:       /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/ (middle ground)
 *
 * This unified version is lenient (allows formatting) but requires 6+ digits.
 */
export function isValidPhone(phone: string): boolean {
  // Strip all formatting characters to count actual digits
  const digitsOnly = phone.replace(/[\s\-\(\)\+]/g, '')
  // Must have at least 6 digits and only contain valid characters
  return (
    digitsOnly.length >= 6 &&
    digitsOnly.length <= 15 &&
    /^[\+]?[\d\s\-\(\)]+$/.test(phone)
  )
}

/** Check if a string has meaningful content */
export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0
}

/** Check minimum length (after trimming) */
export function hasMinLength(value: string, min: number): boolean {
  return value.trim().length >= min
}

/** Check if a string is a valid positive number */
export function isPositiveNumber(value: string): boolean {
  const num = Number(value)
  return !isNaN(num) && num >= 1
}

// ──────────────────────────────────────────────
// Registration form validation
// (used by RegistrationForm + RegistrationToast)
// ──────────────────────────────────────────────

export interface RegistrationFormData {
  name: string
  email: string
  mobile: string
  club: string
  city: string
  country: string
  questions: string
}

export const REGISTRATION_INITIAL_DATA: RegistrationFormData = {
  name: '',
  email: '',
  mobile: '',
  club: '',
  city: '',
  country: '',
  questions: ''
}

/**
 * Validate registration form fields.
 * Pass a translation function `t` to get localized error messages.
 * The `t` function should accept a key and return a string.
 */
export function validateRegistrationForm(
  data: RegistrationFormData,
  t: (key: string) => string
): FormErrors {
  const errors: FormErrors = {}

  if (!isNonEmpty(data.name)) {
    errors.name = t('nameRequired') || 'Name is required'
  } else if (!hasMinLength(data.name, 2)) {
    errors.name = t('nameMinLength') || 'Name must be at least 2 characters'
  }

  if (!isNonEmpty(data.email)) {
    errors.email = t('emailRequired') || 'Email is required'
  } else if (!isValidEmail(data.email)) {
    errors.email = t('emailInvalid') || 'Please enter a valid email'
  }

  if (!isNonEmpty(data.club)) {
    errors.club = t('clubRequired') || 'Club is required'
  }

  if (!isNonEmpty(data.city)) {
    errors.city = t('cityRequired') || 'City is required'
  }

  if (!isNonEmpty(data.country)) {
    errors.country = t('countryRequired') || 'Country is required'
  }

  if (data.mobile && !isValidPhone(data.mobile)) {
    errors.mobile = t('mobileInvalid') || 'Please enter a valid phone number'
  }

  return errors
}

// ──────────────────────────────────────────────
// Accommodation contact form validation
// (used by ContactToast)
// ──────────────────────────────────────────────

export interface AccommodationFormData {
  teamName: string
  country: string
  teamManagerName: string
  phone: string
  email: string
  ageGroup: string
  numberOfPeople: string
  message: string
}

export const ACCOMMODATION_INITIAL_DATA: AccommodationFormData = {
  teamName: '',
  country: '',
  teamManagerName: '',
  phone: '',
  email: '',
  ageGroup: '',
  numberOfPeople: '',
  message: ''
}

/**
 * Validate accommodation contact form fields.
 */
export function validateAccommodationForm(
  data: AccommodationFormData,
  t: (key: string) => string
): FormErrors {
  const errors: FormErrors = {}

  if (!isNonEmpty(data.teamName)) {
    errors.teamName = t('teamNameRequired') || 'Team name is required'
  }

  if (!isNonEmpty(data.country)) {
    errors.country = t('countryRequired') || 'Country is required'
  }

  if (!isNonEmpty(data.teamManagerName)) {
    errors.teamManagerName =
      t('managerNameRequired') || 'Team manager name is required'
  } else if (!hasMinLength(data.teamManagerName, 2)) {
    errors.teamManagerName =
      t('managerNameMinLength') || 'Name must be at least 2 characters'
  }

  if (!isNonEmpty(data.email)) {
    errors.email = t('emailRequired') || 'Email is required'
  } else if (!isValidEmail(data.email)) {
    errors.email = t('emailInvalid') || 'Please enter a valid email'
  }

  if (!isNonEmpty(data.ageGroup)) {
    errors.ageGroup = t('ageGroupRequired') || 'Age group is required'
  }

  if (!isNonEmpty(data.numberOfPeople)) {
    errors.numberOfPeople =
      t('numberOfPeopleRequired') || 'Number of people is required'
  } else if (!isPositiveNumber(data.numberOfPeople)) {
    errors.numberOfPeople =
      t('numberOfPeopleInvalid') || 'Please enter a valid number'
  }

  if (data.phone && !isValidPhone(data.phone)) {
    errors.phone = t('phoneInvalid') || 'Please enter a valid phone number'
  }

  return errors
}
