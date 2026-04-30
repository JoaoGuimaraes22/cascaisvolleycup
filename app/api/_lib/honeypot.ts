export const HONEYPOT_FIELD = 'website'

export function isBotSubmission(body: unknown): boolean {
  if (!body || typeof body !== 'object') return false
  const value = (body as Record<string, unknown>)[HONEYPOT_FIELD]
  return typeof value === 'string' && value.length > 0
}
