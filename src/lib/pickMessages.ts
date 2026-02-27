// src/lib/pickMessages.ts
// Picks specific namespace keys from the messages object

export function pickMessages(
  messages: Record<string, unknown>,
  keys: string[]
): Record<string, unknown> {
  const picked: Record<string, unknown> = {}
  for (const key of keys) {
    if (key in messages) {
      picked[key] = messages[key]
    }
  }
  return picked
}
