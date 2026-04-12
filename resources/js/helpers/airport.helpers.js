const RUNWAY_SURFACES = {
  A: 'Asphalt',
  B: 'Bituminous',
  C: 'Concrete',
  CE: 'Cement',
  CR: 'Water',
  D: 'Dirt',
  G: 'Grass',
  GR: 'Gravel',
  M: 'Macadam',
  S: 'Sand',
  T: 'Tarmac',
  W: 'Water',
}

export const runwaySurface = (code) =>
  RUNWAY_SURFACES[code] ?? 'Unknown surface'
