// src/data/winners.ts
// Tournament winners data, extracted from HallOfFameWinners component.
// Update this file each year after the tournament concludes.

export type DivisionKey = 'Sub15' | 'Sub17' | 'Open'

export interface Winner {
  name: string
  country: string
}

export const DIVISIONS: DivisionKey[] = ['Sub15', 'Sub17', 'Open']

export const WINNERS: Record<string, Record<DivisionKey, Winner[]>> = {
  '2026': {
    Sub15: [
      { name: 'São Francisco AD B', country: 'PT' },
      { name: 'ALA Gondomar A', country: 'PT' },
      { name: 'São Francisco AD A', country: 'PT' }
    ],
    Sub17: [
      { name: 'GD Estreito A', country: 'PT' },
      { name: 'ADC Santa Isabel', country: 'PT' },
      { name: 'EE Cacereñas VB', country: 'ES' }
    ],
    Open: [
      { name: "AVB Val d'Yerres", country: 'FR' },
      { name: 'Cascais Volley4all', country: 'PT' },
      { name: 'SVR Benfica', country: 'PT' }
    ]
  },
  '2025': {
    Sub15: [
      { name: 'PEL Amora SC A', country: 'PT' },
      { name: 'Cascais Volley4all', country: 'PT' },
      { name: 'PEL Amora SC B', country: 'PT' }
    ],
    Sub17: [
      { name: 'SC Arcozelo', country: 'PT' },
      { name: 'PEL Amora SC', country: 'PT' },
      { name: 'São Francisco AD', country: 'PT' }
    ],
    Open: [
      { name: 'Cascais Volley4all', country: 'PT' },
      { name: 'CV Madrid', country: 'ES' },
      { name: 'AS Mónaco', country: 'MC' }
    ]
  },
  '2024': {
    Sub15: [
      { name: 'SC Arcozelo A', country: 'PT' },
      { name: 'SC Arcozelo B', country: 'PT' },
      { name: 'GDC Gueifães', country: 'PT' }
    ],
    Sub17: [
      { name: 'SC Arcozelo', country: 'PT' },
      { name: 'SC Vila Real', country: 'PT' },
      { name: 'Cascais Volley4all', country: 'PT' }
    ],
    Open: []
  },
  '2023': {
    Sub15: [
      { name: 'CF "Os Belenenses"', country: 'PT' },
      { name: 'CJS Arouca', country: 'PT' },
      { name: 'Cascais Volley4all', country: 'PT' }
    ],
    Sub17: [
      { name: 'Madeira Torres', country: 'PT' },
      { name: 'Cascais Volley4all', country: 'PT' },
      { name: 'Lusófona VC', country: 'PT' }
    ],
    Open: []
  }
}

/** Get sorted list of available years (newest first) */
export function getAvailableYears(): string[] {
  return Object.keys(WINNERS).sort((a, b) => Number(b) - Number(a))
}

/** Get winners for a specific year and division */
export function getWinners(year: string, division: DivisionKey): Winner[] {
  return WINNERS[year]?.[division] ?? []
}
