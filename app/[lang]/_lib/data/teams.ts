// Participating teams across all editions of the Cascais Volley Cup.
// Update this file each year after the tournament concludes.

export interface Team {
  name: string
  country: string
}

export const PARTICIPATING_TEAMS: readonly Team[] = [
  // Spain
  { name: 'CV Madrid', country: 'ES' },
  { name: 'Dompa Ourense Volei', country: 'ES' },

  // Monaco
  { name: 'AS Monaco', country: 'MC' },

  // Portugal
  { name: 'CF "Os Belenenses"', country: 'PT' },
  { name: 'Lusófona VC', country: 'PT' },
  { name: 'Cascais Volley4all', country: 'PT' },
  { name: 'PEL Amora SC', country: 'PT' },
  { name: 'CJS Arouca', country: 'PT' },
  { name: 'Santiago V4A', country: 'PT' },
  { name: 'AR Canidelo', country: 'PT' },
  { name: 'AV Atlântico', country: 'PT' },
  { name: 'SC Vila Real', country: 'PT' },
  { name: 'CV Aveiro', country: 'PT' },
  { name: 'RC Santarém', country: 'PT' },
  { name: 'SC Arcozelo', country: 'PT' },
  { name: 'Madeira Torres', country: 'PT' },
  { name: 'São Francisco AD', country: 'PT' },
  { name: 'GDC Gueifães', country: 'PT' },
  { name: 'TC Alcochete', country: 'PT' },
  { name: 'AA Coimbra', country: 'PT' },
  { name: 'Lousada VC', country: 'PT' },
  { name: 'CA Madalena', country: 'PT' },
  { name: 'CV Póvoa', country: 'PT' },
  { name: 'AD Esposende', country: 'PT' },
  { name: 'Frei Gil VC', country: 'PT' },
  { name: 'CD Foz Porto', country: 'PT' },
  { name: 'Col. Julio Dinis', country: 'PT' },
  { name: 'Juventude SC', country: 'PT' },
  { name: 'CRCD Luzense', country: 'PT' },
  { name: 'Sporting CT', country: 'PT' }
] as const
